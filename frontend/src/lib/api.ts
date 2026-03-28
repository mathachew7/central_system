import type { ComplaintCreateResponse, ComplaintTicket, Ministry, MinistryDetail, Notice, Project } from "../types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "http://localhost:4000";

interface Envelope<T> {
  data: T;
}

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};

export const api = {
  getMinistries: async (): Promise<Ministry[]> => {
    const response = await fetchJson<Envelope<Ministry[]>>("/api/v1/ministries");
    return response.data;
  },

  getMinistryBySlug: async (slug: string): Promise<MinistryDetail> => {
    const response = await fetchJson<Envelope<MinistryDetail>>(`/api/v1/ministries/${slug}`);
    return response.data;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await fetchJson<Envelope<Project[]>>("/api/v1/projects");
    return response.data;
  },

  getNotices: async (): Promise<Notice[]> => {
    const response = await fetchJson<Envelope<Notice[]>>("/api/v1/notices");
    return response.data;
  },

  submitComplaint: async (payload: {
    ministry?: string;
    category: string;
    message: string;
    isAnonymous: boolean;
    contactEmail?: string;
  }): Promise<ComplaintCreateResponse> => {
    const response = await fetchJson<Envelope<ComplaintCreateResponse>>("/api/v1/complaints", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return response.data;
  },

  trackComplaint: async (ticketId: string): Promise<ComplaintTicket> => {
    const response = await fetchJson<Envelope<ComplaintTicket>>(`/api/v1/complaints/${encodeURIComponent(ticketId)}`);
    return response.data;
  }
};

export { API_BASE };
