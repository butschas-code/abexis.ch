/**
 * Canonical **field names** for Firestore documents (avoid string drift in writes).
 * Values in DB may omit optional fields; readers should default in mappers.
 */
export const POST_DOCUMENT_FIELDS = {
  title: "title",
  slug: "slug",
  excerpt: "excerpt",
  body: "body",
  heroImageUrl: "heroImageUrl",
  heroImageAlt: "heroImageAlt",
  heroImagePath: "heroImagePath",
  /** @deprecated migrate to heroImagePath */
  heroStoragePath: "heroStoragePath",
  authorId: "authorId",
  categoryIds: "categoryIds",
  tags: "tags",
  site: "site",
  status: "status",
  publishedAt: "publishedAt",
  updatedAt: "updatedAt",
  createdAt: "createdAt",
  seoTitle: "seoTitle",
  seoDescription: "seoDescription",
  featured: "featured",
} as const;

export const AUTHOR_DOCUMENT_FIELDS = {
  name: "name",
  role: "role",
  imageUrl: "imageUrl",
  bio: "bio",
  slug: "slug",
  email: "email",
  authUid: "authUid",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export const CATEGORY_DOCUMENT_FIELDS = {
  name: "name",
  slug: "slug",
  site: "site",
  /** @deprecated migrate to site */
  siteScope: "siteScope",
  description: "description",
  sortOrder: "sortOrder",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export const SETTINGS_DOCUMENT_FIELDS = {
  contactBySite: "contactBySite",
  footer: "footer",
  defaultSeo: "defaultSeo",
  seoBySite: "seoBySite",
  socialLinks: "socialLinks",
  switchBarLinks: "switchBarLinks",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export const SUBMISSION_DOCUMENT_FIELDS = {
  type: "type",
  site: "site",
  payload: "payload",
  fileUrls: "fileUrls",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  sourceUrl: "sourceUrl",
  userAgent: "userAgent",
} as const;

export const VACANCY_DOCUMENT_FIELDS = {
  title: "title",
  slug: "slug",
  excerpt: "excerpt",
  sector: "sector",
  location: "location",
  employmentType: "employmentType",
  hook: "hook",
  body: "body",
  files: "files",
  apply: "apply",
  site: "site",
  status: "status",
  publishedAt: "publishedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export const USER_DOCUMENT_FIELDS = {
  uid: "uid",
  email: "email",
  role: "role",
  displayName: "displayName",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;
