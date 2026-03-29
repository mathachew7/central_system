import { type FormEvent, ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { path: "/", label: "Home" },
  { path: "/ministries", label: "Ministries" },
  { path: "/sources", label: "Sources" },
  { path: "/news", label: "News & Notices" },
  { path: "/government-agenda", label: "Government Agenda" },
  { path: "/contact", label: "Contact" }
];

export default function Layout({ children }: LayoutProps): JSX.Element {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <div className="platform-shell">
      <header className="top-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label="Toggle menu"
            >
              <span className="hamburger"></span>
            </button>
          </div>

          <div className="navbar-center">
            <h1 className="central-title">
              Nepal Government Transparency Platform <span className="central-flag" aria-hidden="true">🇳🇵</span>
            </h1>
          </div>

          <div className="navbar-right">
            <form className="search-container" onSubmit={onSearch}>
              <input
                type="text"
                placeholder="Search projects, notices, ministries..."
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button type="submit" className="search-button" aria-label="Search">
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="sub-navbar">
        <div className="sub-navbar-inner">
          <div className="sub-navbar-navwrap">
            <nav className="sub-navbar-links" aria-label="Primary navigation">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sub-nav-link${isActive ? " active" : ""}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <article className="gov-context">
            <h2>Our Government</h2>
            <p>
              Nepal is a federal democratic republic with power shared across federal, provincial, and local governments.
              Governance functions are exercised through legislative, executive, and judicial institutions under the
              Constitution of Nepal, with clear mandates for ministries and public bodies.
            </p>
          </article>
        </div>
      </section>

      <main className="page-content">{children}</main>

      <footer className="platform-footer">
        <div className="platform-footer-inner">
          <div>
            <h3>Platform</h3>
            <p>Independent civic transparency platform for Nepal public information.</p>
          </div>

          <div>
            <h3>Core Scope</h3>
            <ul>
              <li>3 ministries in phase one</li>
              <li>Project tracking and notices</li>
              <li>Source-linked public records</li>
            </ul>
          </div>

          <div>
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/ministries">Ministries</Link>
              </li>
              <li>
                <Link to="/sources">Sources Registry</Link>
              </li>
              <li>
                <Link to="/news">News and Notices</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {isMenuOpen && (
        <div className="full-page-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="full-page-menu" onClick={(event) => event.stopPropagation()}>
            <div className="menu-header">
              <h2>Navigation</h2>
              <button className="close-menu" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                X
              </button>
            </div>

            <nav className="menu-navigation" aria-label="Drawer navigation">
              <ul className="menu-links">
                {navigation.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} onClick={() => setIsMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
