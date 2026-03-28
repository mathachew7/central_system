import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  CORS_ORIGINS: z.string().default("*"),
  ADMIN_API_KEY: z.string().min(16).optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  OTEL_SERVICE_NAME: z.string().default("central-system-api"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

const rawEnv = parsed.data;

export const env = {
  ...rawEnv,
  corsOrigins:
    rawEnv.CORS_ORIGINS === "*"
      ? "*"
      : rawEnv.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
};
