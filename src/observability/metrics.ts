import type { NextFunction, Request, Response } from "express";
import { collectDefaultMetrics, Counter, Histogram, Registry } from "prom-client";

export const metricsRegistry = new Registry();

collectDefaultMetrics({
  register: metricsRegistry,
  prefix: "central_system_"
});

const httpRequestDurationMs = new Histogram({
  name: "central_system_http_request_duration_ms",
  help: "Duration of HTTP requests in milliseconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [10, 25, 50, 100, 250, 500, 1000, 2000],
  registers: [metricsRegistry]
});

const httpRequestTotal = new Counter({
  name: "central_system_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [metricsRegistry]
});

const normalizeRoute = (request: Request): string => request.route?.path ?? request.path;

export const metricsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
  const startTime = process.hrtime.bigint();

  response.once("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;

    const labels = {
      method: request.method,
      route: normalizeRoute(request),
      status_code: String(response.statusCode)
    };

    httpRequestDurationMs.observe(labels, durationMs);
    httpRequestTotal.inc(labels);
  });

  next();
};
