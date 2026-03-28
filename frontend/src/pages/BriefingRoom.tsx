import { useEffect, useMemo, useState } from "react";

import { api } from "../lib/api";
import type { Ministry, Notice } from "../types";

const formatDate = (value?: string): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const titleCase = (value: string): string => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function BriefingRoom(): JSX.Element {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError("");
        const [noticeData, ministryData] = await Promise.all([
          api.getNotices(),
          api.getMinistries()
        ]);
        setNotices(noticeData);
        setMinistries(ministryData);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load notices");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ministryById = useMemo(() => {
    return new Map(ministries.map((ministry) => [ministry.id, ministry]));
  }, [ministries]);

  const filteredNotices = useMemo(() => {
    if (selectedCategory === "all") {
      return notices;
    }
    return notices.filter((notice) => notice.category === selectedCategory);
  }, [notices, selectedCategory]);

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "notice", label: "Notice" },
    { value: "news", label: "News" },
    { value: "press_release", label: "Press Release" },
    { value: "policy", label: "Policy" },
  ];

  const getCategoryBadgeClass = (category: string): string => {
    switch (category) {
      case 'news': return 'badge-primary';
      case 'press_release': return 'badge-success';
      case 'policy': return 'badge-warning';
      case 'notice': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Briefing Room</h1>
        <p className="page-description">Loading government announcements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Briefing Room</h1>
          <p className="page-description">Latest news and announcements</p>
        </div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Briefing Room</h1>
        <p className="page-description">
          Latest news, notices, and announcements from government ministries
        </p>
      </div>

      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Filter Announcements</h2>
        </div>
        <div className="form-group">
          <label className="form-label">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="form-select max-w-xs"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const ministry = ministryById.get(notice.ministryId);
          return (
            <div key={notice.id} className="card">
              <div className="card-header">
                <h2 className="card-title">{notice.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`badge ${getCategoryBadgeClass(notice.category)}`}>
                    {titleCase(notice.category)}
                  </span>
                  <span>{ministry?.name || "Government"}</span>
                  <time>{formatDate(notice.publishedAt)}</time>
                </div>
              </div>

              <div className="card-content">
                <p className="text-gray-700">
                  {notice.summary || "No summary available."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}