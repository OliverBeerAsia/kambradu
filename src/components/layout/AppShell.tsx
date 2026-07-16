"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BookHeart,
  ChevronLeft,
  Headphones,
  Home,
  Library,
  LockKeyhole,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { kristangCommunity } from "@/data/kristang";

const navItems = [
  { href: "/", label: "Today", icon: Home, activePaths: ["/"] },
  { href: "/lessons", label: "Learn", icon: Headphones, activePaths: ["/lessons", "/learn", "/practice"] },
  { href: "/saved", label: "Memories", icon: BookHeart, activePaths: ["/saved", "/builder", "/journal", "/contribute"] },
  { href: "/lexicon", label: "Explore", icon: Library, activePaths: ["/lexicon", "/stories"] }
];

const restrictedHrefs = new Set(["/contribute", "/steward"]);
const deviceLocalHrefs = ["/practice", "/learn", "/journal", "/builder", "/saved"];

export function AppShell({
  children,
  activePath = "/",
  authSlot,
  className = "",
  immersive = false
}: {
  children: ReactNode;
  activePath?: string;
  authSlot?: ReactNode;
  className?: string;
  immersive?: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const isDeviceLocalRoute = deviceLocalHrefs.some((href) => activePath === href || activePath.startsWith(`${href}/`));

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : menuButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }

      if (event.key === "Tab" && drawerRef.current) {
        const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [drawerOpen]);

  function renderNavigation(onNavigate?: () => void) {
    return (
      <nav className="nav-list" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.activePaths.some((path) => activePath === path || (path !== "/" && activePath.startsWith(`${path}/`)));

          return (
            <span className="nav-cluster" key={item.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`nav-button ${isActive ? "active" : ""}`}
                href={item.href}
                onClick={onNavigate}
                prefetch={restrictedHrefs.has(item.href) ? false : undefined}
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
    <div className={`app-shell ${drawerOpen ? "drawer-open" : ""} ${immersive ? "immersive-shell" : ""} ${className}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {!immersive ? <aside className="sidebar desktop-rail" aria-hidden={drawerOpen || undefined} inert={drawerOpen ? true : undefined} aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Kambradu home">
          <BrandMark />
          <span>
            <strong>Kambradu</strong>
          </span>
        </Link>

        {renderNavigation()}

      </aside> : null}

      {drawerOpen ? (
        <>
          <button className="drawer-backdrop" tabIndex={-1} aria-label="Close navigation drawer" onClick={() => setDrawerOpen(false)} type="button" />
          <aside className="mobile-drawer" id="mobile-navigation" ref={drawerRef} role="dialog" aria-label="Kambradu navigation" aria-modal="true">
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

            <p className="drawer-reassurance">
              <ShieldCheck size={18} aria-hidden="true" />
              Notes are stored in this browser profile. Other people using it may be able to see them.
            </p>

            <div className="drawer-secondary-links" aria-label="More Kambradu spaces">
              <Link href="/about" onClick={() => setDrawerOpen(false)}>
                About Kambradu
              </Link>
            </div>

          </aside>
        </>
      ) : null}

      <div className="workspace" aria-hidden={drawerOpen || undefined} inert={drawerOpen ? true : undefined}>
        <header className="topbar">
          <div className="topbar-left">
            {immersive ? (
              <Link className="lesson-exit" href="/">
                <ChevronLeft size={20} aria-hidden="true" />
                Today
              </Link>
            ) : <button
              ref={menuButtonRef}
              className="mobile-menu-button"
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-controls="mobile-navigation"
              aria-expanded={drawerOpen}
              aria-label="Open navigation drawer"
            >
              <Menu size={21} aria-hidden="true" />
              Menu
            </button>}

            <div className="community-selector" aria-label={`Learning Kristang, ${kristangCommunity.region}`}>
              <span className="flag-tile neutral-language-tile" aria-hidden="true">K</span>
              <span>
                <strong>Kristang</strong>
                <small>{kristangCommunity.region}</small>
              </span>
            </div>

            <div className="mobile-route-state">
              <LockKeyhole size={16} aria-hidden="true" />
              <span>{isDeviceLocalRoute ? "On this device" : "Reference collection"}</span>
            </div>
          </div>

          <div className="topbar-actions">
            {authSlot}
          </div>
        </header>

        <main id="main-content" tabIndex={-1}>{children}</main>
      </div>

      {!immersive ? <nav className="mobile-bottom-nav" aria-hidden={drawerOpen || undefined} inert={drawerOpen ? true : undefined} aria-label="Quick navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.activePaths.some((path) => activePath === path || (path !== "/" && activePath.startsWith(`${path}/`)));

          return (
            <Link aria-current={isActive ? "page" : undefined} className={isActive ? "active" : ""} href={item.href} key={item.href} prefetch={restrictedHrefs.has(item.href) ? false : undefined}>
              <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav> : null}
    </div>
  );
}
