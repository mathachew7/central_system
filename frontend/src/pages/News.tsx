import { useEffect, useMemo, useState } from "react";

import NoticeCard from "../components/NoticeCard";
import { api } from "../lib/api";
import type { Ministry, Notice } from "../types";

export default function News(): JSX.Element {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError("");

        const [noticeData, ministryData] = await Promise.all([api.getNotices(), api.getMinistries()]);
        setNotices(noticeData);
        setMinistries(ministryData);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load notices");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ministryById = useMemo(() => new Map(ministries.map((item) => [item.id, item])), [ministries]);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      if (selectedMinistryId !== "all" && notice.ministryId !== selectedMinistryId) return false;
      if (selectedCategory !== "all" && notice.category !== selectedCategory) return false;

      const text = `${notice.title} ${notice.summary ?? ""}`.toLowerCase();
      if (query.trim() && !text.includes(query.trim().toLowerCase())) return false;

      if (fromDate && notice.publishedAt < fromDate) return false;
      if (toDate && notice.publishedAt > toDate) return false;

      return true;
    });
  }, [notices, selectedMinistryId, selectedCategory, query, fromDate, toDate]);

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">News and Notices</h1>
        <p className="page-description">Loading ministry updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">News and Notices</h1>
          <p className="page-description">Official updates aggregated from ministry sources</p>
        </div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">News and Notices</h1>
        <p className="page-description">Filter by ministry, category, text, and date range.</p>
      </div>

      <div className="card filter-card">
        <div className="advanced-filter-grid">
          <div>
            <label htmlFor="notice-ministry-filter" className="filter-label">
              Ministry
            </label>
            <select
              id="notice-ministry-filter"
              className="filter-select"
              value={selectedMinistryId}
              onChange={(event) => setSelectedMinistryId(event.target.value)}
            >
              <option value="all">All Ministries</option>
              {ministries.map((ministry) => (
                <option key={ministry.id} value={ministry.id}>
                  {ministry.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notice-category-filter" className="filter-label">
              Category
            </label>
            <select
              id="notice-category-filter"
              className="filter-select"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="notice">Notice</option>
              <option value="news">News</option>
              <option value="policy">Policy</option>
              <option value="press_release">Press Release</option>
            </select>
          </div>

          <div>
            <label htmlFor="notice-query-filter" className="filter-label">
              Search Text
            </label>
            <input
              id="notice-query-filter"
              className="filter-select"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type title or message..."
            />
          </div>

          <div>
            <label htmlFor="notice-date-from" className="filter-label">
              Date From
            </label>
            <input
              id="notice-date-from"
              className="filter-select"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="notice-date-to" className="filter-label">
              Date To
            </label>
            <input
              id="notice-date-to"
              className="filter-select"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="card">
          <p>No notices matched your filters.</p>
        </div>
      ) : (
        <div className="news-grid">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              ministryName={ministryById.get(notice.ministryId)?.name}
            />
          ))}
        </div>
      )}
    </>
  );
}
