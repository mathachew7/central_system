import { Router } from "express";

import { complaintsRouter } from "./complaints.js";
import { ministriesRouter } from "./ministries.js";
import { noticesRouter } from "./notices.js";
import { projectsRouter } from "./projects.js";

export const apiRouter = Router();

apiRouter.use("/ministries", ministriesRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/notices", noticesRouter);
apiRouter.use("/complaints", complaintsRouter);
