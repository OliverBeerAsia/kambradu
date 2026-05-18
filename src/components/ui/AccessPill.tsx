import { Globe2, Lock, ShieldCheck } from "lucide-react";
import { accessLabels } from "@/lib/access";
import type { AccessLevel } from "@/types/kambradu";

const iconMap = {
  open: Globe2,
  community: ShieldCheck,
  restricted: Lock
};

export function AccessPill({ level }: { level: AccessLevel }) {
  const Icon = iconMap[level];

  return (
    <span className={`access-pill ${level}`}>
      <Icon size={14} aria-hidden="true" />
      {accessLabels[level]}
    </span>
  );
}
