import Link from "next/link";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Headphones,
  LockKeyhole,
  Play,
  RadioTower,
  ShieldCheck,
  Volume2
} from "lucide-react";
import { cycleReviewLabels, getCycleProgress } from "@/lib/learning-cycles";
import type { LearningCycle, LearningCycleReviewStatus } from "@/types/kambradu";

type LedgerItem = {
  label: string;
  value: string | number;
  tone?: "neutral" | "active" | "good" | "warning" | "danger";
};

const statusTone: Record<LearningCycleReviewStatus, LedgerItem["tone"]> = {
  "not-started": "neutral",
  "in-progress": "active",
  submitted: "warning",
  "changes-requested": "danger",
  approved: "good"
};

export function WorkbenchHeader({
  title,
  description: _description,
  cycle,
  action
}: {
  title: string;
  description: string;
  cycle?: LearningCycle;
  action?: ReactNode;
}) {
  return (
    <header className="workbench-header">
      <div>
        <span className="workbench-label">Local workbench</span>
        <h2>{title}</h2>
      </div>
      {cycle ? (
        <div className="cycle-status-card">
          <span>{cycle.shortTitle}</span>
          <strong>{cycleReviewLabels[cycle.reviewStatus]}</strong>
          <small>{getCycleProgress(cycle).percent}% cycle progress</small>
        </div>
      ) : null}
      {action ? <div className="workbench-header-action">{action}</div> : null}
    </header>
  );
}

export function LedgerStrip({ items }: { items: LedgerItem[] }) {
  return (
    <div className="ledger-strip" aria-label="Cycle ledger">
      {items.map((item) => (
        <span className={item.tone ?? "neutral"} key={item.label}>
          <strong>{item.value}</strong>
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function RouteToolbar({ children, label = "Route tools" }: { children: ReactNode; label?: string }) {
  return (
    <div className="route-toolbar" aria-label={label}>
      {children}
    </div>
  );
}

export function RecordRow({
  icon,
  title,
  detail,
  meta,
  status,
  href,
  action
}: {
  icon?: ReactNode;
  title: string;
  detail: string;
  meta?: string;
  status?: string;
  href?: string;
  action?: ReactNode;
}) {
  const body = (
    <>
      <span className="record-row-icon">{icon ?? <FileText size={20} aria-hidden="true" />}</span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
        {meta ? <em>{meta}</em> : null}
      </span>
      {status ? <b>{status}</b> : <ChevronRight size={18} aria-hidden="true" />}
      {action ? <span className="record-row-action">{action}</span> : null}
    </>
  );

  if (href) {
    return (
      <Link className="record-row" href={href} prefetch={false}>
        {body}
      </Link>
    );
  }

  return <div className="record-row">{body}</div>;
}

export function AccessState({
  state,
  label,
  detail
}: {
  state: "local" | "private" | "review" | "approved" | "blocked";
  label: string;
  detail: string;
}) {
  const icons = {
    local: RadioTower,
    private: LockKeyhole,
    review: Clock3,
    approved: CheckCircle2,
    blocked: ShieldCheck
  };
  const Icon = icons[state];

  return (
    <div className={`access-state ${state}`}>
      <Icon size={18} aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </div>
  );
}

export function AudioControl({
  label,
  detail,
  active = false
}: {
  label: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div className={`audio-control ${active ? "active" : ""}`}>
      <button type="button" aria-label={`Play ${label}`}>
        {active ? <Volume2 size={22} aria-hidden="true" /> : <Play size={22} aria-hidden="true" />}
      </button>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </div>
  );
}

export function HegelCallout({
  title,
  children,
  compact = false
}: {
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <aside className={`hegel-callout ${compact ? "compact" : ""}`}>
      <img src="/hegel.png" alt="" width={compact ? 50 : 64} height={compact ? 50 : 64} aria-hidden="true" />
      <div>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </aside>
  );
}

export function cycleLedgerItems(cycle: LearningCycle): LedgerItem[] {
  const progress = getCycleProgress(cycle);

  return [
    { label: "complete", value: `${progress.completed}/${progress.total}`, tone: "active" },
    { label: "prompts", value: cycle.practicePromptIds.length },
    { label: "private notes", value: cycle.journalEntryIds.length, tone: cycle.journalEntryIds.length ? "good" : "neutral" },
    { label: "speaker checks", value: cycle.speakerCheckIds.length, tone: cycle.speakerCheckIds.length ? "good" : "warning" },
    { label: cycleReviewLabels[cycle.reviewStatus], value: cycle.reviewStatus === "approved" ? "Live" : "Local", tone: statusTone[cycle.reviewStatus] }
  ];
}
