"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import type { Query, Types } from "mongoose";

import { connectToDatabase } from "../database/mongoose";
import ImageModel, { type IImage } from "../database/models/image.model";
import User from "../database/models/user.model";
import { cloudinaryFolder } from "@/constants";
import { handleError } from "../utils";

// Works on both `find(...)` (array result) and `findById(...)` (single
// document). `Query<unknown, unknown>` is the widest constraint that accepts
// either, and `populate` returns `this`, so the cast is exact rather than a
// type erasure.
const populateUser = <T extends Query<unknown, unknown>>(
  query: T
): T =>
  query.populate({
    path: "author",
    select: "_id firstName lastName",
    strictPopulate: false,
  }) as T;

// Resolves a user identifier (MongoDB _id or Clerk ID) to a Mongo ObjectId.
// MongoDB ObjectIds are 24 hex characters; Clerk user IDs start with "user_".
// Pages pass user._id (Mongo) and session.userId (Clerk) interchangeably, so
// this handles both. If the user doesn't exist, tries a Clerk sync fallback.
async function getAuthorId(identifier: string): Promise<Types.ObjectId | null> {
  try {
    const isMongoId = /^[0-9a-f]{24}$/i.test(identifier);

    const user = isMongoId
      ? await User.findOne({ _id: identifier }, { _id: 1 })
      : await User.findOne({ clerkId: identifier }, { _id: 1 });

    if (user) return user._id;

    // Only try Clerk sync for actual Clerk IDs (not Mongo ObjectIds).
    if (!isMongoId) {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(identifier);

      const newRecord = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
        username: clerkUser.username ?? "",
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
        photo: clerkUser.imageUrl ?? "",
        creditBalance: 20,
      });

      await client.users.updateUserMetadata(clerkUser.id, {
        publicMetadata: { userId: newRecord._id },
      });

      return newRecord._id;
    }

    return null;
  } catch (error) {
    console.error("getAuthorId failed:", error);
    return null;
  }
}

// ============================================================================
// Image actions — the returned documents are what components render from, so
// all of these return the JSON-serialised form, never a Mongoose document.
// ============================================================================

export async function addImage({
  image,
  userId,
  path,
}: AddImageParams): Promise<IImage | null> {
  try {
    await connectToDatabase();

    const authorId = await getAuthorId(userId);
    if (!authorId) throw new Error("User not found");

    const newImage = await ImageModel.create({
      ...image,
      author: authorId,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage)) as IImage;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateImage({
  image,
  userId,
  path,
}: UpdateImageParams): Promise<IImage | null> {
  try {
    await connectToDatabase();

    const [imageToUpdate, authorId] = await Promise.all([
      ImageModel.findById(image._id),
      getAuthorId(userId),
    ]);

    if (!imageToUpdate) throw new Error("Image not found");
    if (!authorId) throw new Error("User not found");

    // Ownership check — without it anyone with the URL can rewrite any image.
    if (String(imageToUpdate.author) !== String(authorId)) {
      throw new Error("Unauthorized: you are not the author of this image");
    }

    const updatedImage = await ImageModel.findByIdAndUpdate(
      imageToUpdate._id,
      { ...image, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedImage) throw new Error("Image update failed");

    revalidatePath(path);
    revalidatePath("/");

    return JSON.parse(JSON.stringify(updatedImage)) as IImage;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteImage(imageId: string, userId: string): Promise<boolean> {
  try {
    await connectToDatabase();

    const [image, authorId] = await Promise.all([
      ImageModel.findById(imageId),
      getAuthorId(userId),
    ]);
    if (!image) throw new Error("Image not found");
    if (!authorId) throw new Error("User not found");

    // Same ownership gate as updateImage.
    if (String(image.author) !== String(authorId)) {
      throw new Error("Unauthorized: you are not the author of this image");
    }

    await ImageModel.findByIdAndDelete(imageId);

    revalidatePath("/");
    return true;
  } catch (error) {
    return handleError(error);
  }
}

export async function getImageById(imageId: string): Promise<IImage | null> {
  try {
    await connectToDatabase();

    const image = await populateUser(ImageModel.findById(imageId));

    if (!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image)) as IImage;
  } catch (error) {
    return handleError(error);
  }
}

export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}): Promise<{ data: IImage[]; totalPage: number; savedImages: number }> {
  try {
    await connectToDatabase();

    let query: Record<string, unknown> = {};

    if (searchQuery.trim()) {
      // Scope to the pixperfect folder and match the query against the public
      // ID. Cloudinary search returns resources; the DB then filters to rows
      // that actually exist.
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });

      const expression = `folder="${cloudinaryFolder}" AND public_id="${searchQuery.trim()}"`;
      const { resources } = await cloudinary.search.expression(expression).execute();

      if (resources.length === 0) {
        return { data: [], totalPage: 0, savedImages: 0 };
      }

      query = {
        publicId: { $in: resources.map((r: { public_id?: string }) => r.public_id) },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const [images, totalImages, savedImages] = await Promise.all([
      populateUser(
        ImageModel.find(query).sort({ updatedAt: -1 }).skip(skipAmount).limit(limit)
      ),
      ImageModel.find(query).countDocuments(),
      ImageModel.countDocuments(),
    ]);

    return {
      data: JSON.parse(JSON.stringify(images)) as IImage[],
      totalPage: Math.max(Math.ceil(totalImages / limit), 1),
      savedImages,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}): Promise<{ data: IImage[]; totalPages: number }> {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const [images, totalImages] = await Promise.all([
      populateUser(
        ImageModel.find({ author: userId })
          .sort({ updatedAt: -1 })
          .skip(skipAmount)
          .limit(limit)
      ),
      ImageModel.find({ author: userId }).countDocuments(),
    ]);

    return {
      data: JSON.parse(JSON.stringify(images)) as IImage[],
      totalPages: Math.max(Math.ceil(totalImages / limit), 1),
    };
  } catch (error) {
    return handleError(error);
  }
}
