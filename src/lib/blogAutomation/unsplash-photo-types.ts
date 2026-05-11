/** Subset of Unsplash API photo JSON shared by server fetchers and CMS API responses. */

export type UnsplashPhotoBrief = {
  id: string;
  urls: { thumb: string; small: string; regular: string };
  alt_description: string | null;
  links: { html: string; download_location?: string };
  user: { name: string; links: { html: string } };
};
