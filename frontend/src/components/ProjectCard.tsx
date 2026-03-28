import { type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { Project } from "../types";

const formatDate = (value?: string): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const titleCase = (value: string): string => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const statusBadgeClass = (status: Project["status"]): string => {
  switch (status) {
    case "active":
      return "badge-active";
    case "planned":
      return "badge-planned";
    case "on_hold":
      return "badge-warning";
    case "completed":
      return "badge-completed";
    default:
      return "badge-secondary";
  }
};

interface ProjectCardProps {
  project: Project;
  ministryName?: string;
}

export default function ProjectCard({ project, ministryName }: ProjectCardProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <article
      className="record-card resource-card resource-card-clickable"
      role="link"
      tabIndex={0}
      aria-label={`Open project details: ${project.title}`}
      onClick={() => navigate(`/projects/${project.id}`)}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/projects/${project.id}`);
        }
      }}
    >
      <h3>{project.title}</h3>
      <p>
        <strong>Message:</strong> {project.description || "Project record from ministry publication."}
      </p>
      <div className="record-meta">
        <span className={`badge ${statusBadgeClass(project.status)}`}>{titleCase(project.status)}</span>
        <span>{ministryName || "Unknown Ministry"}</span>
      </div>
      <div className="record-dates">
        <span>Start: {formatDate(project.startDate)}</span>
        <span>End: {formatDate(project.endDate)}</span>
      </div>
      <div className="resource-actions">
        <Link className="btn btn-primary" to={`/projects/${project.id}`} onClick={(event) => event.stopPropagation()}>
          View In Platform
        </Link>
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
          onClick={(event) => event.stopPropagation()}
        >
          Original Link
        </a>
      </div>
    </article>
  );
}
