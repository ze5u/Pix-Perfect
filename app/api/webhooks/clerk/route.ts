import { clerkClient } from "@clerk/clerk-sdk-node";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

/**
 * Clerk syncs a Mongo document whenever a user signs up, updates or deletes
 * their account. This endpoint verifies the Svix signature first — the payload
 * itself is untrusted input from the internet.
 *
 * NOTE: the route is excluded from clerkMiddleware's matcher (see
 * middleware.ts), because this request is unauthenticated and verifies itself.
 */

// The subset of the Clerk `user.created` / `user.updated` payload we actually
// persist. Svix's `verify()` returns `unknown`, so the shape has to be named
// here rather than inferred.
interface ClerkUserPayload {
  id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  email_addresses?: { email_address?: string }[];
}

/** The Svix envelope: the real user fields sit two levels in, under `data.data`. */
interface SvixEnvelope<T> {
  id: string;
  type: string;
  data: { id: string; data_type: string; data: T };
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not set. Add it to .env.");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();

  let envelope: SvixEnvelope<ClerkUserPayload>;
  try {
    // Svix types this as `unknown` — verification is what makes it safe.
    envelope = new Webhook(WEBHOOK_SECRET).verify(JSON.stringify(payload), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as SvixEnvelope<ClerkUserPayload>;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const user = envelope.data.data;

  // Without an id every branch below would persist a corrupt row, so reject
  // the envelope instead. Returning 200 also stops Clerk retrying it forever.
  if (!user.id) {
    console.error(`Webhook ${envelope.id} (${envelope.type}) has no user id`);
    return NextResponse.json({ message: "OK" });
  }

  switch (envelope.type) {
    case "user.created": {
      const userRecord = await createUser({
        clerkId: user.id,
        email: user.email_addresses?.[0]?.email_address ?? "",
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        photo: user.image_url,
      });

      if (userRecord) {
        await clerkClient.users.updateUserMetadata(user.id, {
          publicMetadata: { userId: userRecord._id },
        });
      }

      return NextResponse.json({ message: "OK", user: userRecord });
    }

    case "user.updated": {
      const updatedUser = await updateUser(user.id, {
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        photo: user.image_url,
      });

      return NextResponse.json({ message: "OK", user: updatedUser });
    }

    case "user.deleted": {
      const deletedUser = await deleteUser(user.id);
      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    default:
      console.log(`Unhandled webhook ${envelope.type} (${envelope.id})`);
      return NextResponse.json({ message: "Ignored" });
  }
}
