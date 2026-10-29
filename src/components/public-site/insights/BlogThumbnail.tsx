import { PublicImage as Image } from "@/components/site/PublicImage";
import { resolveThumbnailUrl } from "@/lib/images/resolve-thumbnail-url";

/**
 * Blog post images are LinkedIn thumbnails with text baked in, in mixed ratios (mostly 3:2, also 1:1,
 * 4:3, 16:9, 1.91:1). Cropping cuts the text off, so the whole image is shown (`object-contain`) in a
 * 3:2 frame; a blurred copy of the same file fills the letterbox (same URL, no extra download).
 */
export function BlogThumbnail({
  src,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const thumbSrc = resolveThumbnailUrl(src);
  return (
    <div className={`relative isolate aspect-[3/2] w-full overflow-hidden bg-[#eef1f7] ${className}`}>
      <Image src={thumbSrc} alt="" aria-hidden fill sizes={sizes} className="scale-110 object-cover opacity-55 blur-2xl" />
      <Image
        src={thumbSrc}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain transition duration-700 group-hover:scale-[1.02]"
      />
    </div>
  );
}
