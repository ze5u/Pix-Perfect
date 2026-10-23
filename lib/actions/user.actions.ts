"use server";

import { revalidatePath } from "next/cache";
import { UpdateQuery, Types } from "mongoose";

import { connectToDatabase } from "../database/mongoose";
import User, { type IUser } from "../database/models/user.model";
import { handleError } from "../utils";

// creditBalance is optional on input — the schema defaults it to `startingCredits`
// — so the webhook doesn't have to know the onboarding balance.
export type CreateUserInput = Omit<IUser, "_id" | "createdAt" | "updatedAt" | "creditBalance"> & {
  creditBalance?: number;
};

export async function createUser(user: CreateUserInput): Promise<IUser | null> {
  try {
    await connectToDatabase();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser)) as IUser;
  } catch (error) {
    // A user can sign up twice, or a webhook can fire twice. Treat a duplicate
    // as "already created" rather than an error — the response still needs a
    // 200, and Clerk retries until it gets one.
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      console.warn("createUser: user already exists, skipping");
      const existing = await User.findOne({ clerkId: user.clerkId });
      return existing ? (JSON.parse(JSON.stringify(existing)) as IUser) : null;
    }
    return handleError(error);
  }
}

export async function getUserById(userId: string): Promise<IUser | null> {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });

    // Return null rather than throwing when the row doesn't exist yet.
    // Clerk's webhook is async — the user.created event can arrive several
    // seconds after the first page request, so the row is legitimately absent
    // on a brand-new account's very first request.
    if (!user) return null;

    return JSON.parse(JSON.stringify(user)) as IUser;
  } catch (error) {
    return handleError(error);
  }
}

// syncUserFromClerk is a one-shot fallback when the webhook hasn't synced yet.
// Fetches fresh user data from Clerk and writes it to Mongo.
export async function syncUserFromClerk(clerkId: string): Promise<IUser | null> {
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const user = await client.users.getUser(clerkId);

    const record = await createUser({
      clerkId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress ?? "",
      username: user.username ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      photo: user.imageUrl ?? "",
      creditBalance: 20,
    });

    if (!record) return null;

    await client.users.updateUserMetadata(clerkId, {
      publicMetadata: { userId: record._id },
    });

    return record;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateUser(
  clerkId: string,
  user: UpdateQuery<IUser>
): Promise<IUser | null> {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { $set: user, $currentDate: { updatedAt: true } },
      { new: true }
    );

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser)) as IUser;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteUser(clerkId: string): Promise<IUser | null> {
  try {
    await connectToDatabase();
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      console.warn(`deleteUser: no user found for ${clerkId}`);
      return null;
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? (JSON.parse(JSON.stringify(deletedUser)) as IUser) : null;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Charges `creditFee` credits (a negative number) for one transformation.
 * The compare-and-set below is what makes this safe: it only applies the
 * decrement if the stored balance is still >= the fee, so two rapid transforms
 * cannot overdraw the account into a negative balance.
 */
export async function updateCredits(
  userId: string | Types.ObjectId,
  creditFee: number
): Promise<IUser | null> {
  try {
    await connectToDatabase();

    const updated = await User.findOneAndUpdate(
      {
        _id: userId,
        creditBalance: { $gte: -creditFee },
      },
      { $inc: { creditBalance: creditFee }, $currentDate: { updatedAt: true } },
      { new: true }
    );

    if (!updated) {
      throw new Error("Not enough credits to apply this transformation");
    }

    revalidatePath("/");

    return JSON.parse(JSON.stringify(updated)) as IUser;
  } catch (error) {
    return handleError(error);
  }
}
