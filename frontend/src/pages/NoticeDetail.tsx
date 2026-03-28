import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../lib/api";
import type { Ministry, Notice } from "../types";

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const titleCase = (value: string): string => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function NoticeDetailPage(): JSX.Element {
  const { id } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) {
      setError("Notice id missing.");
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        setLoading(true);
        setError("");
        const [noticeData, ministryData] = await Promise.all([api.getNotices(), api.getMinistries()]);
        const selected = noticeData.find((item) => item.id === id);
        if (!selected) {
          setError("Notice not found.");
        } else {
          setNotice(selected);
        }
        setMinistries(ministryData);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load notice");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const ministry = useMemo(
    () => ministries.find((item) => item.id === notice?.ministryId),
    [ministries, notice?.ministryId]
  );

  if (loading) {
    return <div className="page-header"><h1 className="page-title">Notice Detail</h1><p className="page-description">Loading notice...</p></div>;
  }

  if (error || !notice) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Notice Detail</h1>
          <p className="page-description">Unable to load notice details</p>
        </div>
        <div className="alert alert-error">{error || "Notice not found"}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{notice.title}</h1>
        <p className="page-description">{ministry?.name || "Unknown Ministry"}</p>
      </div>

      <article className="card detail-article">
        <div className="record-meta">
          <span className="badge badge-secondary">{titleCase(notice.category)}</span>
          <span>Published: {formatDate(notice.publishedAt)}</span>
        </div>
        <p className="detail-message">
          {notice.summary || "No additional message summary was available from the source."}
        </p>
        <div className="resource-actions">
          <a href={notice.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
            Open Original Source
          </a>
          <Link to="/news" className="btn btn-secondary">
            Back to Notices
          </Link>
        </div>
      </article>
    </>
  );
}
