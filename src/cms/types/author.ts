/**
 * `authors/{authorId}` : attributed people on posts.
 */
export type Author = {
  name: string;
  role: string;
  imageUrl: string | null;
  bio: string | null;
  slug?: string;
  email?: string | null;
  authUid?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CmsAuthor = Author;
