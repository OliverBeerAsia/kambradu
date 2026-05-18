import Link from "next/link";
import { Bell, Check, Cloud } from "lucide-react";

export function UserMenu({ role = "Contributor" }: { role?: string }) {
  return (
    <>
      <Link className="sync-button" href="/saved" prefetch={false}>
        <Check size={18} aria-hidden="true" />
        Sync ready
      </Link>
      <button className="icon-button" type="button" aria-label="Cloud sync">
        <Cloud size={20} aria-hidden="true" />
      </button>
      <button className="icon-button notification" type="button" aria-label="Notifications">
        <Bell size={20} aria-hidden="true" />
        <span>3</span>
      </button>
      <Link className="profile-button" href="/journal" prefetch={false}>
        <span className="avatar avatar-photo" aria-hidden="true">
          MD
        </span>
        <span>
          <strong>Maria D.</strong>
          <small>{role}</small>
        </span>
        <span aria-hidden="true">⌄</span>
      </Link>
    </>
  );
}
