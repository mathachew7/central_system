export type RecordSourceType = "official_page" | "pdf_extract" | "manual_verified";

export interface SourceMetadata {
  sourceUrl: string;
  sourceType: RecordSourceType;
  lastCheckedAt: string;
}

export interface Ministry extends SourceMetadata {
  id: string;
  slug: string;
  name: string;
  nameNe?: string;
  description?: string;
}

export type ProjectStatus = "planned" | "active" | "on_hold" | "completed";

export interface Project extends SourceMetadata {
  id: string;
  ministryId: string;
  title: string;
  description?: string;
  budgetNpr?: number;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  lastUpdatedAt: string;
}

export type NoticeCategory = "notice" | "news" | "press_release" | "policy";

export interface Notice extends SourceMetadata {
  id: string;
  ministryId: string;
  title: string;
  category: NoticeCategory;
  publishedAt: string;
  summary?: string;
}

export type ComplaintStatus = "submitted" | "under_review" | "action_taken" | "closed";

export interface Complaint {
  id: string;
  ticketId: string;
  ministryId?: string;
  category: string;
  message: string;
  isAnonymous: boolean;
  contactEmail?: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComplaintInput {
  ministryId?: string;
  category: string;
  message: string;
  isAnonymous: boolean;
  contactEmail?: string;
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

export type SourceRegistry = Record<SourceRegistryCategory, SourceRegistryEntry[]>;
