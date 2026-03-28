import { useEffect, useMemo, useState } from "react";

import ProjectCard from "../components/ProjectCard";
import { api } from "../lib/api";
import type { Ministry, Project } from "../types";

export default function Investments(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
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
        const [projectData, ministryData] = await Promise.all([api.getProjects(), api.getMinistries()]);
        setProjects(projectData);
        setMinistries(ministryData);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load projects");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ministryById = useMemo(() => new Map(ministries.map((item) => [item.id, item.name])), [ministries]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedMinistryId !== "all" && project.ministryId !== selectedMinistryId) return false;
      if (selectedStatus !== "all" && project.status !== selectedStatus) return false;

      const text = `${project.title} ${project.description ?? ""}`.toLowerCase();
      if (query.trim() && !text.includes(query.trim().toLowerCase())) return false;

      const sortDate = project.lastUpdatedAt || project.startDate || "";
      if (fromDate && sortDate < fromDate) return false;
      if (toDate && sortDate > toDate) return false;

      return true;
    });
  }, [projects, selectedMinistryId, selectedStatus, query, fromDate, toDate]);

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-description">Loading project records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Projects</h1>
          <p className="page-description">Official project records from current ministry scope</p>
        </div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-description">Filter projects by ministry, status, text, and date range.</p>
      </div>

      <div className="card filter-card">
        <div className="advanced-filter-grid">
          <div>
            <label htmlFor="project-ministry-filter" className="filter-label">
              Ministry
            </label>
            <select
              id="project-ministry-filter"
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
            <label htmlFor="project-status-filter" className="filter-label">
              Status
            </label>
            <select
              id="project-status-filter"
              className="filter-select"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="project-query-filter" className="filter-label">
              Search Text
            </label>
            <input
              id="project-query-filter"
              className="filter-select"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type title or message..."
            />
          </div>

          <div>
            <label htmlFor="project-date-from" className="filter-label">
              Date From
            </label>
            <input
              id="project-date-from"
              className="filter-select"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="project-date-to" className="filter-label">
              Date To
            </label>
            <input
              id="project-date-to"
              className="filter-select"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="card">
          <p>No projects matched your filters.</p>
        </div>
      ) : (
        <div className="record-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              ministryName={ministryById.get(project.ministryId)}
            />
          ))}
        </div>
      )}
    </>
  );
}
