import pino from "pino";

import { env } from "../config/env.js";

export const logger = pino({
  name: "central-system-api",
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers['x-admin-api-key']",
      "contactEmail"
    ],
    censor: "[REDACTED]"
  }
});
