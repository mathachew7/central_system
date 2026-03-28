export interface Ministry {
  id: string;
  slug: string;
  name: string;
  nameNe?: string;
  description?: string;
  sourceUrl: string;
  sourceType: string;
  lastCheckedAt: string;
  projectCount?: number;
  noticeCount?: number;
}

export interface Project {
  id: string;
  ministryId: string;
  title: string;
  description?: string;
  budgetNpr?: number;
  startDate?: string;
  endDate?: string;
  status: "planned" | "active" | "on_hold" | "completed";
  sourceUrl: string;
  sourceType: string;
  lastCheckedAt: string;
  lastUpdatedAt: string;
}

export interface Notice {
  id: string;
  ministryId: string;
  title: string;
  category: "notice" | "news" | "press_release" | "policy";
  publishedAt: string;
  summary?: string;
  sourceUrl: string;
  sourceType: string;
  lastCheckedAt: string;
}

export interface MinistryDetail extends Ministry {
  projects: Project[];
  notices: Notice[];
}

export interface ComplaintCreateResponse {
  ticketId: string;
  status: string;
  createdAt: string;
  requestId: string;
}

export interface ComplaintTicket {
  ticketId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type SourceRegistryCategory =
  | "federal_ministries"
  | "constitutional_bodies"
  | "regulatory_bodies"
  | "judiciary"
  | "security_services"
  | "disaster_sources"
  | "parliament"
  | "provinces";

export interface SourceRegistryEntry {
  id: string;
  name: string;
  name_ne?: string;
  base_url: string;
  scraper_class: string;
  endpoints?: Record<string, string>;
  has_api?: boolean;
  api_url?: string;
  priority: 1 | 2 | 3;
  poll_interval_mins: number;
}

export type SourceRegistryMap = Record<SourceRegistryCategory, SourceRegistryEntry[]>;

export interface SourceRegistryResponse {
  data: SourceRegistryMap;
  meta: {
    categoryCounts: { category: SourceRegistryCategory; count: number }[];
    totalSources: number;
    totalCategories: number;
  };
}
