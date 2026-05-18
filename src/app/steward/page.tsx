import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { ReviewQueue } from "@/components/steward/ReviewQueue";

export default function StewardPage() {
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
