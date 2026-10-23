import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { getImageById } from "@/lib/actions/image.action";
import { getUserById } from "@/lib/actions/user.actions";

import ImageDetailsClient from "./ImageDetailsClient";

export const metadata = {
  title: "Image — PixPerfect",
};

/**
 * The IDOR lives here: the previous version let any signed-in user open any
 * image ID and read it. Ownership is checked against the DB row before the
 * detail view is rendered.
 */
export default async function ImageDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session.userId) redirect("/sign-in");

  const [user, image] = await Promise.all([
    getUserById(session.userId),
    getImageById(id),
  ]);

  if (!image) notFound();

  // Compare Mongo object IDs, not Clerk IDs. `image.author._id` is a Mongo
  // ObjectId while `session.userId` is a Clerk ID, so the direct comparison
  // the previous version used was always false and nobody was ever an owner.
  const isOwner =
    !!user && String(image.author?._id) === String(user._id);

  return <ImageDetailsClient image={image} isOwner={isOwner} />;
}
