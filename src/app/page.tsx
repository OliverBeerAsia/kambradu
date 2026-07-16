import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { HegelCompanion } from "@/components/ui/HegelCompanion";

export default function Home() {
  return (
    <AppShell activePath="/" authSlot={<UserMenu />}>
      <div className="route-page simple-today-page">
        <section className="simple-today" aria-labelledby="today-heading">
          <HegelCompanion>
            <h1 id="today-heading">Ready for some Kristang?</h1>
            <p>Meet a word and see where it takes you.</p>
          </HegelCompanion>

          <Link className="simple-start-button" href="/practice" prefetch={false}>
            Let&apos;s begin
            <ArrowRight size={20} aria-hidden="true" />
          </Link>

          <p className="simple-private-note">
            <LockKeyhole size={17} aria-hidden="true" />
            About 5 minutes. Saved on this device.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
