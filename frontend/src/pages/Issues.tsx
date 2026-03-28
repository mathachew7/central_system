import { useEffect, useMemo, useState } from "react";

import { api } from "../lib/api";
import type { Ministry, Project } from "../types";

const formatDate = (value?: string): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatCurrency = (amount?: number): string => {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0
  }).format(amount);
};

const titleCase = (value: string): string => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function Issues(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError("");
        const [projectData, ministryData] = await Promise.all([
          api.getProjects(),
          api.getMinistries()
        ]);
        setProjects(projectData);
        setMinistries(ministryData);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load projects");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ministryById = useMemo(() => {
    return new Map(ministries.map((ministry) => [ministry.id, ministry]));
  }, [ministries]);

  const filteredProjects = useMemo(() => {
    if (selectedStatus === "all") {
      return projects;
    }
    return projects.filter((project) => project.status === selectedStatus);
  }, [projects, selectedStatus]);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "planned", label: "Planned" },
    { value: "active", label: "Active" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
  ];

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active': return 'badge-active';
      case 'completed': return 'badge-success';
      case 'on_hold': return 'badge-warning';
      case 'planned': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Issues & Priorities</h1>
        <p className="page-description">Loading government projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Issues & Priorities</h1>
          <p className="page-description">Government projects and initiatives</p>
        </div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Issues & Priorities</h1>
        <p className="page-description">
          Government projects and initiatives across all ministries
        </p>
      </div>

      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Filter Projects</h2>
        </div>
        <div className="form-group">
          <label className="form-label">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="form-select max-w-xs"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const ministry = ministryById.get(project.ministryId);
          return (
            <div key={project.id} className="card">
              <div className="card-header">
                <h2 className="card-title">{project.title}</h2>
                <p className="card-description">
                  {project.description || "Government project for public benefit."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                    {titleCase(project.status)}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {ministry?.name || "Unknown Ministry"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{formatCurrency(project.budgetNpr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span>{formatDate(project.lastUpdatedAt)}</span>
                  </div>
                  {project.startDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start:</span>
                      <span>{formatDate(project.startDate)}</span>
                    </div>
                  )}
                  {project.endDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">End:</span>
                      <span>{formatDate(project.endDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}