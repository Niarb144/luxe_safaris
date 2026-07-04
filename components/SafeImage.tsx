"use client";

import { useState } from "react";

interface SafeImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> {
  src: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/img4.jpg";

/**
 * Drop-in replacement for <img> that falls back to a local placeholder
 * on load error. Exists as a Client Component because Server Components
 * cannot pass event handlers (onError) to DOM elements.
 */
export default function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  ...rest
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      {...rest}
      src={imgSrc || fallbackSrc}
      alt={alt || ""}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}