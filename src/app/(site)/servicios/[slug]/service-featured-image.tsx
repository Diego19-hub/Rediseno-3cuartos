"use client";

import Image from "next/image";

type ServiceFeaturedImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
};

export function ServiceFeaturedImage({ src, alt, sizes, className }: ServiceFeaturedImageProps) {
  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
  );
}
