"use client";

/**
 * Blog automation UI types + queue row shapes. Persistence goes through {@link ./blog-automation-cms-api-client}.
 */
export type { BlogAutomationFormState } from "@/lib/blogAutomation/editorForm";
export { DEFAULT_BLOG_AUTOMATION_FORM, mapFirestoreRecordToBlogAutomationForm as mapFirestoreToBlogAutomationForm } from "@/lib/blogAutomation/editorForm";

export type { QueuedBlogTopicRow, AddBlogTopicInput } from "@/lib/blogAutomation/blogTopicQueue";
