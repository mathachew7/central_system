import { useEffect, useMemo, useState } from "react";

import { api } from "../lib/api";
import type { SourceRegistryCategory, SourceRegistryEntry, SourceRegistryResponse } from "../types";

const categoryLabels: Record<SourceRegistryCategory, string> = {
  federal_ministries: "Federal Ministries",
  constitutional_bodies: "Constitutional Bodies",
  regulatory_bodies: "Regulatory Bodies",
  judiciary: "Judiciary",
  security_services: "Security Services",
  disaster_sources: "Disaster Sources",
  parliament: "Parliament",
  provinces: "Provinces"
};

interface EntryWithCategory extends SourceRegistryEntry {
  category: SourceRegistryCategory;
}

export default function Sources(): JSX.Element {
  const [registry, setRegistry] = useState<SourceRegistryResponse | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api.getSourceRegistry();
        setRegistry(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load source registry");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flattenedEntries = useMemo(() => {
    if (!registry) {
      return [];
    }

    return (Object.entries(registry.data) as [SourceRegistryCategory, SourceRegistryEntry[]][])
      .flatMap(([category, entries]) => entries.map((entry) => ({ ...entry, category })))
      .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
  }, [registry]);

  const filteredEntries = useMemo(() => {
    if (!query.trim()) {
      return flattenedEntries;
    }

    const normalized = query.trim().toLowerCase();

    return flattenedEntries.filter((entry) => {
      return (
        entry.name.toLowerCase().includes(normalized) ||
        entry.name_ne?.toLowerCase().includes(normalized) ||
        entry.id.toLowerCase().includes(normalized) ||
        entry.scraper_class.toLowerCase().includes(normalized) ||
        categoryLabels[entry.category].toLowerCase().includes(normalized)
      );
    });
  }, [flattenedEntries, query]);

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Public Source Registry</h1>
        <p className="page-description">Loading configured sources...</p>
      </div>
    );
  }

  if (error || !registry) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Public Source Registry</h1>
          <p className="page-description">Configured ministry and public institution sources.</p>
        </div>
        <div className="alert alert-error">{error || "Unable to load source registry"}</div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Public Source Registry</h1>
        <p className="page-description">
          Registry includes {registry.meta.totalSources} monitored sources across {registry.meta.totalCategories} source
          groups.
        </p>
      </div>

      <section className="source-category-grid">
        {registry.meta.categoryCounts.map((item) => (
          <article key={item.category} className="card source-category-card">
            <h3>{categoryLabels[item.category]}</h3>
            <p>{item.count} configured sources</p>
          </article>
        ))}
      </section>

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Browse Sources</h2>
          <p className="card-description">Search by source name, Nepali name, category, or scraper class.</p>
        </div>
        <div className="advanced-filter-grid">
          <div className="field">
            <label htmlFor="source-search">Search sources</label>
            <input
              id="source-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: home affairs, security, or bipad"
            />
          </div>
        </div>
      </section>

      <section className="source-grid">
        {filteredEntries.length === 0 ? (
          <article className="card">
            <p className="empty-state">No sources match this search.</p>
          </article>
        ) : (
          filteredEntries.map((entry) => (
            <article key={`${entry.category}-${entry.id}`} className="card source-card">
              <div className="source-card-header">
                <h3>{entry.name}</h3>
                <span className={`badge ${entry.priority === 1 ? "badge-active" : entry.priority === 2 ? "badge-planned" : "badge-secondary"}`}>
                  Priority {entry.priority}
                </span>
              </div>
              {entry.name_ne ? <p className="source-name-ne">{entry.name_ne}</p> : null}
              <p className="source-meta-line">{categoryLabels[entry.category]}</p>
              <p className="source-meta-line">Poll every {entry.poll_interval_mins} minutes</p>
              <p className="source-meta-line">Scraper: {entry.scraper_class}</p>
              <div className="record-links">
                <a href={entry.base_url} target="_blank" rel="noreferrer">
                  Official Website
                </a>
                {entry.has_api && entry.api_url ? (
                  <a href={entry.api_url} target="_blank" rel="noreferrer">
                    API Endpoint
                  </a>
                ) : null}
              </div>
            </article>
          ))
        )}
      </section>
    </>
  );
}
