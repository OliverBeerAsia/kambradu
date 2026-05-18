import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  Headphones,
  HelpCircle,
  Home,
  Library,
  LogIn,
  Mic,
  RadioTower,
  Users
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { kristangCommunity } from "@/data/kristang";

const navItems = [
  { href: "/", label: "Home", icon: Home, group: "Today" },
  { href: "/lexicon", label: "Lexicon", icon: BookOpen, group: "Public" },
  { href: "/lessons", label: "Lessons", icon: Library, group: "Public" },
  { href: "/stories", label: "Stories", icon: FileText, group: "Public" },
  { href: "/practice", label: "Practice", icon: Headphones, group: "Learner" },
  { href: "/learn", label: "Plan", icon: CalendarDays, group: "Learner" },
  { href: "/journal", label: "Journal", icon: FileText, group: "Learner" },
  { href: "/builder", label: "Builder", icon: BookOpen, group: "Learner" },
  { href: "/saved", label: "Saved", icon: BookOpen, group: "Learner" },
  { href: "/contribute", label: "Record", icon: Mic, group: "Contribute" },
  { href: "/steward", label: "Review", icon: CheckCircle2, group: "Steward" },
  { href: "/about", label: "Community", icon: Users, group: "Steward" }
];

const tools = [
  { href: "/practice", label: "Start practice", icon: Headphones },
  { href: "/about", label: "About and attribution", icon: HelpCircle }
];

const protectedHrefs = new Set(["/practice", "/learn", "/journal", "/builder", "/saved", "/contribute", "/steward"]);

const routeContexts: Record<string, { label: string; helper: string }> = {
  "/": { label: "Today", helper: "Learner loop" },
  "/lexicon": { label: "Public", helper: "Approved entries" },
  "/lessons": { label: "Public", helper: "Lessons and resources" },
  "/stories": { label: "Public", helper: "Phrases and stories" },
  "/practice": { label: "Learner", helper: "Audio-first practice" },
  "/learn": { label: "Learner", helper: "Practice plan" },
  "/journal": { label: "Learner", helper: "Private notes" },
  "/builder": { label: "Learner", helper: "Personal lexicon" },
  "/saved": { label: "Learner", helper: "Review queue" },
  "/contribute": { label: "Contributor", helper: "Draft and submit" },
  "/steward": { label: "Steward", helper: "Review queue" },
  "/about": { label: "Community", helper: "Policy and attribution" },
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
  let previousGroup = "";

  return (
    <main className={`app-shell ${className}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Kambradu home">
          <BrandMark />
          <span>
            <strong>Kambradu</strong>
            <small>Preserve. Learn. Belong.</small>
          </span>
        </Link>

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
                  className={`nav-button ${isActive ? "active" : ""}`}
                  href={item.href}
                  prefetch={protectedHrefs.has(item.href) ? false : undefined}
                >
                  <Icon size={21} strokeWidth={2.2} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </span>
            );
          })}
        </nav>

        <div className="sidebar-tools" aria-label="Support">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link href={tool.href} key={tool.label} prefetch={protectedHrefs.has(tool.href) ? false : undefined}>
                <Icon size={18} aria-hidden="true" />
                {tool.label}
              </Link>
            );
          })}
        </div>

        <Link className="language-button" href="/lexicon">
          <Globe2 size={20} aria-hidden="true" />
          <span>
            <strong>English</strong>
            <small>Interface</small>
          </span>
          <span aria-hidden="true">›</span>
        </Link>

        <div className="rail-status">
          <img src="/hegel.png" alt="" width={34} height={34} aria-hidden="true" />
          <span>
            <strong>Hegel</strong>
            <small>Local MVP guide</small>
          </span>
          <RadioTower size={16} aria-hidden="true" />
        </div>
      </aside>

      <section className="workspace" id="main-content" tabIndex={-1}>
        <header className="topbar">
          <div className="topbar-left">
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
