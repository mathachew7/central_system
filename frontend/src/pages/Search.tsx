import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { api } from "../lib/api";
import type { Ministry, Notice, Project } from "../types";

export default function SearchPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
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
        setError(fetchError instanceof Error ? fetchError.message : "Unable to run search");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const normalized = q.toLowerCase();
  const ministryById = useMemo(() => new Map(ministries.map((item) => [item.id, item.name])), [ministries]);

  const matchedMinistries = ministries.filter((item) => {
    const hay = `${item.name} ${item.nameNe ?? ""} ${item.description ?? ""}`.toLowerCase();
    return normalized && hay.includes(normalized);
  });

  const matchedProjects = projects.filter((item) => {
    const hay = `${item.title} ${item.description ?? ""} ${ministryById.get(item.ministryId) ?? ""}`.toLowerCase();
    return normalized && hay.includes(normalized);
  });

  const matchedNotices = notices.filter((item) => {
    const hay = `${item.title} ${item.summary ?? ""} ${ministryById.get(item.ministryId) ?? ""}`.toLowerCase();
    return normalized && hay.includes(normalized);
  });

  if (loading) {
    return <div className="page-header"><h1 className="page-title">Search</h1><p className="page-description">Searching platform data...</p></div>;
  }

  if (error) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Search</h1>
          <p className="page-description">Platform-wide search</p>
        </div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Search Results</h1>
        <p className="page-description">Query: "{q || "..."}"</p>
      </div>

      {!q ? (
        <div className="card"><p>Type a search term in the header search box.</p></div>
      ) : (
        <div className="search-sections">
          <section className="card">
            <h2 className="card-title">Ministries ({matchedMinistries.length})</h2>
            {matchedMinistries.length === 0 ? (
              <p>No ministry matches.</p>
            ) : (
              <ul className="search-list">
                {matchedMinistries.map((item) => (
                  <li key={item.id}>
                    <Link to={`/ministries/${item.slug}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2 className="card-title">Projects ({matchedProjects.length})</h2>
            {matchedProjects.length === 0 ? (
              <p>No project matches.</p>
            ) : (
              <ul className="search-list">
                {matchedProjects.map((item) => (
                  <li key={item.id}>
                    <Link to={`/projects/${item.id}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2 className="card-title">Notices ({matchedNotices.length})</h2>
            {matchedNotices.length === 0 ? (
              <p>No notice matches.</p>
            ) : (
              <ul className="search-list">
                {matchedNotices.map((item) => (
                  <li key={item.id}>
                    <Link to={`/notices/${item.id}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  );
}
