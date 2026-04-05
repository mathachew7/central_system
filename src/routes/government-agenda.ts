import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { Router } from "express";
import { z } from "zod";

import { AppError } from "../core/errors.js";
import { logger } from "../core/logger.js";

const TRACKER_HOME_URL = "https://pratipakchya.com/";
const PROMISES_URL = "https://pratipakchya.com/promises.js";
const DETAILS_URL = "https://pratipakchya.com/promise-details.js";
const APP_URL = "https://pratipakchya.com/app.js";
const CACHE_TTL_MS = 5 * 60 * 1000;
const UPSTREAM_TIMEOUT_MS = 8_000;
const SNAPSHOT_PATH = path.resolve(process.cwd(), "data", "government-agenda-cache.json");

const knownTrackerStatuses = [
  "not-started",
  "in-progress",
  "completed",
  "broken",
  "stalled",
  "delayed",
  "manifesto-only"
] as const;

const trackerStatusSchema = z.string().min(1);

const trackerPromiseSchema = z.object({
  id: z.number().int().positive(),
  category: z.string().min(1),
  categoryNe: z.string().min(1),
  categoryEn: z.string().min(1),
  titleNe: z.string().min(1),
  titleEn: z.string().min(1),
  deadline: z.string().min(1),
  deadlineDate: z.string().min(1),
  status: trackerStatusSchema,
  progress: z.number().min(0).max(100),
  lastUpdated: z.string().min(1),
  evidence: z.string().optional().default(""),
  notes: z.string().optional().default("")
});

const trackerDetailSchema = z.object({
  description: z.string().optional().default(""),
  impact: z.string().optional().default(""),
  whyNeeded: z.string().optional().default("")
});

const trackerCategorySchema = z.object({
  id: z.string().min(1),
  ne: z.string().min(1),
  en: z.string().min(1)
});

const trackerStatusConfigSchema = z.record(
  z.string().min(1),
  z.object({
    ne: z.string().min(1),
    en: z.string().min(1),
    color: z.string().min(1)
  })
);

type TrackerPromise = z.infer<typeof trackerPromiseSchema>;
type TrackerDetail = z.infer<typeof trackerDetailSchema>;
type TrackerCategory = z.infer<typeof trackerCategorySchema>;
type KnownTrackerStatus = (typeof knownTrackerStatuses)[number];
type TrackerStatus = z.infer<typeof trackerStatusSchema>;
type TrackerStatusConfig = z.infer<typeof trackerStatusConfigSchema>;

interface GovernmentAgendaResponse {
  source: {
    platformName: string;
    homepageUrl: string;
    promisesUrl: string;
    detailsUrl: string;
    appUrl: string;
    fetchedAt: string;
  };
  plan: {
    startAt: string;
    endAt: string;
    totalDays: number | null;
  };
  categories: TrackerCategory[];
  statusConfig: TrackerStatusConfig;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    broken: number;
    stalled: number;
    delayed: number;
    manifestoOnly: number;
    notStarted: number;
    overallProgress: number;
    lastUpdated: string | null;
  };
  promises: Array<
    TrackerPromise & {
      details: TrackerDetail | null;
    }
  >;
}

let cachedTracker: { expiresAt: number; value: GovernmentAgendaResponse } | null = null;
let snapshotLoadAttempted = false;
let refreshInFlight: Promise<GovernmentAgendaResponse> | null = null;

const governmentAgendaResponseSchema = z.object({
  source: z.object({
    platformName: z.string().min(1),
    homepageUrl: z.string().min(1),
    promisesUrl: z.string().min(1),
    detailsUrl: z.string().min(1),
    appUrl: z.string().min(1),
    fetchedAt: z.string().min(1)
  }),
  plan: z.object({
    startAt: z.string(),
    endAt: z.string(),
    totalDays: z.number().nullable()
  }),
  categories: z.array(trackerCategorySchema),
  statusConfig: trackerStatusConfigSchema,
  stats: z.object({
    total: z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
    inProgress: z.number().int().nonnegative(),
    broken: z.number().int().nonnegative(),
    stalled: z.number().int().nonnegative(),
    delayed: z.number().int().nonnegative(),
    manifestoOnly: z.number().int().nonnegative(),
    notStarted: z.number().int().nonnegative(),
    overallProgress: z.number().min(0).max(100),
    lastUpdated: z.string().nullable()
  }),
  promises: z.array(
    trackerPromiseSchema.extend({
      details: trackerDetailSchema.nullable()
    })
  )
});

const extractConstValues = <T extends Record<string, unknown>>(source: string, names: string[]): T => {
  const evaluator = new Function(`${source}\nreturn { ${names.join(", ")} };`);
  return evaluator() as T;
};

const extractDateConstant = (source: string, name: string): string | null => {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*new Date\\('([^']+)'\\)`));
  return match?.[1] ?? null;
};

