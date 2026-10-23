import { Schema, model, models, type Types } from "mongoose";

/**
 * creditBalance lives here on purpose: with Mongoose `strict: true` (the
 * default) any field set on a document that is not in the schema is stripped
 * before it is written. The previous schema had no creditBalance, so
 * `updateCredits` ran, looked successful, and silently lost every credit.
 */
const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Neither username nor photo are guaranteed at account creation — Clerk can
    // create a user before either exists. `required` here would make the very
    // first webhook call fail and no user row would ever be written.
    username: { type: String, trim: true },
    photo: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    creditBalance: {
      type: Number,
      default: 20,
      min: 0,
    },
  },
  { timestamps: true }
);

const User = models?.User || model("User", UserSchema);

export default User;

export type IUser = {
  _id: Types.ObjectId | string;
  clerkId: string;
  email: string;
  username?: string;
  photo?: string;
  firstName?: string;
  lastName?: string;
  creditBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
};
