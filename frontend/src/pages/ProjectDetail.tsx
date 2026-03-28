import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../lib/api";
import type { Ministry, Project } from "../types";

const formatDate = (value?: string): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const titleCase = (value: string): string => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function ProjectDetailPage(): JSX.Element {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) {
      setError("Project id missing.");
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        setLoading(true);
        setError("");
        const [projectData, ministryData] = await Promise.all([api.getProjects(), api.getMinistries()]);
        const selected = projectData.find((item) => item.id === id);
        if (!selected) {
          setError("Project not found.");
        } else {
          setProject(selected);
        }
        setMinistries(ministryData);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load project");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const ministry = useMemo(
    () => ministries.find((item) => item.id === project?.ministryId),
    [ministries, project?.ministryId]
  );

  if (loading) {
    return <div className="page-header"><h1 className="page-title">Project Detail</h1><p className="page-description">Loading project...</p></div>;
  }

  if (error || !project) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Project Detail</h1>
          <p className="page-description">Unable to load project details</p>
        </div>
        <div className="alert alert-error">{error || "Project not found"}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{project.title}</h1>
        <p className="page-description">{ministry?.name || "Unknown Ministry"}</p>
      </div>

      <article className="card detail-article">
        <div className="record-meta">
          <span className="badge badge-secondary">{titleCase(project.status)}</span>
          <span>Last Updated: {formatDate(project.lastUpdatedAt)}</span>
        </div>
        <p className="detail-message">
          {project.description || "No additional message was provided in this project source."}
        </p>
        <div className="record-dates">
          <span>Start Date: {formatDate(project.startDate)}</span>
          <span>End Date: {formatDate(project.endDate)}</span>
        </div>
        <div className="resource-actions">
          <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
            Open Original Source
          </a>
          <Link to="/investments" className="btn btn-secondary">
            Back to Projects
          </Link>
        </div>
      </article>
    </>
  );
}
