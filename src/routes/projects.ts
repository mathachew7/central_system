import { Router } from "express";
import { z } from "zod";

import type { ProjectStatus } from "../domain/models.js";
import { store } from "../domain/store.js";

const projectQuerySchema = z.object({
  ministry: z.string().trim().min(2).max(60).optional(),
  status: z.enum(["planned", "active", "on_hold", "completed"] satisfies [ProjectStatus, ...ProjectStatus[]]).optional(),
  q: z.string().trim().min(2).max(120).optional()
});

export const projectsRouter = Router();

projectsRouter.get("/", (request, response, next) => {
  try {
    const query = projectQuerySchema.parse(request.query);

    const ministryId = query.ministry
      ? (store.findMinistryBySlug(query.ministry)?.id ?? store.findMinistryById(query.ministry)?.id)
      : undefined;

    const data = store.listProjects({
      ministryId,
      status: query.status,
      q: query.q
    });

    response.json({ data });
  } catch (error) {
    next(error);
  }
});
