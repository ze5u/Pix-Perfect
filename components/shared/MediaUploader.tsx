"use client";

import { toast } from "sonner";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import type { CldUploadWidgetPropsChildren } from "next-cloudinary";
import type { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import { useCallback, useRef } from "react";

import { dataUrl, getImageSize } from "@/lib/utils";

// The Cloudinary widget returns `info` as `string | { ... }` — the string
// branch is a batch id, which never carries the fields we need.
type UploadSuccess = {
  info?:
    | string
    | {
        public_id?: string;
        secure_url?: string;
        width?: number;
        height?: number;
      };
};

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<React.SetStateAction<DraftImage | null>>;
  publicId: string;
  image: DraftImage | null;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  // CldUploadWidget has no controlled `open` prop — only the instance it
  // hands to its children can open it. The "Replace" button sits outside that
  // render prop, so hold onto the widget and open it from there.
  const widgetRef = useRef<CldUploadWidgetPropsChildren["widget"] | null>(null);

  const onUploadSuccessHandler = useCallback(
    (result: UploadSuccess) => {
      const info = result.info;
      if (!info || typeof info === "string") return;

      setImage((prevState: DraftImage | null) => ({
        ...prevState,
        publicId: info.public_id,
        width: info.width,
        height: info.height,
        secureURL: info.secure_url,
      }));
      onValueChange(info.public_id ?? "");
      toast.success("Image uploaded successfully", { duration: 4000 });
    },
    [setImage, onValueChange]
  );

  const onUploadErrorHandler = useCallback(() => {
    toast.error("Something went wrong while uploading", {
      description: "Please try again",
      duration: 5000,
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-ink-950">Original</h3>
        {publicId && (
          <button
            type="button"
            onClick={() => widgetRef.current?.open()}
            className="pill-ghost transition-transform duration-300 ease-fluid active:scale-[0.97]"
          >
            Replace
          </button>
        )}
      </div>

      <CldUploadWidget
        uploadPreset={
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "team_pixperfect"
        }
        options={{ multiple: false, resourceType: "image", folder: "pixperfect" }}
        onSuccess={onUploadSuccessHandler}
        onError={onUploadErrorHandler}
      >
        {({ open: widgetOpen, widget }) => {
          widgetRef.current = widget;

          return publicId ? (
            <div
              className="cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => widgetOpen()}
            >
              <CldImage
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt="Original image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                loading="lazy"
                className="media-uploader_cldImage"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => widgetOpen()}
              className="media-uploader_cta"
            >
              <div className="media-uploader_cta-image">
                <svg
                  className="size-6 text-ink-950"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="p-16-medium font-semibold text-ink-950">
                Upload an image
              </span>
              <span className="p-14-medium text-ink-500">PNG, JPG or WEBP</span>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default MediaUploader;
