import type { ReactNode } from "react";
import { withBasePath } from "@/lib/base-path";

/**
 * Hegel beside a heading and one supporting sentence.
 *
 * Hegel appears on Today and completion only, and never supplies Kristang,
 * cultural guidance, pronunciation or approval. The portrait comes from the
 * site root by default; `portraitSrc` exists so the component can be drawn
 * outside the app, where that path does not resolve.
 */
export function HegelCompanion({
  children,
  compact = false,
  portraitSrc = withBasePath("/hegel.png")
}: {
  children: ReactNode;
  compact?: boolean;
  portraitSrc?: string;
}) {
  return (
    <div className={`hegel-companion ${compact ? "compact" : ""}`} aria-label="Hegel, your Kambradu guide">
      <span className="hegel-portrait" aria-hidden="true">
        <img src={portraitSrc} alt="" />
      </span>
      <div className="hegel-copy">{children}</div>
    </div>
  );
}
