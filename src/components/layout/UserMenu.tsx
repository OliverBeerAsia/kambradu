import Link from "next/link";

export function UserMenu({ role = "On this device" }: { role?: string }) {
  return (
    <Link aria-label="Open your memories on this device" className="profile-button simple-profile" href="/saved" prefetch={false}>
      <span className="avatar avatar-photo" aria-hidden="true">
        Y
      </span>
      <span>
        <strong>Your space</strong>
        <small>{role}</small>
      </span>
    </Link>
  );
}
