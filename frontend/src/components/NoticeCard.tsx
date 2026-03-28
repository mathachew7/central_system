import { type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { Notice } from "../types";

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const titleCase = (value: string): string => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

interface NoticeCardProps {
  notice: Notice;
  ministryName?: string;
}

export default function NoticeCard({ notice, ministryName }: NoticeCardProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <article
      className="card resource-card resource-card-clickable"
      role="link"
      tabIndex={0}
      aria-label={`Open notice details: ${notice.title}`}
      onClick={() => navigate(`/notices/${notice.id}`)}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/notices/${notice.id}`);
        }
      }}
    >
      <div className="card-header">
        <h2 className="card-title">{notice.title}</h2>
        <p className="card-description">{formatDate(notice.publishedAt)}</p>
      </div>

      <div className="news-card-body">
        <p>
          <strong>Message:</strong> {notice.summary || "Official publication from ministry source."}
        </p>

        <div className="news-meta">
          <span className="badge badge-secondary">{titleCase(notice.category)}</span>
          <span>{ministryName || "Unknown Ministry"}</span>
        </div>

        <div className="resource-actions">
          <Link className="btn btn-primary" to={`/notices/${notice.id}`} onClick={(event) => event.stopPropagation()}>
            View In Platform
          </Link>
          <a
            className="btn btn-secondary"
            href={notice.sourceUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            Original Link
          </a>
        </div>
      </div>
    </article>
  );
}
