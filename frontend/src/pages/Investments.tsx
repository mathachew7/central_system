import { useEffect, useMemo, useState } from "react";

import { api } from "../lib/api";
import type {
  GovernmentAgendaCategory,
  GovernmentAgendaItem,
  GovernmentAgendaStatus,
  GovernmentAgendaTrackerResponse
} from "../types";

type Language = "ne" | "en";
type DeadlineFilter = "all" | "overdue" | "this-week" | "this-month" | "100-days";

const languageStorageKey = "government-agenda-lang";

const methodologyCopy: Record<
  GovernmentAgendaStatus,
  {
    ne: string;
    en: string;
  }
> = {
  "not-started": {
    ne: "सरकारले कुनै कदम चालेको छैन",
    en: "Government has taken no action"
  },
  "in-progress": {
    ne: "कार्यान्वयन प्रक्रिया सुरु भएको",
    en: "Implementation has begun"
  },
  completed: {
    ne: "प्रतिबद्धता पूर्ण रूपमा पूरा भएको",
    en: "Promise fully delivered"
  },
  broken: {
    ne: "समयसीमा नाघ्यो वा त्यागियो",
    en: "Deadline missed or abandoned"
  },
  stalled: {
    ne: "प्रगति रोकिएको",
    en: "Progress has stalled"
  }
};

const statusOrder: GovernmentAgendaStatus[] = ["completed", "in-progress", "broken", "stalled", "not-started"];

const padNumber = (value: number): string => value.toString().padStart(2, "0");

const formatPercent = (value: number, language: Language): string => {
  const locale = language === "ne" ? "ne-NP" : "en-US";

  if (value > 0 && value < 1) {
    return `${value.toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    })}%`;
  }

  return `${Math.round(value).toLocaleString(locale)}%`;
};

const formatDate = (value: string | null | undefined, language: Language): string => {
  if (!value) return language === "ne" ? "मिति उपलब्ध छैन" : "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(language === "ne" ? "ne-NP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const formatShortDate = (value: string, language: Language): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(language === "ne" ? "ne-NP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const getDeadlineInfo = (deadlineDate: string, language: Language): { text: string; className: string } => {
  const now = new Date();
  const deadline = new Date(deadlineDate);

  if (Number.isNaN(deadline.getTime())) {
    return {
      text: language === "ne" ? "समयसीमा उपलब्ध छैन" : "Deadline unavailable",
      className: ""
    };
  }

  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);

  if (diffDays < 0) {
    return {
      text: language === "ne" ? `${Math.abs(diffDays)} दिन ढिला` : `${Math.abs(diffDays)} days overdue`,
      className: "overdue"
    };
  }

  return {
    text: language === "ne" ? `${diffDays} दिन बाँकी` : `${diffDays} days left`,
    className: diffDays <= 7 ? "soon" : ""
  };
};

const getRemainingTime = (
  startAt: string,
  endAt: string
): { days: number; hours: number; minutes: number; seconds: number; progress: number } => {
  const now = new Date();
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, progress: 0 };
  }

  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = Math.max(now.getTime() - start.getTime(), 0);
  const remainingMs = Math.max(end.getTime() - now.getTime(), 0);

  return {
    days: Math.floor(remainingMs / 86_400_000),
    hours: Math.floor((remainingMs % 86_400_000) / 3_600_000),
    minutes: Math.floor((remainingMs % 3_600_000) / 60_000),
    seconds: Math.floor((remainingMs % 60_000) / 1_000),
    progress: totalMs > 0 ? Math.min((elapsedMs / totalMs) * 100, 100) : 0
  };
};

const matchesDeadlineFilter = (item: GovernmentAgendaItem, deadlineFilter: DeadlineFilter): boolean => {
  if (deadlineFilter === "all") return true;

  const now = new Date();
  const deadline = new Date(item.deadlineDate);

  if (Number.isNaN(deadline.getTime())) return false;

  if (deadlineFilter === "overdue") {
    return deadline < now;
  }

  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = diffMs / 86_400_000;

  if (deadlineFilter === "this-week") {
    return diffDays >= 0 && diffDays <= 7;
  }

  if (deadlineFilter === "this-month") {
    return diffDays >= 0 && diffDays <= 30;
  }

  if (deadlineFilter === "100-days") {
    return diffDays >= 0 && diffDays <= 100;
  }

  return true;
};

