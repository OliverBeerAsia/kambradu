"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  Headphones,
  Home,
  Library,
  LockKeyhole,
  LogIn,
  Menu,
  RadioTower,
  ShieldCheck,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { kristangCommunity } from "@/data/kristang";

const navItems = [
  { href: "/", label: "Today", icon: Home, group: "Today" },
  { href: "/lessons", label: "Browse", icon: Library, group: "Browse" },
  { href: "/practice", label: "Practice", icon: Headphones, group: "Practice" },
  { href: "/builder", label: "Build", icon: BookOpen, group: "Build" },
  { href: "/steward", label: "Review", icon: CheckCircle2, group: "Review" }
];

const protectedHrefs = new Set(["/practice", "/learn", "/journal", "/builder", "/saved", "/contribute", "/steward"]);

const routeContexts: Record<string, { label: string; helper: string }> = {
  "/": { label: "Today", helper: "Learner loop" },
  "/learn": { label: "Today", helper: "Active cycle" },
  "/lexicon": { label: "Browse", helper: "Approved entries" },
  "/lessons": { label: "Browse", helper: "Lessons and resources" },
  "/stories": { label: "Browse", helper: "Phrases and stories" },
  "/practice": { label: "Practice", helper: "Audio-first cycle work" },
  "/saved": { label: "Practice", helper: "Review queue" },
  "/journal": { label: "Build", helper: "Private notes" },
  "/builder": { label: "Build", helper: "Personal lexicon" },
  "/contribute": { label: "Build", helper: "Draft and submit" },
  "/steward": { label: "Review", helper: "Steward queue" },
  "/about": { label: "Review", helper: "Policy and attribution" },
  "/sign-in": { label: "Account", helper: "Local session" }
};

function routeContext(activePath: string) {
  return routeContexts[activePath] ?? routeContexts["/"];
}

export function AppShell({
  children,
  activePath = "/",
  authSlot,
  className = ""
}: {
  children: ReactNode;
  activePath?: string;
  authSlot?: ReactNode;
  className?: string;
}) {
  const context = routeContext(activePath);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isProtectedRoute = [...protectedHrefs].some((href) => activePath === href || activePath.startsWith(`${href}/`));

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  function renderNavigation(onNavigate?: () => void) {
    let previousGroup = "";

    return (
      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.href || (item.href !== "/" && activePath.startsWith(item.href));
          const showGroup = item.group !== previousGroup;
          previousGroup = item.group;

          return (
            <span className="nav-cluster" key={item.href}>
              {showGroup ? <span className="nav-group-label">{item.group}</span> : null}
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`nav-button ${isActive ? "active" : ""}`}
                href={item.href}
                onClick={onNavigate}
                prefetch={protectedHrefs.has(item.href) ? false : undefined}
              >
                <Icon size={21} strokeWidth={2.2} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </span>
          );
        })}
      </nav>
    );
  }

  return (
    <main className={`app-shell ${drawerOpen ? "drawer-open" : ""} ${className}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar desktop-rail" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Kambradu home">
          <BrandMark />
          <span>
            <strong>Kambradu</strong>
          </span>
        </Link>

        {renderNavigation()}

        <div className="rail-status">
          <img src="/hegel.png" alt="" width={34} height={34} aria-hidden="true" />
          <span>
            <strong>Hegel</strong>
            <small>Local guide</small>
          </span>
          <RadioTower size={16} aria-hidden="true" />
        </div>
      </aside>

      {drawerOpen ? (
        <>
          <button className="drawer-backdrop" aria-label="Close navigation drawer" onClick={() => setDrawerOpen(false)} type="button" />
          <aside className="mobile-drawer" role="dialog" aria-label="Kambradu navigation" aria-modal="true">
            <div className="drawer-heading">
              <Link className="brand" href="/" onClick={() => setDrawerOpen(false)} aria-label="Kambradu home">
                <BrandMark />
                <span>
                  <strong>Kambradu</strong>
                </span>
              </Link>
              <button ref={closeButtonRef} className="drawer-close" onClick={() => setDrawerOpen(false)} type="button">
                Close
              </button>
            </div>

            {renderNavigation(() => setDrawerOpen(false))}

            <div className="drawer-state-grid">
              <span>
                <ShieldCheck size={17} aria-hidden="true" />
                {isProtectedRoute ? "Protected learner route" : "Public browse route"}
              </span>
              <span>
                <RadioTower size={17} aria-hidden="true" />
                Local prototype
              </span>
            </div>

            <div className="rail-status">
              <img src="/hegel.png" alt="" width={34} height={34} aria-hidden="true" />
              <span>
                <strong>Hegel</strong>
                <small>Consent before publication</small>
              </span>
              <RadioTower size={16} aria-hidden="true" />
            </div>
          </aside>
        </>
      ) : null}

      <section className="workspace" id="main-content" tabIndex={-1}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-button" type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation drawer">
              <Menu size={21} aria-hidden="true" />
              Menu
            </button>

            <Link className="community-selector" href="/lexicon">
              <span className="flag-tile" aria-hidden="true" />
              <span>
                <strong>{kristangCommunity.name}</strong>
                <small>{kristangCommunity.region}</small>
              </span>
              <span aria-hidden="true">⌄</span>
            </Link>

            <div className="workspace-context" aria-label="Current workspace">
              <strong>{context.label}</strong>
              <span>{context.helper}</span>
            </div>

            <div className="mobile-route-state">
              <LockKeyhole size={16} aria-hidden="true" />
              <span>{isProtectedRoute ? "Protected" : "Public"}</span>
            </div>
          </div>

          <div className="topbar-actions">
            {authSlot ?? (
              <Link className="sync-button" href="/sign-in">
                <LogIn size={18} aria-hidden="true" />
                Sign in
              </Link>
            )}
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}
