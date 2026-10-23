import { Schema, model, models, type Types } from "mongoose";

/**
 * Plain-object shape of an image document. Server actions return
 * `JSON.parse(JSON.stringify(doc))`, which is not a Mongoose `Document`, so
 * this interface is what components actually receive. It deliberately does not
 * extend `Document`.
 */
export interface IImage {
  _id: Types.ObjectId | string;
  title: string;
  transformationType: TransformationTypeKey;
  publicId: string;
  secureURL: string;
  width?: number;
  height?: number;
  config?: Record<string, unknown>;
  transformationURL?: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author?: {
    _id: Types.ObjectId | string;
    firstName?: string;
    lastName?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    transformationType: { type: String, required: true },
    publicId: { type: String, required: true },
    secureURL: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    config: { type: Object },
    // Optional: an image saved before any transformation was applied has none.
    transformationURL: { type: String },
    aspectRatio: { type: String },
    color: { type: String },
    prompt: { type: String },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Powers the "my images" list on the homepage.
ImageSchema.index({ author: 1, updatedAt: -1 });

const Image = models?.Image || model("Image", ImageSchema);

export default Image;
