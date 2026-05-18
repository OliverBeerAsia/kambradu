import Link from "next/link";

export function UserMenu({ role = "Learner" }: { role?: string }) {
  return (
    <Link className="profile-button simple-profile" href="/journal" prefetch={false}>
      <span className="avatar avatar-photo" aria-hidden="true">
        MD
      </span>
      <span>
        <strong>Maria D.</strong>
        <small>{role}</small>
      </span>
    </Link>
  );
}
