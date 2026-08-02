"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BookHeart, BookOpen, Home, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";

const navItems = [
  { href: "/", label: "Today", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/memories", label: "Memories", icon: BookHeart }
] as const;

export function AppShell({
  children,
  activePath = "/",
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

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      menuButtonRef.current?.focus();
    };
  }, [drawerOpen]);

  const navigation = (kind: "primary" | "drawer" | "bottom" = "primary") => (
    <nav className={kind === "primary" ? "primary-nav" : kind === "drawer" ? "drawer-nav" : "bottom-nav"} aria-label={kind === "bottom" ? "Quick navigation" : "Primary navigation"}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? activePath === "/" : activePath === href || activePath.startsWith(`${href}/`);
        return (
          <Link aria-current={active ? "page" : undefined} className={active ? "active" : ""} href={href} key={href} onClick={() => setDrawerOpen(false)}>
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className={`app-shell ${immersive ? "immersive" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Kambradu home">
          <BrandMark />
          <strong>Kambradu</strong>
        </Link>
        {!immersive ? navigation("primary") : <Link className="quiet-link" href="/">Leave practice</Link>}
        {!immersive ? (
          <button ref={menuButtonRef} className="menu-button" type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation" aria-expanded={drawerOpen}>
            <Menu size={22} aria-hidden="true" />
            Menu
          </button>
        ) : null}
      </header>

      {drawerOpen ? (
        <div className="drawer-layer" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDrawerOpen(false);
        }}>
          <aside className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Kambradu navigation">
            <div className="drawer-heading">
              <strong>Kambradu</strong>
              <button ref={closeButtonRef} type="button" onClick={() => setDrawerOpen(false)} aria-label="Close navigation">
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            {navigation("drawer")}
            <Link className="drawer-about" href="/about" onClick={() => setDrawerOpen(false)}>About and sources</Link>
          </aside>
        </div>
      ) : null}

      <main id="main-content" tabIndex={-1}>{children}</main>

      {!immersive ? (
        <footer className="site-footer">
          <Link href="/about">About, sources and permissions</Link>
        </footer>
      ) : null}

      {!immersive ? navigation("bottom") : null}
    </div>
  );
}
