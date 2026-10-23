"use client";

import { DownloadSimple, PencilSimple, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { Button } from "@/components/ui/button";
import type { IImage } from "@/lib/database/models/image.model";
import { transformUrl } from "@/lib/transform";

const FORMATS = [
  { key: "png", label: "PNG", mime: "image/png" },
  { key: "jpeg", label: "JPEG", mime: "image/jpeg" },
  { key: "webp", label: "WEBP", mime: "image/webp" },
];

/**
 * Presentational: the server page has already fetched the image and verified
 * ownership, so no auth hook is needed here — which also removes the
 * useSearchParams/Suspense coupling.
 */
export default function ImageDetailsClient({
  image,
  isOwner,
}: {
  image: IImage;
  isOwner: boolean;
}) {
  const [busy, setBusy] = useState(false);

  const url = transformUrl(image, image.transformationType, image.config);

  const handleDownload = async (mime: string, ext: string) => {
    if (!url) {
      toast.error("No image available to download");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      const blob = await response.blob();

      if (blob.type === mime) {
        // Already the requested format — no canvas round-trip needed.
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = `${image.title || "pixperfect-image"}.${ext}`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        return;
      }

      // Convert through a canvas. Cloudinary sends CORS headers, so this is
      // not tainted.
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
      bitmap.close();

      const converted = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (out) => (out ? resolve(out) : reject(new Error("Conversion failed"))),
          mime,
          0.92
        );
      });

      const objectUrl = URL.createObjectURL(converted);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${image.title || "pixperfect-image"}.${ext}`;
      a.click();
      URL.revokeObjectURL(objectUrl);

      toast.success("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title={image.title}
        subtitle={
          image.prompt
            ? `${image.transformationType}: ${image.prompt}`
            : image.transformationType
        }
      />

      <div className="rounded-3xl border border-ink-950 bg-paper p-5 md:p-6">
        <TransformedImage
          image={image}
          type={image.transformationType}
          title={image.title}
          transformationConfig={image.config as Transformations}
          isTransforming={false}
          hasDownload
        />
      </div>

      <section className="space-y-4">
        <h3 className="p-16-semibold text-ink-950">Download as</h3>
        <div className="flex flex-wrap gap-3">
          {FORMATS.map((f) => (
            <Button
              key={f.key}
              className="ghost-button"
              disabled={busy || !url}
              onClick={() => handleDownload(f.mime, f.key)}
            >
              <DownloadSimple size={16} weight="bold" />
              {f.label}
            </Button>
          ))}
        </div>
        {!url && (
          <p className="flex items-center gap-2 p-14-medium text-ember">
            <WarningCircle size={16} weight="bold" />
            No transform has been applied to this image yet.
          </p>
        )}
      </section>

      {isOwner && (
        <Link
          href={`/transformations/${image._id}/update`}
          className="inline-flex items-center gap-2 p-16-semibold font-semibold text-electric-700"
        >
          <PencilSimple size={16} weight="bold" />
          Edit this transform
        </Link>
      )}
    </div>
  );
}
