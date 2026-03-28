import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

import { env } from "../config/env.js";
import { requireAdminApiKey } from "../core/auth.js";
import { AppError } from "../core/errors.js";
import { sanitizeText } from "../core/sanitize.js";
import type { ComplaintStatus } from "../domain/models.js";
import { store } from "../domain/store.js";

const createComplaintSchema = z
  .object({
    ministry: z.string().trim().min(2).max(60).optional(),
    category: z.string().trim().min(2).max(80).transform(sanitizeText),
    message: z.string().trim().min(10).max(2000).transform(sanitizeText),
    isAnonymous: z.boolean().default(true),
    contactEmail: z.string().trim().email().max(150).optional()
  })
  .superRefine((data, ctx) => {
    if (!data.isAnonymous && !data.contactEmail) {
      ctx.addIssue({
        path: ["contactEmail"],
        code: z.ZodIssueCode.custom,
        message: "contactEmail is required when isAnonymous is false"
      });
    }
  });

const updateComplaintStatusSchema = z.object({
  status: z.enum(["submitted", "under_review", "action_taken", "closed"] satisfies [ComplaintStatus, ...ComplaintStatus[]])
});

const complaintRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: Math.floor(env.RATE_LIMIT_MAX / 2),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many complaint submissions. Please try again later."
    }
  }
});

export const complaintsRouter = Router();

complaintsRouter.post("/", complaintRateLimiter, (request, response, next) => {
  try {
    const payload = createComplaintSchema.parse(request.body);

    const ministryId = payload.ministry
      ? (store.findMinistryBySlug(payload.ministry)?.id ?? store.findMinistryById(payload.ministry)?.id)
      : undefined;

    const complaint = store.createComplaint({
      ministryId,
      category: payload.category,
      message: payload.message,
      isAnonymous: payload.isAnonymous,
      contactEmail: payload.contactEmail
    });

    response.status(201).json({
      data: {
        ticketId: complaint.ticketId,
        status: complaint.status,
        createdAt: complaint.createdAt,
        requestId: request.requestId
      }
    });
  } catch (error) {
    next(error);
  }
});

complaintsRouter.get("/:ticketId", (request, response, next) => {
  const ticketId = request.params.ticketId;

  if (!ticketId) {
    next(new AppError("ticketId is required", 400, "VALIDATION_ERROR"));
    return;
  }

  const complaint = store.findComplaintByTicketId(ticketId);

  if (!complaint) {
    next(new AppError("Complaint not found", 404, "COMPLAINT_NOT_FOUND"));
    return;
  }

  response.json({
    data: {
      ticketId: complaint.ticketId,
      status: complaint.status,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt
    }
  });
});

complaintsRouter.patch("/:ticketId/status", requireAdminApiKey, (request, response, next) => {
  try {
    const ticketId = request.params.ticketId;

    if (!ticketId) {
      next(new AppError("ticketId is required", 400, "VALIDATION_ERROR"));
      return;
    }

    const payload = updateComplaintStatusSchema.parse(request.body);
    const updated = store.updateComplaintStatus(ticketId, payload.status);

    if (!updated) {
      next(new AppError("Complaint not found", 404, "COMPLAINT_NOT_FOUND"));
      return;
    }

    response.json({
      data: {
        ticketId: updated.ticketId,
        status: updated.status,
        updatedAt: updated.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
});
