import NextImage, { type ImageProps } from "next/image";
import { resolvePublicImageUrl } from "@/lib/images/resolve-public-image-url";

/** Public-site `next/image` wrapper — resolves Firebase Storage fallbacks before load. */
export function PublicImage({ src, ...props }: ImageProps) {
  const resolved =
    typeof src === "string"
      ? resolvePublicImageUrl(src)
      : src;
  return <NextImage src={resolved} {...props} />;
}
