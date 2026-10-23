import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById, syncUserFromClerk } from "@/lib/actions/user.actions";

/**
 * /transformations/add/:type — entry point for a new transform.
 * Unknown types 404 instead of rendering a form with an empty title.
 * Uses syncUserFromClerk as a fallback when the webhook hasn't synced yet.
 */
export default async function AddTransformationTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  const session = await auth();
  if (!session.userId) redirect("/sign-in");

  const transformation = transformationTypes[type as TransformationTypeKey];
  if (!transformation) notFound();

  // Try to get user from MongoDB. If not found, sync from Clerk (webhook
  // might not have fired yet for brand-new accounts).
  let user = await getUserById(session.userId);
  if (!user) {
    user = await syncUserFromClerk(session.userId);
  }
  if (!user) {
    // User truly doesn't exist — Clerk user might have been deleted.
    notFound();
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section>
        <TransformationForm
          action="Add"
          userId={user._id as string}
          type={type as TransformationTypeKey}
          creditBalance={user.creditBalance ?? 0}
        />
      </section>
    </div>
  );
}
