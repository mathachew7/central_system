export interface Ministry {
  id: string;
  slug: string;
  name: string;
  nameNe?: string;
  description?: string;
  sourceUrl: string;
  sourceType: string;
  lastCheckedAt: string;
  projectCount?: number;
  noticeCount?: number;
}

export interface Project {
  id: string;
  ministryId: string;
  title: string;
  description?: string;
  budgetNpr?: number;
  startDate?: string;
  endDate?: string;
  status: "planned" | "active" | "on_hold" | "completed";
  sourceUrl: string;
  sourceType: string;
  lastCheckedAt: string;
  lastUpdatedAt: string;
}

export interface Notice {
  id: string;
  ministryId: string;
  title: string;
  category: "notice" | "news" | "press_release" | "policy";
  publishedAt: string;
  summary?: string;
  sourceUrl: string;
  sourceType: string;
  lastCheckedAt: string;
}

export interface MinistryDetail extends Ministry {
  projects: Project[];
  notices: Notice[];
}

export interface ComplaintCreateResponse {
  ticketId: string;
  status: string;
  createdAt: string;
  requestId: string;
}

export interface ComplaintTicket {
  ticketId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type SourceRegistryCategory =
  | "federal_ministries"
  | "constitutional_bodies"
  | "regulatory_bodies"
  | "judiciary"
  | "security_services"
  | "disaster_sources"
  | "parliament"
  | "provinces";

export interface SourceRegistryEntry {
  id: string;
  name: string;
  name_ne?: string;
  base_url: string;
  scraper_class: string;
  endpoints?: Record<string, string>;
  has_api?: boolean;
  api_url?: string;
  priority: 1 | 2 | 3;
  poll_interval_mins: number;
}

export type SourceRegistryMap = Record<SourceRegistryCategory, SourceRegistryEntry[]>;

export interface SourceRegistryResponse {
  data: SourceRegistryMap;
  meta: {
    categoryCounts: { category: SourceRegistryCategory; count: number }[];
    totalSources: number;
    totalCategories: number;
  };
}

export type GovernmentAgendaStatus = "not-started" | "in-progress" | "completed" | "broken" | "stalled";

export interface GovernmentAgendaCategory {
  id: string;
  ne: string;
  en: string;
}

export interface GovernmentAgendaStatusConfig {
  ne: string;
  en: string;
  color: string;
}

export interface GovernmentAgendaDetail {
  description?: string;
  impact?: string;
  whyNeeded?: string;
}

export interface GovernmentAgendaItem {
  id: number;
  category: string;
  categoryNe: string;
  categoryEn: string;
  titleNe: string;
  titleEn: string;
  deadline: string;
  deadlineDate: string;
  status: GovernmentAgendaStatus;
  progress: number;
  lastUpdated: string;
  evidence?: string;
  notes?: string;
  details: GovernmentAgendaDetail | null;
}

export interface GovernmentAgendaTrackerResponse {
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
  categories: GovernmentAgendaCategory[];
  statusConfig: Record<GovernmentAgendaStatus, GovernmentAgendaStatusConfig>;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    broken: number;
    stalled: number;
    notStarted: number;
    overallProgress: number;
    lastUpdated: string | null;
  };
  promises: GovernmentAgendaItem[];
}