export default function Investments(): JSX.Element {
  const [tracker, setTracker] = useState<GovernmentAgendaTrackerResponse | null>(null);
  const [language, setLanguage] = useState<Language>(
    () => (window.localStorage.getItem(languageStorageKey) as Language | null) ?? "ne"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | GovernmentAgendaStatus>("all");
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPromiseId, setSelectedPromiseId] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; progress: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api.getGovernmentAgenda();
        setTracker(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load live government agenda");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!tracker) return;

    const syncCountdown = (): void => {
      setCountdown(getRemainingTime(tracker.plan.startAt, tracker.plan.endAt));
    };

    syncCountdown();
    const intervalId = window.setInterval(syncCountdown, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [tracker]);

  useEffect(() => {
    if (!tracker) return;

    const applyHashSelection = (): void => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) {
        setSelectedPromiseId(null);
        return;
      }

      const parsedId = Number.parseInt(hash, 10);
      if (!Number.isNaN(parsedId) && tracker.promises.some((item) => item.id === parsedId)) {
        setSelectedPromiseId(parsedId);
      }
    };

    applyHashSelection();
    window.addEventListener("hashchange", applyHashSelection);

    return () => {
      window.removeEventListener("hashchange", applyHashSelection);
    };
  }, [tracker]);

  useEffect(() => {
    if (selectedPromiseId === null) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setSelectedPromiseId(null);
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedPromiseId]);

  const filteredPromises = useMemo(() => {
    if (!tracker) return [];

    return tracker.promises.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && item.status !== selectedStatus) return false;
      if (!matchesDeadlineFilter(item, selectedDeadline)) return false;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      return (
        item.titleNe.toLowerCase().includes(query) ||
        item.titleEn.toLowerCase().includes(query) ||
        item.categoryNe.toLowerCase().includes(query) ||
        item.categoryEn.toLowerCase().includes(query) ||
        String(item.id).includes(query)
      );
    });
  }, [searchQuery, selectedCategory, selectedDeadline, selectedStatus, tracker]);

  const overdueCount = useMemo(() => {
    if (!tracker) return 0;

    return tracker.promises.filter((item) => {
      const deadline = new Date(item.deadlineDate);
      return !Number.isNaN(deadline.getTime()) && deadline < new Date() && item.status !== "completed";
    }).length;
  }, [tracker]);

  const selectedPromise = useMemo(() => {
    if (!tracker || selectedPromiseId === null) return null;
    return tracker.promises.find((item) => item.id === selectedPromiseId) ?? null;
  }, [selectedPromiseId, tracker]);

  const categoryBreakdown = useMemo(() => {
    if (!tracker) return [];

    return tracker.categories
      .filter((category) => category.id !== "all")
      .map((category) => {
        const categoryPromises = tracker.promises.filter((item) => item.category === category.id);
        const completed = categoryPromises.filter((item) => item.status === "completed").length;
        const total = categoryPromises.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          category,
          completed,
          total,
          percentage
        };
      });
  }, [tracker]);

  const statusCards = useMemo(() => {
    if (!tracker) return [];

    return [
      {
        key: "all",
        labelNe: "जम्मा प्रतिबद्धता",
        labelEn: "Total Promises",
        value: tracker.stats.total
      },
      {
        key: "completed",
        labelNe: tracker.statusConfig.completed.ne,
        labelEn: tracker.statusConfig.completed.en,
        value: tracker.stats.completed
      },
      {
        key: "in-progress",
        labelNe: tracker.statusConfig["in-progress"].ne,
        labelEn: tracker.statusConfig["in-progress"].en,
        value: tracker.stats.inProgress
      },
      {
        key: "broken",
        labelNe: tracker.statusConfig.broken.ne,
        labelEn: tracker.statusConfig.broken.en,
        value: tracker.stats.broken
      },
      {
        key: "stalled",
        labelNe: tracker.statusConfig.stalled.ne,
        labelEn: tracker.statusConfig.stalled.en,
        value: tracker.stats.stalled
      },
      {
        key: "not-started",
        labelNe: tracker.statusConfig["not-started"].ne,
        labelEn: tracker.statusConfig["not-started"].en,
        value: tracker.stats.notStarted
      }
    ] as const;
  }, [tracker]);

  const openPromise = (item: GovernmentAgendaItem): void => {
    setSelectedPromiseId(item.id);
    window.history.replaceState(null, "", `#${item.id}`);
  };

  const closePromise = (): void => {
    setSelectedPromiseId(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const renderCategoryLabel = (category: GovernmentAgendaCategory): string => {
    return language === "ne" ? category.ne : category.en;
  };

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Government Agenda</h1>
        <p className="page-description">Loading live agenda tracker...</p>
      </div>
    );
  }

  if (error || !tracker) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Government Agenda</h1>
          <p className="page-description">Live-linked accountability tracker from Pratipakshya.</p>
        </div>
        <div className="alert alert-error">{error || "Unable to load government agenda tracker"}</div>
      </>
    );
  }

  return (
      <>
      <section className="agenda-page-header card">
        <div className="agenda-hero-grid">
          <div className="agenda-hero-copy">
            <p className="agenda-badge">
              {language === "ne" ? "प्रत्यक्ष अनुगमन सक्रिय" : "Live Monitoring Active"}
            </p>
            <h1 className="page-title agenda-page-title">
              {language === "ne" ? "Government Agenda" : "Government Agenda"}
            </h1>
            <p className="agenda-page-subtitle">
              {language === "ne"
                ? "प्रतिपक्ष ट्र्याकरबाट प्रत्यक्ष ल्याइएको उत्तरदायित्व ड्यासबोर्ड"
                : "A live accountability dashboard synced from the Pratipakshya tracker"}
            </p>
            <p className="page-description agenda-page-description">
              {language === "ne"
                ? "स्थिति, प्रगति, प्रमाण, नोट्स, समयसीमा र विस्तृत व्याख्यासहित सरकारका सार्वजनिक प्रतिबद्धताहरू यहाँ नेपाली र अंग्रेजी दुवै भाषामा हेर्न सकिन्छ।"
                : "Track published government commitments with live statuses, progress signals, evidence, notes, deadlines, and deep explanations in both Nepali and English."}
            </p>

            <div className="agenda-highlight-row">
              <div className="agenda-highlight-chip">
                <strong>{tracker.stats.total}</strong>
                <span>{language === "ne" ? "प्रतिबद्धता" : "Commitments"}</span>
              </div>
              <div className="agenda-highlight-chip">
                <strong>{tracker.stats.overallProgress}%</strong>
                <span>{language === "ne" ? "समग्र प्रगति" : "Overall progress"}</span>
              </div>
              <div className="agenda-highlight-chip">
                <strong>{tracker.stats.inProgress}</strong>
                <span>{language === "ne" ? "कार्यान्वयनमा" : "In progress"}</span>
              </div>
            </div>

            <div className="agenda-toolbar">
              <div className="agenda-language-toggle" role="group" aria-label="Language selector">
                <button
                  type="button"
                  className={`agenda-language-btn${language === "ne" ? " active" : ""}`}
                  onClick={() => setLanguage("ne")}
                >
                  नेपाली
                </button>
                <button
                  type="button"
                  className={`agenda-language-btn${language === "en" ? " active" : ""}`}
                  onClick={() => setLanguage("en")}
                >
                  English
                </button>
              </div>

              <a className="btn btn-primary" href={tracker.source.homepageUrl} target="_blank" rel="noreferrer">
                {language === "ne" ? "मूल ट्र्याकर हेर्नुहोस्" : "View Original Tracker"}
              </a>
            </div>
          </div>

          <aside className="agenda-hero-panel">
            <div className="agenda-panel-topline">
              <span>{language === "ne" ? "ट्र्याकर स्न्यापसट" : "Tracker Snapshot"}</span>
              <a href={tracker.source.homepageUrl} target="_blank" rel="noreferrer">
                pratipakchya.com
              </a>
            </div>

            <div className="agenda-panel-stats">
              <div>
                <span>{language === "ne" ? "पूरा भयो" : "Completed"}</span>
                <strong>{tracker.stats.completed}</strong>
              </div>
              <div>
                <span>{language === "ne" ? "सुरु भएको छैन" : "Not started"}</span>
                <strong>{tracker.stats.notStarted}</strong>
              </div>
            </div>

            <div className="agenda-source-meta">
              <div className="agenda-source-item">
                <span>{language === "ne" ? "अन्तिम अपडेट" : "Last updated"}</span>
                <strong>{formatDate(tracker.stats.lastUpdated, language)}</strong>
              </div>
              <div className="agenda-source-item">
                <span>{language === "ne" ? "सिङ्क गरिएको" : "Synced"}</span>
                <strong>{formatDate(tracker.source.fetchedAt, language)}</strong>
              </div>
              <div className="agenda-source-item">
                <span>{language === "ne" ? "डेटा स्रोत" : "Data source"}</span>
                <strong>{language === "ne" ? "प्रतिपक्ष सार्वजनिक ट्र्याकर" : "Pratipakshya public tracker"}</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="agenda-countdown card">
        <div className="agenda-countdown-header">
          <div>
            <p className="agenda-countdown-kicker">
              {language === "ne" ? "प्रत्यक्ष कार्यकाल घडी" : "Live Term Clock"}
            </p>
            <h2 className="card-title agenda-countdown-title">
              {language === "ne" ? `${countdown.days} दिन बाँकी` : `${countdown.days} Days Remaining`}
            </h2>
            <p className="card-description agenda-countdown-description">
              {language === "ne"
                ? "प्रतिपक्षमा प्रकाशित समयसीमा अनुसार यो घडी हरेक सेकेन्ड अद्यावधिक हुन्छ।"
                : "This timer follows the live timing configuration published by Pratipakshya and updates every second."}
            </p>
          </div>

          <div className="agenda-countdown-summary">
            <span>{language === "ne" ? "कार्यकाल बितिसक्यो" : "Term Elapsed"}</span>
            <strong>{formatPercent(countdown.progress, language)}</strong>
          </div>
        </div>

        <div className="agenda-countdown-grid">
          <div className="agenda-countdown-item">
            <strong>{countdown.days}</strong>
            <span>{language === "ne" ? "दिन" : "Days"}</span>
          </div>
          <div className="agenda-countdown-item">
            <strong>{padNumber(countdown.hours)}</strong>
            <span>{language === "ne" ? "घण्टा" : "Hours"}</span>
          </div>
          <div className="agenda-countdown-item">
            <strong>{padNumber(countdown.minutes)}</strong>
            <span>{language === "ne" ? "मिनेट" : "Minutes"}</span>
          </div>
          <div className="agenda-countdown-item agenda-countdown-item-live">
            <strong>{padNumber(countdown.seconds)}</strong>
            <span>{language === "ne" ? "सेकेन्ड" : "Seconds"}</span>
          </div>
        </div>

        <div className="agenda-progress-track" aria-hidden="true">
          <div className="agenda-progress-fill" style={{ width: `${countdown.progress}%` }} />
        </div>

        <div className="agenda-date-range">
          <span>{formatDate(tracker.plan.startAt, language)}</span>
          <span>{formatDate(tracker.plan.endAt, language)}</span>
        </div>
      </section>

      <section className="agenda-status-grid">
        {statusCards.map((card) => (
          <button
            type="button"
            key={card.key}
            className={`agenda-status-card${selectedStatus === card.key ? " active" : ""}`}
            onClick={() => setSelectedStatus((current) => (current === card.key ? "all" : (card.key as typeof current)))}
          >
            <strong>{card.value}</strong>
            <span>{language === "ne" ? card.labelNe : card.labelEn}</span>
          </button>
        ))}
      </section>

      <section className="card agenda-overall-progress">
        <div className="agenda-overall-label">
          <span>{language === "ne" ? "समग्र प्रगति" : "Overall Progress"}</span>
          <strong>{tracker.stats.overallProgress}%</strong>
        </div>
        <div className="agenda-progress-track" aria-hidden="true">
          <div className="agenda-progress-fill" style={{ width: `${tracker.stats.overallProgress}%` }} />
        </div>
      </section>

      {overdueCount > 0 ? (
        <section className="agenda-overdue-banner">
          <span>
            {language === "ne"
              ? `${overdueCount} वटा प्रतिबद्धताको म्याद सकिएको छ`
              : `${overdueCount} promise${overdueCount > 1 ? "s are" : " is"} overdue`}
          </span>
          <button type="button" className="btn btn-secondary" onClick={() => setSelectedDeadline("overdue")}>
            {language === "ne" ? "हेर्नुहोस्" : "View"}
          </button>
        </section>
      ) : null}

      <section className="agenda-category-pills">
        {tracker.categories.map((category) => (
          <button
            type="button"
            key={category.id}
            className={`agenda-category-pill${selectedCategory === category.id ? " active" : ""}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span>{renderCategoryLabel(category)}</span>
            <strong>
              {category.id === "all"
                ? tracker.promises.length
                : tracker.promises.filter((item) => item.category === category.id).length}
            </strong>
          </button>
        ))}
      </section>

      <section className="card filter-card">
        <div className="advanced-filter-grid agenda-filter-grid">
          <div>
            <label htmlFor="agenda-search" className="filter-label">
              {language === "ne" ? "खोज" : "Search"}
            </label>
            <input
              id="agenda-search"
              className="filter-select"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={language === "ne" ? "प्रतिबद्धता खोज्नुहोस्..." : "Search promises..."}
            />
          </div>

          <div>
            <label htmlFor="agenda-status" className="filter-label">
              {language === "ne" ? "स्थिति" : "Status"}
            </label>
            <select
              id="agenda-status"
              className="filter-select"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as "all" | GovernmentAgendaStatus)}
            >
              <option value="all">{language === "ne" ? "सबै स्थिति" : "All Status"}</option>
              {statusOrder.map((status) => (
                <option key={status} value={status}>
                  {language === "ne" ? tracker.statusConfig[status].ne : tracker.statusConfig[status].en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="agenda-deadline" className="filter-label">
              {language === "ne" ? "समयसीमा" : "Deadline"}
            </label>
            <select
              id="agenda-deadline"
              className="filter-select"
              value={selectedDeadline}
              onChange={(event) => setSelectedDeadline(event.target.value as DeadlineFilter)}
            >
              <option value="all">{language === "ne" ? "सबै समयसीमा" : "All Deadlines"}</option>
              <option value="overdue">{language === "ne" ? "म्याद सकिएको" : "Overdue"}</option>
              <option value="this-week">{language === "ne" ? "यो हप्ता" : "This Week"}</option>
              <option value="this-month">{language === "ne" ? "यो महिना" : "This Month"}</option>
              <option value="100-days">{language === "ne" ? "१०० दिन" : "100 Days"}</option>
            </select>
          </div>
        </div>
      </section>

      <div className="agenda-results-count">
        {language === "ne"
          ? `${filteredPromises.length} वटा प्रतिबद्धता देखाइएको`
          : `Showing ${filteredPromises.length} of ${tracker.promises.length} promises`}
      </div>

      {filteredPromises.length === 0 ? (
        <div className="card">
          <p>{language === "ne" ? "कुनै प्रतिबद्धता भेटिएन" : "No promises found"}</p>
        </div>
      ) : (
        <section className="agenda-card-grid">
          {filteredPromises.map((item) => {
            const status = tracker.statusConfig[item.status];
            const deadlineInfo = getDeadlineInfo(item.deadlineDate, language);

            return (
              <article
                key={item.id}
                className="agenda-item-card"
                role="button"
                tabIndex={0}
                onClick={() => openPromise(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openPromise(item);
                  }
                }}
              >
                <div className="agenda-item-header">
                  <span className="agenda-item-id">#{String(item.id).padStart(3, "0")}</span>
                  <span className="agenda-inline-status" style={{ color: status.color }}>
                    {language === "ne" ? status.ne : status.en}
                  </span>
                </div>

                <div className="agenda-item-category">
                  {language === "ne" ? item.categoryNe : item.categoryEn}
                </div>

                <h3>{language === "ne" ? item.titleNe : item.titleEn}</h3>

                <div className="agenda-item-footer">
                  <span className={`agenda-deadline-chip ${deadlineInfo.className}`}>{deadlineInfo.text}</span>
                  <span>{item.progress}%</span>
                </div>

                <div className="agenda-progress-track" aria-hidden="true">
                  <div
                    className="agenda-progress-fill"
                    style={{ width: `${item.progress}%`, background: status.color }}
                  />
                </div>

                {item.evidence ? <p className="agenda-evidence-preview">{item.evidence}</p> : null}

                <p className="agenda-updated-text">
                  {language === "ne" ? "अपडेट" : "Updated"}: {formatShortDate(item.lastUpdated, language)}
                </p>
              </article>
            );
          })}
        </section>
      )}

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">{language === "ne" ? "वर्गअनुसार प्रगति" : "Progress by Category"}</h2>
        </div>
        <div className="agenda-breakdown-grid">
          {categoryBreakdown.map((item) => (
            <article key={item.category.id} className="agenda-breakdown-card">
              <div>
                <h3>{renderCategoryLabel(item.category)}</h3>
                <p>
                  {item.completed}/{item.total} {language === "ne" ? "पूरा" : "completed"}
                </p>
              </div>
              <strong>{item.percentage}%</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="card agenda-methodology-section">
        <div className="card-header">
          <h2 className="card-title">{language === "ne" ? "हाम्रो पद्धति" : "Our Methodology"}</h2>
        </div>
        <div className="agenda-methodology-grid">
          {statusOrder.map((statusKey) => (
            <article key={statusKey} className="agenda-method-card">
              <div className="agenda-method-status" style={{ color: tracker.statusConfig[statusKey].color }}>
                {language === "ne" ? tracker.statusConfig[statusKey].ne : tracker.statusConfig[statusKey].en}
              </div>
              <p>{language === "ne" ? methodologyCopy[statusKey].ne : methodologyCopy[statusKey].en}</p>
            </article>
          ))}
        </div>
      </section>

      {selectedPromise ? (
        <div className="agenda-modal-overlay" onClick={closePromise}>
          <div className="agenda-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="agenda-modal-close" onClick={closePromise} aria-label="Close details">
              ×
            </button>

            <div className="agenda-modal-id">#{String(selectedPromise.id).padStart(3, "0")}</div>
            <div
              className="agenda-modal-status"
              style={{ color: tracker.statusConfig[selectedPromise.status].color }}
            >
              {language === "ne"
                ? tracker.statusConfig[selectedPromise.status].ne
                : tracker.statusConfig[selectedPromise.status].en}
            </div>

            <h2 className="agenda-modal-title">
              {language === "ne" ? selectedPromise.titleNe : selectedPromise.titleEn}
            </h2>
            <p className="agenda-modal-subtitle">
              {language === "ne" ? selectedPromise.titleEn : selectedPromise.titleNe}
            </p>

            <div className="agenda-modal-meta-grid">
              <div>
                <span>{language === "ne" ? "वर्ग" : "Category"}</span>
                <strong>{language === "ne" ? selectedPromise.categoryNe : selectedPromise.categoryEn}</strong>
              </div>
              <div>
                <span>{language === "ne" ? "समयसीमा" : "Deadline"}</span>
                <strong>
                  {selectedPromise.deadline} · {formatShortDate(selectedPromise.deadlineDate, language)}
                </strong>
              </div>
              <div>
                <span>{language === "ne" ? "अन्तिम अपडेट" : "Last Updated"}</span>
                <strong>{formatShortDate(selectedPromise.lastUpdated, language)}</strong>
              </div>
              <div>
                <span>{language === "ne" ? "प्रगति" : "Progress"}</span>
                <strong>{selectedPromise.progress}%</strong>
              </div>
            </div>

            <div className="agenda-progress-track" aria-hidden="true">
              <div
                className="agenda-progress-fill"
                style={{
                  width: `${selectedPromise.progress}%`,
                  background: tracker.statusConfig[selectedPromise.status].color
                }}
              />
            </div>

            {selectedPromise.notes ? (
              <section className="agenda-modal-section">
                <h3>{language === "ne" ? "नोट्स" : "Notes"}</h3>
                <p>{selectedPromise.notes}</p>
              </section>
            ) : null}

            {selectedPromise.evidence ? (
              <section className="agenda-modal-section">
                <h3>{language === "ne" ? "प्रमाण" : "Evidence"}</h3>
                <p>{selectedPromise.evidence}</p>
              </section>
            ) : null}

            {selectedPromise.details?.description ? (
              <section className="agenda-modal-section">
                <h3>{language === "ne" ? "के हो?" : "What is this?"}</h3>
                <p>{selectedPromise.details.description}</p>
              </section>
            ) : null}

            {selectedPromise.details?.impact ? (
              <section className="agenda-modal-section">
                <h3>{language === "ne" ? "जनतालाई असर" : "Impact on People"}</h3>
                <p>{selectedPromise.details.impact}</p>
              </section>
            ) : null}

            {selectedPromise.details?.whyNeeded ? (
              <section className="agenda-modal-section">
                <h3>{language === "ne" ? "किन आवश्यक?" : "Why is this needed?"}</h3>
                <p>{selectedPromise.details.whyNeeded}</p>
              </section>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
