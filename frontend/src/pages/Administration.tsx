import { KeyboardEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../lib/api";
import type { Ministry } from "../types";

const titleCase = (value: string): string => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function Administration(): JSX.Element {
  const navigate = useNavigate();
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [projectCountByMinistry, setProjectCountByMinistry] = useState<Record<string, number>>({});
  const [noticeCountByMinistry, setNoticeCountByMinistry] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError("");
        const [ministryData, projectData, noticeData] = await Promise.all([
          api.getMinistries(),
          api.getProjects(),
          api.getNotices()
        ]);
        setMinistries(ministryData);

        setProjectCountByMinistry(
          projectData.reduce<Record<string, number>>((acc, project) => {
            acc[project.ministryId] = (acc[project.ministryId] ?? 0) + 1;
            return acc;
          }, {})
        );

        setNoticeCountByMinistry(
          noticeData.reduce<Record<string, number>>((acc, notice) => {
            acc[notice.ministryId] = (acc[notice.ministryId] ?? 0) + 1;
            return acc;
          }, {})
        );
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load ministries");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Administration</h1>
        <p className="page-description">Loading ministry records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Administration</h1>
          <p className="page-description">Ministry portfolios, projects, and public notices</p>
        </div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Administration</h1>
        <p className="page-description">
          Click any ministry to see its full project list and full notices list.
        </p>
      </div>

      <div className="ministry-grid">
        {ministries.map((ministry) => (
          <article
            key={ministry.id}
            className="card ministry-card admin-ministry-card-clickable"
            role="link"
            tabIndex={0}
            aria-label={`Open ${ministry.name} details`}
            onClick={() => navigate(`/ministries/${ministry.slug}`)}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`/ministries/${ministry.slug}`);
              }
            }}
          >
            <div className="card-header">
              <h2 className="card-title">{ministry.name}</h2>
              <p className="card-description">{ministry.description || "Government ministry records."}</p>
            </div>

            <div className="ministry-counts">
              <div>
                <strong>{projectCountByMinistry[ministry.id] ?? 0}</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>{noticeCountByMinistry[ministry.id] ?? 0}</strong>
                <span>Notices</span>
              </div>
            </div>

            <div className="ministry-actions admin-ministry-actions">
              <Link
                className="btn btn-primary"
                to={`/ministries/${ministry.slug}`}
                onClick={(event) => event.stopPropagation()}
              >
                View Projects and Notices
              </Link>
              <a
                href={ministry.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                onClick={(event) => event.stopPropagation()}
              >
                Official Source ({titleCase(ministry.sourceType)})
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
