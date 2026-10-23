import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { createUser } from "@/lib/actions/user.actions";

/**
 * Sync a user from Clerk session to MongoDB on-demand.
 *
 * Clerk's webhook delivery is async — sometimes the user.created event arrives
 * after the first page request (especially with ngrok or local dev). This route
 * runs when `getUserById` returns null: it fetches the fresh user data from
 * Clerk and writes it to Mongo immediately.
 */
export async function POST() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Fetch the fresh user from Clerk (not the cached webhook payload).
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(session.userId);

    const userRecord = await createUser({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
      username: clerkUser.username ?? "",
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      photo: clerkUser.imageUrl ?? "",
      creditBalance: 20,
    });

    if (!userRecord) {
      console.error("syncUser: createUser returned null");
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }

    // Ensure the Clerk user has its Mongo _id in publicMetadata.
    await client.users.updateUserMetadata(session.userId, {
      publicMetadata: { userId: userRecord._id },
    });

    return NextResponse.json({ message: "OK", user: userRecord });
  } catch (error) {
    console.error("syncUser error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
