"use client";

import { CldImage } from "next-cloudinary";
import type { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useState } from "react";

import { transformUrl } from "@/lib/transform";
import { dataUrl, download, getImageSize } from "@/lib/utils";

const TransformedImage = ({
  image,
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false,
}: TransformedImageProps) => {
  // A transform request can hang indefinitely. Cap it so the user always gets
  // back control even if the transformed image never finishes loading.
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isTransforming) return;
    const id = setTimeout(() => {
      setTimedOut(true);
      setIsTransforming?.(false);
    }, 120_000);
    return () => clearTimeout(id);
  }, [isTransforming, setIsTransforming]);

  useEffect(() => {
    setTimedOut(false);
  }, [type]);

  const handleDownload = () => {
    const url = transformUrl(image, type, transformationConfig);
    if (!url) return;
    download(url, title || "pixperfect-image");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-ink-950">Transformed</h3>
        {hasDownload && !timedOut && (
          <button
            type="button"
            onClick={handleDownload}
            className="download-btn"
            aria-label="Download transformed image"
          >
            <Image src="/assets/icons/download.svg" alt="" width={20} height={20} />
            <span className="p-14-medium font-semibold">Download</span>
          </button>
        )}
      </div>

      {image?.publicId ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image.publicId}
            alt={title || "Transformed image"}
            sizes="(max-width: 767px) 100vw, 50vw"
            placeholder={dataUrl as PlaceholderValue}
            loading="lazy"
            className="transformed-image"
            onLoad={() => setIsTransforming?.(false)}
            onError={() => setIsTransforming?.(false)}
            {...(transformationConfig as Record<string, unknown> | undefined)}
          />

          {isTransforming && (
            <div className="transforming-loader flex-col items-center justify-center gap-3 p-6">
              <div className="w-full max-w-60 overflow-hidden rounded-full border border-white/40 p-1">
                {/* A bar that breathes, not a spinner. The shape matches the
                    strip it sits inside, so the wait has a layout rather than a
                    rotating glyph. */}
                <div className="h-2 w-full animate-breathe rounded-full bg-white" />
              </div>
              <p className="p-14-medium text-white/85">Transforming…</p>
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">
          <Image
            src="/assets/icons/image.svg"
            alt=""
            width={28}
            height={28}
            className="opacity-40"
          />
          <p className="p-16-medium text-ink-500">
            {timedOut ? "Transform failed — try again" : "Transformed image"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransformedImage;
