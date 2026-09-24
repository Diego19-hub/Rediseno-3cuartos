"use client";

import Image, { type ImageLoaderProps } from "next/image";

type ServiceFeaturedImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
};

// WordPress may return absolute URLs from a different host. Keeping the
// loader local to this client component avoids serializing a function from the
// server page while preserving the original URL for the image request.
const wordpressImageLoader = ({ src }: ImageLoaderProps) => src;

export function ServiceFeaturedImage({ src, alt, sizes, className }: ServiceFeaturedImageProps) {
  return (
    <div className={className}>
      <Image
        loader={wordpressImageLoader}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
  );
}
