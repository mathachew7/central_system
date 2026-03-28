import { Router } from "express";

import { AppError } from "../core/errors.js";
import { store } from "../domain/store.js";

export const ministriesRouter = Router();

ministriesRouter.get("/", (_request, response) => {
  const ministries = store.listMinistries().map((ministry) => ({
    ...ministry,
    projectCount: store.listProjects({ ministryId: ministry.id }).length,
    noticeCount: store.listNotices({ ministryId: ministry.id }).length
  }));

  response.json({ data: ministries });
});

ministriesRouter.get("/:slug", (request, response, next) => {
  const ministry = store.findMinistryBySlug(request.params.slug);

  if (!ministry) {
    next(new AppError("Ministry not found", 404, "MINISTRY_NOT_FOUND"));
    return;
  }

  const projects = store.listProjects({ ministryId: ministry.id });
  const notices = store.listNotices({ ministryId: ministry.id });

  response.json({
    data: {
      ...ministry,
      projects,
      notices
    }
  });
});
