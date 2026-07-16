import type { ReactNode } from "react";

export function HegelCompanion({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className={`hegel-companion ${compact ? "compact" : ""}`} aria-label="Hegel, your Kambradu guide">
      <span className="hegel-portrait" aria-hidden="true">
        <img src="/hegel.png" alt="" />
      </span>
      <div className="hegel-copy">{children}</div>
    </div>
  );
}
