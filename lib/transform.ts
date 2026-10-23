import { getCldImageUrl } from "next-cloudinary";
import { getImageSize } from "./utils";

/**
 * Single source of truth for a Cloudinary transform URL. Used by the form
 * (to persist the saved result) and by the preview/download components — they
 * used to each build their own, so a change to one silently drifted from the
 * other.
 */
export function transformUrl(
  image: { publicId?: string; width?: number; height?: number } | null,
  type: string,
  config?: Transformations | Record<string, unknown> | null
): string | undefined {
  if (!image?.publicId) return undefined;

  return getCldImageUrl({
    src: image.publicId,
    width: getImageSize(type, image, "width"),
    height: getImageSize(type, image, "height"),
    ...(config as Record<string, unknown> | undefined),
  });
}
