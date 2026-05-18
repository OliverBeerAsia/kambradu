import type { AccessLevel } from "@/types/kambradu";

export const accessLabels: Record<AccessLevel, string> = {
  open: "Open",
  community: "Community",
  restricted: "Restricted"
};

export const accessDescriptions: Record<AccessLevel, string> = {
  open: "Anyone can view and use.",
  community: "Visible to signed-in members.",
  restricted: "Limited access. Permission needed."
};

export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