const extractNumberConstant = (source: string, name: string): number | null => {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\d+)`));
  const value = match?.[1];
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeTrackerStatus = (status: string): TrackerStatus => {
  if (status === "failed") return "broken";
  return status;
};

const normalizeTrackerStatusConfig = (statusConfig: TrackerStatusConfig): TrackerStatusConfig => {
  if (statusConfig.failed && !statusConfig.broken) {
    return {
      ...statusConfig,
      broken: statusConfig.failed
    };
  }

  return statusConfig;
};

const fetchUpstreamText = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    headers: {
      "User-Agent": "central-system/0.1 (+https://pratipakchya.com/ compatibility fetch)"
    }
  });

  if (!response.ok) {
    throw new AppError(`Failed to fetch upstream tracker file: ${url}`, 502, "UPSTREAM_FETCH_FAILED", {
      url,
      status: response.status
    });
  }

  return response.text();
};

const persistTrackerSnapshot = async (value: GovernmentAgendaResponse): Promise<void> => {
  await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
  await writeFile(SNAPSHOT_PATH, JSON.stringify(value), "utf-8");
};

const loadTrackerSnapshot = async (): Promise<void> => {
  if (snapshotLoadAttempted) return;

  snapshotLoadAttempted = true;

  try {
    const rawSnapshot = await readFile(SNAPSHOT_PATH, "utf-8");
    const snapshot = governmentAgendaResponseSchema.parse(JSON.parse(rawSnapshot));

    cachedTracker = {
      expiresAt: 0,
      value: snapshot
    };
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : undefined;

    if (code === "ENOENT") {
      return;
    }

    logger.warn({ error }, "Failed to load government agenda snapshot");
  }
};

const fetchFreshGovernmentAgenda = async (): Promise<GovernmentAgendaResponse> => {
  const [promisesSource, detailsSource, appSource] = await Promise.all([
    fetchUpstreamText(PROMISES_URL),
    fetchUpstreamText(DETAILS_URL),
    fetchUpstreamText(APP_URL)
  ]);

  const promisesPayload = extractConstValues<{
    PROMISES: unknown;
    CATEGORIES: unknown;
    STATUS_CONFIG: unknown;
  }>(promisesSource, ["PROMISES", "CATEGORIES", "STATUS_CONFIG"]);

  const detailsPayload = extractConstValues<{ PROMISE_DETAILS: unknown }>(detailsSource, ["PROMISE_DETAILS"]);

  const promises = z.array(trackerPromiseSchema).parse(promisesPayload.PROMISES).map((promise) => ({
    ...promise,
    status: normalizeTrackerStatus(promise.status)
  }));
  const categories = z.array(trackerCategorySchema).parse(promisesPayload.CATEGORIES);
  const statusConfig = normalizeTrackerStatusConfig(trackerStatusConfigSchema.parse(promisesPayload.STATUS_CONFIG));
  const detailsMap = z.record(z.string(), trackerDetailSchema).parse(detailsPayload.PROMISE_DETAILS);

  const counts = promises.reduce<Record<KnownTrackerStatus, number>>(
    (acc, promise) => {
      if (promise.status in acc) {
        acc[promise.status as KnownTrackerStatus] += 1;
      }
      return acc;
    },
    {
      "not-started": 0,
      "in-progress": 0,
      completed: 0,
      broken: 0,
      stalled: 0,
      delayed: 0,
      "manifesto-only": 0
    }
  );

  const overallProgress = promises.length > 0
    ? Math.round(promises.reduce((sum, promise) => sum + promise.progress, 0) / promises.length)
    : 0;

  const lastUpdated = promises.reduce<string | null>((latest, promise) => {
    if (!latest || promise.lastUpdated > latest) return promise.lastUpdated;
    return latest;
  }, null);

  const mergedPromises = promises.map((promise) => ({
    ...promise,
    details: detailsMap[String(promise.id)] ?? null
  }));

  const response: GovernmentAgendaResponse = {
    source: {
      platformName: "Pratipakchya",
      homepageUrl: TRACKER_HOME_URL,
      promisesUrl: PROMISES_URL,
      detailsUrl: DETAILS_URL,
      appUrl: APP_URL,
      fetchedAt: new Date().toISOString()
    },
    plan: {
      startAt: extractDateConstant(appSource, "PLAN_START") ?? "",
      endAt: extractDateConstant(appSource, "PLAN_END") ?? "",
      totalDays: extractNumberConstant(appSource, "TOTAL_DAYS")
    },
    categories,
    statusConfig,
    stats: {
      total: promises.length,
      completed: counts.completed,
      inProgress: counts["in-progress"],
      broken: counts.broken,
      stalled: counts.stalled,
      delayed: counts.delayed,
      manifestoOnly: counts["manifesto-only"],
      notStarted: counts["not-started"],
      overallProgress,
      lastUpdated
    },
    promises: mergedPromises
  };

  cachedTracker = {
    expiresAt: Date.now() + CACHE_TTL_MS,
    value: response
  };

  try {
    await persistTrackerSnapshot(response);
  } catch (error) {
    logger.warn({ error }, "Failed to persist government agenda snapshot");
  }

  return response;
};

const refreshGovernmentAgenda = async (): Promise<GovernmentAgendaResponse> => {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = fetchFreshGovernmentAgenda().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

const loadGovernmentAgenda = async (): Promise<GovernmentAgendaResponse> => {
  await loadTrackerSnapshot();

  if (cachedTracker && cachedTracker.expiresAt > Date.now()) {
    return cachedTracker.value;
  }

  if (cachedTracker) {
    void refreshGovernmentAgenda().catch((error: unknown) => {
      logger.warn({ error }, "Failed to refresh government agenda in background");
    });

    return cachedTracker.value;
  }

  return refreshGovernmentAgenda();
};

export const warmGovernmentAgendaCache = async (): Promise<void> => {
  await loadTrackerSnapshot();

  if (cachedTracker && cachedTracker.expiresAt > Date.now()) {
    return;
  }

  try {
    await refreshGovernmentAgenda();
    logger.info("Government agenda cache warmed");
  } catch (error) {
    logger.warn({ error }, "Government agenda cache warmup failed");
  }
};

export const governmentAgendaRouter = Router();

governmentAgendaRouter.get("/", async (_request, response, next) => {
  try {
    const data = await loadGovernmentAgenda();
    response.json({ data });
  } catch (error) {
    next(error);
  }
});
