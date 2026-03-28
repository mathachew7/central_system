import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import NoticeCard from "../components/NoticeCard";
import ProjectCard from "../components/ProjectCard";
import { ministryProfiles } from "../data/ministryProfiles";
import { api } from "../lib/api";
import type { Ministry, MinistryDetail, Notice, Project } from "../types";

export default function MinistryDetailPage(): JSX.Element {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [ministry, setMinistry] = useState<MinistryDetail | null>(null);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tab, setTab] = useState<"projects" | "notices">("projects");

  useEffect(() => {
    if (!slug) {
      setError("Ministry slug is missing.");
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        setLoading(true);
        setError("");
        const [data, ministryList] = await Promise.all([api.getMinistryBySlug(slug), api.getMinistries()]);
        setMinistry(data);
        setMinistries(ministryList);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load ministry details");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const sortedProjects = useMemo<Project[]>(() => {
    if (!ministry) return [];
    return [...ministry.projects].sort((a, b) => b.lastUpdatedAt.localeCompare(a.lastUpdatedAt));
  }, [ministry]);

  const sortedNotices = useMemo<Notice[]>(() => {
    if (!ministry) return [];
    return [...ministry.notices].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [ministry]);

  const profile = ministry ? ministryProfiles[ministry.slug] : undefined;

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Ministry Detail</h1>
        <p className="page-description">Loading ministry records...</p>
      </div>
    );
  }

  if (error || !ministry) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Ministry Detail</h1>
          <p className="page-description">Projects and notices sourced from official records</p>
        </div>
        <div className="alert alert-error">{error || "Ministry not found"}</div>
        <Link className="btn btn-secondary" to="/administration">
          Back to Administration
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{ministry.name}</h1>
        <p className="page-description">{ministry.description || "Public records for projects and notices."}</p>
      </div>

      {profile && (
        <section className="card ministry-profile">
          <div className="profile-header">
            <img src={profile.logoUrl} alt={`${ministry.name} logo`} className="profile-logo" />
            <div>
              <h2 className="card-title">Official Contact Information</h2>
              <p className="card-description">{profile.address}</p>
            </div>
          </div>

          <div className="profile-grid">
            <div>
              <h3>Contact</h3>
              <p><strong>Website:</strong> <a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a></p>
              <p><strong>Contact Page:</strong> <a href={profile.contactPage} target="_blank" rel="noreferrer">{profile.contactPage}</a></p>
              <p><strong>Phones:</strong> {profile.phones.join(", ")}</p>
              <p><strong>Emails:</strong> {profile.emails.join(", ")}</p>
            </div>

            <div>
              <h3>Social</h3>
              <p><strong>Facebook:</strong> {profile.socials.facebook ? <a href={profile.socials.facebook} target="_blank" rel="noreferrer">{profile.socials.facebook}</a> : "Not publicly listed"}</p>
              <p><strong>X/Twitter:</strong> {profile.socials.x ? <a href={profile.socials.x} target="_blank" rel="noreferrer">{profile.socials.x}</a> : "Not publicly listed"}</p>
              <p><strong>YouTube:</strong> {profile.socials.youtube ? <a href={profile.socials.youtube} target="_blank" rel="noreferrer">{profile.socials.youtube}</a> : "Not publicly listed"}</p>
            </div>
          </div>

          <div>
            <h3 className="card-title">Officials</h3>
            <div className="official-grid">
              {profile.officials.map((official) => (
                <article key={`${official.name}-${official.title}`} className="official-card">
                  <h4>{official.name}</h4>
                  <p>{official.title}</p>
                  {official.phone && <p><strong>Phone:</strong> {official.phone}</p>}
                  {official.email && <p><strong>Email:</strong> {official.email}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="card filter-card">
        <label htmlFor="ministry-switcher" className="filter-label">
          Select Ministry
        </label>
        <select
          id="ministry-switcher"
          className="filter-select"
          value={ministry.slug}
          onChange={(event) => navigate(`/ministries/${event.target.value}`)}
        >
          {ministries.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </section>

      <section className="ministry-meta card">
        <div className="ministry-meta-header">
          <h2 className="card-title">Records Summary</h2>
          <p className="card-description">
            Verified public records currently indexed for this ministry.
          </p>
        </div>
        <div className="ministry-meta-grid">
          <div className="ministry-kpi-card">
            <div className="ministry-kpi-copy">
              <p className="ministry-kpi-label">Projects</p>
              <p className="ministry-kpi-note">Project records with status, timeline, and source links.</p>
            </div>
            <p className="ministry-kpi-value">{sortedProjects.length}</p>
          </div>
          <div className="ministry-kpi-card">
            <div className="ministry-kpi-copy">
              <p className="ministry-kpi-label">Notices</p>
              <p className="ministry-kpi-note">Policy, notice, news, and press release publications.</p>
            </div>
            <p className="ministry-kpi-value">{sortedNotices.length}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="record-tabs">
          <button
            type="button"
            className={`record-tab-btn${tab === "projects" ? " active" : ""}`}
            onClick={() => setTab("projects")}
          >
            Projects ({sortedProjects.length})
          </button>
          <button
            type="button"
            className={`record-tab-btn${tab === "notices" ? " active" : ""}`}
            onClick={() => setTab("notices")}
          >
            Notices ({sortedNotices.length})
          </button>
        </div>

        {tab === "projects" && (
          <div className="record-grid">
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} ministryName={ministry.name} />
            ))}
          </div>
        )}

        {tab === "notices" && (
          <div className="record-grid">
            {sortedNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} ministryName={ministry.name} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
