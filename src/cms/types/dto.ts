import { appUserCreateInputSchema, appUserOutputSchema, appUserUpdateInputSchema } from "../schema/app-user";
import { vacancyCreateInputSchema, vacancyOutputSchema, vacancyUpdateInputSchema, vacancyUpsertInputSchema } from "../schema/vacancy";
import { authorCreateInputSchema, authorOutputSchema, authorUpdateInputSchema } from "../schema/author";
import { categoryCreateInputSchema, categoryOutputSchema, categoryUpdateInputSchema } from "../schema/category";
import { postCreateInputSchema, postOutputSchema, postUpdateInputSchema, postUpsertInputSchema } from "../schema/post";
import { submissionCreateInputSchema, submissionOutputSchema, submissionUpdateInputSchema } from "../schema/submission";
import {
  siteSettingsOutputSchema,
  siteSettingsReplaceInputSchema,
  siteSettingsUpdateInputSchema,
} from "../schema/site-settings";

export type PostCreateInput = import("zod").infer<typeof postCreateInputSchema>;
export type PostUpsertInput = import("zod").infer<typeof postUpsertInputSchema>;
export type PostUpdateInput = import("zod").infer<typeof postUpdateInputSchema>;
export type PostOutput = import("zod").infer<typeof postOutputSchema>;

export type AuthorCreateInput = import("zod").infer<typeof authorCreateInputSchema>;
export type AuthorUpdateInput = import("zod").infer<typeof authorUpdateInputSchema>;
export type AuthorOutput = import("zod").infer<typeof authorOutputSchema>;

export type CategoryCreateInput = import("zod").infer<typeof categoryCreateInputSchema>;
export type CategoryUpdateInput = import("zod").infer<typeof categoryUpdateInputSchema>;
export type CategoryOutput = import("zod").infer<typeof categoryOutputSchema>;

export type SubmissionCreateInput = import("zod").infer<typeof submissionCreateInputSchema>;
export type SubmissionUpdateInput = import("zod").infer<typeof submissionUpdateInputSchema>;
export type SubmissionOutput = import("zod").infer<typeof submissionOutputSchema>;

export type AppUserCreateInput = import("zod").infer<typeof appUserCreateInputSchema>;
export type AppUserUpdateInput = import("zod").infer<typeof appUserUpdateInputSchema>;
export type AppUserOutput = import("zod").infer<typeof appUserOutputSchema>;

export type SiteSettingsReplaceInput = import("zod").infer<typeof siteSettingsReplaceInputSchema>;
export type SiteSettingsUpdateInput = import("zod").infer<typeof siteSettingsUpdateInputSchema>;
export type SiteSettingsOutput = import("zod").infer<typeof siteSettingsOutputSchema>;

export type VacancyCreateInput = import("zod").infer<typeof vacancyCreateInputSchema>;
export type VacancyUpsertInput = import("zod").infer<typeof vacancyUpsertInputSchema>;
export type VacancyUpdateInput = import("zod").infer<typeof vacancyUpdateInputSchema>;
export type VacancyOutput = import("zod").infer<typeof vacancyOutputSchema>;
