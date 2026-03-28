import fs from "node:fs";

import { Router } from "express";
import { z } from "zod";

import { AppError } from "../core/errors.js";
import {
  getSourceRegistry,
  getSourceRegistryCategory,
  sourceRegistryCategories,
  sourceRegistryFilePath
} from "../domain/source-registry.js";

const sourceCategorySchema = z.enum(
  sourceRegistryCategories as [typeof sourceRegistryCategories[number], ...typeof sourceRegistryCategories[number][]]
);

export const sourcesRouter = Router();

sourcesRouter.get("/", (_request, response) => {
  const registry = getSourceRegistry();
  const categoryCounts = sourceRegistryCategories.map((category) => ({
    category,
    count: registry[category].length
  }));
  const totalCount = categoryCounts.reduce((sum, item) => sum + item.count, 0);

  response.json({
    data: registry,
    meta: {
      categoryCounts,
      totalSources: totalCount,
      totalCategories: sourceRegistryCategories.length
    }
  });
});

sourcesRouter.get("/categories", (_request, response) => {
  const registry = getSourceRegistry();

  response.json({
    data: sourceRegistryCategories.map((category) => ({
      id: category,
      count: registry[category].length
    }))
  });
});

sourcesRouter.get("/raw", (_request, response, next) => {
  try {
    const rawYaml = fs.readFileSync(sourceRegistryFilePath, "utf-8");
    response.setHeader("Content-Type", "application/x-yaml; charset=utf-8");
    response.send(rawYaml);
  } catch (error) {
    next(error);
  }
});

sourcesRouter.get("/:category", (request, response, next) => {
  try {
    const category = sourceCategorySchema.parse(request.params.category);

    response.json({
      data: {
        category,
        entries: getSourceRegistryCategory(category)
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError("Unknown source category", 404, "SOURCE_CATEGORY_NOT_FOUND"));
      return;
    }
    next(error);
  }
});
