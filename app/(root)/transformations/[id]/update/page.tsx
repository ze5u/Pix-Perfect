import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getImageById } from "@/lib/actions/image.action";
import { getUserById, syncUserFromClerk } from "@/lib/actions/user.actions";

/**
 * Re-run a transform against the same source image. Re-fetches the user too so
 * the credit counter is current — this used to read a stale balance.
 * Uses syncUserFromClerk as a fallback when the webhook hasn't synced yet.
 */
export default async function UpdateTransformationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session.userId) redirect("/sign-in");

  const image = await getImageById(id);
  if (!image) notFound();

  // Try to get user from MongoDB. If not found, sync from Clerk.
  let user = await getUserById(session.userId);
  if (!user) {
    user = await syncUserFromClerk(session.userId);
  }
  if (!user) notFound();

  // Only the author may edit. The image action checks too, but bailing here
  // avoids rendering a form the user is not allowed to submit.
  if (String(image.author?._id) !== String(user._id)) notFound();

  const transformation = transformationTypes[image.transformationType as TransformationTypeKey];
  if (!transformation) notFound();

  return (
    <div className="space-y-10 animate-fade-in">
      <Header title={transformation.title} subtitle="Edit and re-apply the transformation" />
      <section>
        <TransformationForm
          action="Update"
          userId={user._id as string}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={user.creditBalance ?? 0}
          config={image.config as Transformations}
          data={image}
        />
      </section>
    </div>
  );
}
