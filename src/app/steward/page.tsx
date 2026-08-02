import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { ReviewQueue } from "@/components/steward/ReviewQueue";
import { notFound } from "next/navigation";

export default function StewardPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <AppShell activePath="/steward" authSlot={<UserMenu role="Steward" />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Review</h1>
        </section>
        <ReviewQueue />
      </div>
    </AppShell>
  );
}
