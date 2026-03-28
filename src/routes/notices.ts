import { Router } from "express";
import { z } from "zod";

import { store } from "../domain/store.js";

const noticeQuerySchema = z.object({
  ministry: z.string().trim().min(2).max(60).optional(),
  category: z.enum(["notice", "news", "press_release", "policy"]).optional(),
  limit: z.coerce.number().int().positive().max(100).optional()
});

export const noticesRouter = Router();

noticesRouter.get("/", (request, response, next) => {
  try {
    const query = noticeQuerySchema.parse(request.query);

    const ministryId = query.ministry
      ? (store.findMinistryBySlug(query.ministry)?.id ?? store.findMinistryById(query.ministry)?.id)
      : undefined;

    const data = store.listNotices({
      ministryId,
      category: query.category,
      limit: query.limit
    });

    response.json({ data });
  } catch (error) {
    next(error);
  }
});
