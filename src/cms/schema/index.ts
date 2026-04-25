export * from "./common";
export * from "./post";
export * from "./author";
export * from "./category";
export * from "./submission";
export * from "./app-user";
export * from "./site-settings";
export * from "./vacancy";

import { postCreateInputSchema, postUpdateInputSchema, postUpsertInputSchema } from "./post";
import { authorCreateInputSchema, authorUpdateInputSchema } from "./author";
import { categoryCreateInputSchema, categoryUpdateInputSchema } from "./category";
import { submissionCreateInputSchema, submissionUpdateInputSchema } from "./submission";
import { appUserCreateInputSchema, appUserUpdateInputSchema } from "./app-user";
import {
  siteSettingsReplaceInputSchema,
  siteSettingsUpdateInputSchema,
} from "./site-settings";
import { vacancyCreateInputSchema, vacancyUpdateInputSchema, vacancyUpsertInputSchema } from "./vacancy";

export const parsePostCreate = (data: unknown) => postCreateInputSchema.safeParse(data);
export const parsePostUpsert = (data: unknown) => postUpsertInputSchema.safeParse(data);
export const parsePostUpdate = (data: unknown) => postUpdateInputSchema.safeParse(data);

export const parseAuthorCreate = (data: unknown) => authorCreateInputSchema.safeParse(data);
export const parseAuthorUpdate = (data: unknown) => authorUpdateInputSchema.safeParse(data);

export const parseCategoryCreate = (data: unknown) => categoryCreateInputSchema.safeParse(data);
export const parseCategoryUpdate = (data: unknown) => categoryUpdateInputSchema.safeParse(data);

export const parseSubmissionCreate = (data: unknown) => submissionCreateInputSchema.safeParse(data);
export const parseSubmissionUpdate = (data: unknown) => submissionUpdateInputSchema.safeParse(data);

export const parseAppUserCreate = (data: unknown) => appUserCreateInputSchema.safeParse(data);
export const parseAppUserUpdate = (data: unknown) => appUserUpdateInputSchema.safeParse(data);

export const parseSiteSettingsReplace = (data: unknown) => siteSettingsReplaceInputSchema.safeParse(data);
export const parseSiteSettingsUpdate = (data: unknown) => siteSettingsUpdateInputSchema.safeParse(data);

export const parseVacancyCreate = (data: unknown) => vacancyCreateInputSchema.safeParse(data);
export const parseVacancyUpsert = (data: unknown) => vacancyUpsertInputSchema.safeParse(data);
export const parseVacancyUpdate = (data: unknown) => vacancyUpdateInputSchema.safeParse(data);
