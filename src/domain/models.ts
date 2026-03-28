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
