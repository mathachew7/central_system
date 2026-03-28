import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../lib/api";
import { ministryVisualAlt, ministryVisuals } from "../lib/ministryVisuals";
import type { Ministry } from "../types";

export default function Ministries(): JSX.Element {
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
        <h1 className="page-title">Ministries</h1>
        <p className="page-description">Loading ministry profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Ministries</h1>
          <p className="page-description">Current ministries included in Phase 1</p>
        </div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Ministries</h1>
        <p className="page-description">
          Phase 1 ministries with source-linked projects and notices.
        </p>
      </div>

      <div className="ministry-grid">
        {ministries.map((ministry) => (
          <Link
            key={ministry.id}
            to={`/ministries/${ministry.slug}`}
            className="card ministry-visual-card ministry-card-link"
            aria-label={`Open ${ministry.name} ministry record`}
          >
            <img
              src={ministryVisuals[ministry.slug] || ministryVisuals.mopit}
              alt={ministryVisualAlt[ministry.slug] || ministry.name}
              className="ministry-logo"
            />
            <div className="ministry-visual-content">
              <h2>{ministry.name}</h2>
              <p>{ministry.description || "Public ministry record profile."}</p>
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
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
