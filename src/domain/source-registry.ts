import fs from "node:fs";
import path from "node:path";

import YAML from "yaml";
import { z } from "zod";

import type { SourceRegistry, SourceRegistryCategory } from "./models.js";

const registryPath = path.resolve(process.cwd(), "data/source-registry.yaml");

const sourceRegistryEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  name_ne: z.string().optional(),
  base_url: z.string().url(),
  scraper_class: z.string().min(1),
  endpoints: z.record(z.string(), z.string()).optional(),
  has_api: z.boolean().optional(),
  api_url: z.string().url().optional(),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  poll_interval_mins: z.number().int().positive()
});

const sourceRegistrySchema = z.object({
  federal_ministries: z.array(sourceRegistryEntrySchema).default([]),
  constitutional_bodies: z.array(sourceRegistryEntrySchema).default([]),
  regulatory_bodies: z.array(sourceRegistryEntrySchema).default([]),
  judiciary: z.array(sourceRegistryEntrySchema).default([]),
  security_services: z.array(sourceRegistryEntrySchema).default([]),
  disaster_sources: z.array(sourceRegistryEntrySchema).default([]),
  parliament: z.array(sourceRegistryEntrySchema).default([]),
  provinces: z.array(sourceRegistryEntrySchema).default([])
});

let cachedRegistry: SourceRegistry | null = null;

const readRegistry = (): SourceRegistry => {
  const yamlSource = fs.readFileSync(registryPath, "utf-8");
  const parsed = YAML.parse(yamlSource);

  return sourceRegistrySchema.parse(parsed);
};

export const getSourceRegistry = (): SourceRegistry => {
  if (cachedRegistry) {
    return cachedRegistry;
  }

  cachedRegistry = readRegistry();
  return cachedRegistry;
};

export const getSourceRegistryCategory = (category: SourceRegistryCategory): SourceRegistry[SourceRegistryCategory] => {
  return getSourceRegistry()[category];
};

export const sourceRegistryCategories: SourceRegistryCategory[] = [
  "federal_ministries",
  "constitutional_bodies",
  "regulatory_bodies",
  "judiciary",
  "security_services",
  "disaster_sources",
  "parliament",
  "provinces"
];

export const sourceRegistryFilePath = registryPath;
