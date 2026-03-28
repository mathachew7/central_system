import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../lib/api";
import { ministryVisualAlt, ministryVisuals } from "../lib/ministryVisuals";
import type { Ministry, Notice, Project } from "../types";

const transparencyPillars = [
  {
    title: "Source Verified",
    description: "Each record links to its official publication."
  },
  {
    title: "Structured Format",
    description: "Projects and notices are organized ministry-wise."
  },
  {
    title: "Public Visibility",
    description: "Updates are consolidated into one citizen-facing view."
  }
];

export default function Home(): JSX.Element {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
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
        setProjects(projectData);
        setNotices(noticeData);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totals = useMemo(
    () => ({
      ministries: ministries.length,
      projects: projects.length,
      notices: notices.length
    }),
    [ministries.length, projects.length, notices.length]
  );

  const snapshotMonthYear = useMemo(
    () => new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date()),
    []
  );

  const projectCountByMinistry = useMemo(() => {
    return projects.reduce<Record<string, number>>((acc, project) => {
      acc[project.ministryId] = (acc[project.ministryId] ?? 0) + 1;
      return acc;
    }, {});
  }, [projects]);

  const noticeCountByMinistry = useMemo(() => {
    return notices.reduce<Record<string, number>>((acc, notice) => {
      acc[notice.ministryId] = (acc[notice.ministryId] ?? 0) + 1;
      return acc;
    }, {});
  }, [notices]);

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Centralized Government Transparency Platform</h1>
        <p className="page-description">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Centralized Government Transparency Platform</h1>
          <p className="page-description">Making Nepal government data accessible and citizen-friendly.</p>
        </div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <section className="hero-banner">
        <div className="hero-banner-shell">
          <div className="hero-banner-content">
            <p className="hero-kicker">Open Civic Data for Nepal</p>
            <h1>Centralized Government Transparency Platform</h1>
            <p>
              One place to track public projects, notices, and ministry updates with source links, structured records,
              and citizen-first navigation.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/ministries">
                Explore Ministries
              </Link>
              <Link className="btn btn-secondary" to="/news">
                View Latest Notices
              </Link>
            </div>
          </div>
          <div className="hero-flag-side" aria-hidden="true">
            <img
              className="hero-nepal-flag"
              src="https://cdn.pixabay.com/animation/2024/03/24/05/32/05-32-27-624__480.png"
              alt=""
            />
          </div>
        </div>
      </section>

      <section className="stats-row">
        <article className="stat-card">
          <div className="stat-value">{totals.ministries}</div>
          <div className="stat-label">Ministry Portfolios</div>
          <p className="stat-footnote">Phase 1: Health, Education, Infrastructure</p>
        </article>
        <article className="stat-card">
          <div className="stat-value">{totals.projects}</div>
          <div className="stat-label">Verified Project Records</div>
          <p className="stat-footnote">Active, planned, and completed initiatives</p>
        </article>
        <article className="stat-card">
          <div className="stat-value">{totals.notices}</div>
          <div className="stat-label">Notice & Policy Records</div>
          <p className="stat-footnote">Policies, tenders, circulars, announcements</p>
        </article>
      </section>

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Transparency Snapshot ({snapshotMonthYear})</h2>
          <p className="card-description">
            Official ministry records in one structured public view.
          </p>
        </div>
        <div className="snapshot-grid">
          {transparencyPillars.map((item) => (
            <article key={item.title} className="snapshot-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-header">
        <h2 className="page-title">Phase 1 Ministries</h2>
        <p className="page-description">Health, Education, and Infrastructure with clickable records.</p>
      </section>

      <section className="ministry-grid">
        {ministries.map((ministry) => (
          <Link
            key={ministry.id}
            to={`/ministries/${ministry.slug}`}
            className="card ministry-visual-card ministry-card-link"
            aria-label={`Open ${ministry.name} full ministry data`}
          >
            <img
              src={ministryVisuals[ministry.slug] || ministryVisuals.mopit}
              alt={ministryVisualAlt[ministry.slug] || ministry.name}
              className="ministry-logo"
            />
            <div className="ministry-visual-content">
              <h3>{ministry.name}</h3>
              <p>{ministry.description || "Ministry portfolio data and records."}</p>
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
      </section>

      <section className="card nepal-context">
        <div className="card-header">
          <h2 className="card-title">Why This Matters in Nepal Context</h2>
        </div>
        <p>
          Public information is often spread across multiple ministry pages and PDF notices. This platform consolidates
          those records in a single structured view so citizens, researchers, and media can track what is planned,
          what is active, and where each piece of information came from.
        </p>
      </section>
    </>
  );
}
