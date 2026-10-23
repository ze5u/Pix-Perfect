import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import CreditsClient from "@/components/shared/CreditsClient";
import { getUserById, syncUserFromClerk } from "@/lib/actions/user.actions";

export const metadata = {
  title: "Credits — PixPerfect",
  description: "Your credit balance and available plans.",
};

/**
 * Server component fetches the user (and redirects when unauthenticated); the
 * plans grid is client-side so buying a plan can refresh the balance without a
 * full reload. Uses syncUserFromClerk as a fallback when the webhook
 * hasn't synced yet.
 */
export default async function CreditsPage() {
  const session = await auth();
  if (!session.userId) redirect("/sign-in");

  let user = await getUserById(session.userId);
  if (!user) {
    user = await syncUserFromClerk(session.userId);
  }
  if (!user) redirect("/sign-in");

  return <CreditsClient balance={user.creditBalance ?? 0} />;
}
