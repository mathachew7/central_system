import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./core/errors.js";
import { logger } from "./core/logger.js";
import { requestContext } from "./core/request-context.js";
import { metricsRegistry, metricsMiddleware } from "./observability/metrics.js";
import { apiRouter } from "./routes/index.js";

const requestLogger = (request: Request, response: Response, next: NextFunction): void => {
  const startTime = process.hrtime.bigint();

  response.once("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
    logger.info(
      {
        requestId: request.requestId,
        method: request.method,
        path: request.path,
        statusCode: response.statusCode,
        durationMs
      },
      "HTTP request completed"
    );
  });

  next();
};

export const createApp = (): express.Express => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      methods: ["GET", "POST", "PATCH"],
      credentials: false
    })
  );

  app.use(requestContext);
  app.use(
    requestLogger
  );

  app.use(express.json({ limit: "100kb" }));

  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please try again later."
        }
      }
    })
  );

  app.use(metricsMiddleware);

  app.get("/", (_request, response) => {
    response.json({
      service: "central-system-api",
      status: "ok",
      version: "v1",
      docs: {
        process: "/docs/process-implementation.md",
        logging: "/docs/logging.md"
      },
      endpoints: {
        health: "/healthz",
        readiness: "/readyz",
        metrics: "/metrics",
        apiBase: "/api/v1",
        sources: "/api/v1/sources",
        sourcesRaw: "/api/v1/sources/raw"
      }
    });
  });

  app.get("/healthz", (_request, response) => {
    response.json({ status: "ok", service: "central-system-api", timestamp: new Date().toISOString() });
  });

  app.get("/readyz", (_request, response) => {
    response.json({ status: "ready" });
  });

  app.get("/metrics", async (_request, response) => {
    response.setHeader("Content-Type", metricsRegistry.contentType);
    response.end(await metricsRegistry.metrics());
  });

  app.use("/api/v1", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
