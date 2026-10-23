import Image from "next/image";

/**
 * logo-text.png is a 3264x3264 square asset with the wordmark centred inside it.
 * Rendering it at a wide aspect ratio (the old width=180 height=28) stretched it
 * unreadably, so this always requests a square box and lets the padding inside
 * the asset keep the wordmark proportionate.
 */
export default function Logo({
  size = 40,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/assets/images/logo-text.png"
      alt="PixPerfect"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-xl ${className}`}
    />
  );
}
