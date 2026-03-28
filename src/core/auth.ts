import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env.js";
import { AppError } from "./errors.js";

export const requireAdminApiKey = (request: Request, _response: Response, next: NextFunction): void => {
  if (!env.ADMIN_API_KEY) {
    next(new AppError("Admin API key is not configured", 503, "ADMIN_AUTH_NOT_CONFIGURED"));
    return;
  }

  const incomingApiKey = request.header("x-admin-api-key");

  if (!incomingApiKey || incomingApiKey !== env.ADMIN_API_KEY) {
    next(new AppError("Invalid admin API key", 401, "UNAUTHORIZED"));
    return;
  }

  next();
};
