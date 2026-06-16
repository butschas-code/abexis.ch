import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import type { BlogTopicStatus } from "@/cms/types/blog-pipeline";
import { adminDb } from "@/lib/firebaseAdmin";
import { generateBlogDraftFromTopic } from "@/lib/blog-pipeline/generate-blog-draft";
import { getOpenAiBlogModel } from "@/lib/blog-pipeline/openai-blog-model";
import { findUnsplashImage } from "@/lib/blogAutomation/findUnsplashImage";
import { sanitizeGeneratedBlogHtmlWithoutLinks, stripCompetitorReferenceLines } from "@/lib/cms/sanitize-blog-html";

export type BlogPipelineRunResult =
  | { status: "skipped"; reason: "no_queued_topics" | "claim_lost" }
  | {
      status: "completed";
      topicId: string;
      draftId: string;
      socialPostId: string;
      openaiResponseId: string;
    }
  | { status: "failed"; topicId: string; error: string };

function readTopicFields(data: DocumentData): {
  title: string;
  brief: string | null;
  status: BlogTopicStatus | string;
} {
  return {
    title: typeof data.title === "string" ? data.title : "",
    brief: typeof data.brief === "string" ? data.brief : null,
    status: typeof data.status === "string" ? data.status : "",
  };
}

async function resolveDefaultBlogAuthorId(): Promise<string> {
  const configured = process.env.BLOG_AUTOMATION_DEFAULT_AUTHOR_ID?.trim();
  if (configured) return configured;

  const snap = await adminDb.collection(COLLECTIONS.authors).limit(200).get();
  const daniel = snap.docs.find((docSnap) => {
    const row = docSnap.data() as Record<string, unknown>;
    return (
      /daniel\s+sengstag/i.test(String(row.name ?? "")) ||
      /daniel[-_\s]?sengstag/i.test(String(row.slug ?? "")) ||
      /daniel\.sengstag/i.test(String(row.email ?? ""))
    );
  });
  return daniel?.id ?? "";
}

/**
 * Picks one `blogTopics` document with status queued, generates draft + social via OpenAI,
 * writes `blogDrafts` + `blogSocialPosts` as needs_review, marks topic completed.
 */
export async function runBlogPipelineOnce(): Promise<BlogPipelineRunResult> {
  const topicsCol = adminDb.collection(COLLECTIONS.blogTopics);
  const queuedSnap = await topicsCol.where("status", "==", "queued").orderBy("createdAt", "asc").limit(1).get();

  if (queuedSnap.empty) {
    return { status: "skipped", reason: "no_queued_topics" };
  }

  const topicDoc = queuedSnap.docs[0];
  const topicId = topicDoc.id;

  try {
    await adminDb.runTransaction(async (tx) => {
      const fresh = await tx.get(topicDoc.ref);
      if (!fresh.exists) {
        throw new Error("Topic disappeared during claim.");
      }
      const { status } = readTopicFields(fresh.data() ?? {});
      if (status !== "queued") {
        throw new Error(`Topic no longer queued (is "${status}").`);
      }
      tx.update(topicDoc.ref, {
        status: "processing",
        updatedAt: FieldValue.serverTimestamp(),
        lastPipelineError: FieldValue.delete(),
      });
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("no longer queued")) {
      return { status: "skipped", reason: "claim_lost" };
    }
    return { status: "failed", topicId, error: msg };
  }

  const topicData = topicDoc.data();
  const { title, brief } = readTopicFields(topicData ?? {});
  if (!title.trim()) {
    const err = "Topic missing non-empty title.";
    await topicDoc.ref.update({
      status: "failed",
      lastPipelineError: err,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return { status: "failed", topicId, error: err };
  }

  try {
    const { output, responseId } = await generateBlogDraftFromTopic({ title, brief });

    let draftHeroFirestore: Record<string, unknown> = {};
    try {
      const hero = await findUnsplashImage({
        imageSearchQueries: output.imageSearchQueries,
        heroImageAlt: output.heroImageAlt,
      });
      if (hero) {
        draftHeroFirestore = {
          heroImageUrl: hero.heroImageUrl,
          heroImageAlt: hero.heroImageAlt,
          heroImageCredit: hero.heroImageCredit,
          heroImagePhotographerName: hero.heroImagePhotographerName,
          heroImagePhotographerUrl: hero.heroImagePhotographerUrl,
          heroImageUnsplashUrl: hero.heroImageUnsplashUrl,
          heroImageDownloadLocation: hero.heroImageDownloadLocation,
          imageSearchQuery: hero.imageSearchQuery,
        };
      }
    } catch {
      /* Hero remains unset if Unsplash fails */
    }

    const draftRef = adminDb.collection(COLLECTIONS.blogDrafts).doc();
    const socialRef = adminDb.collection(COLLECTIONS.blogSocialPosts).doc();
    const defaultAuthorId = await resolveDefaultBlogAuthorId();

    const batch = adminDb.batch();

    batch.set(draftRef, {
      topicId,
      status: "needs_review",
      title: output.title,
      slug: output.slug,
      excerpt: output.excerpt,
      metaTitle: output.metaTitle,
      metaDescription: output.metaDescription,
      articleHtml: sanitizeGeneratedBlogHtmlWithoutLinks(output.articleHtml),
      researchSummary: output.researchSummary,
      sources: [],
      ...(defaultAuthorId ? { authorId: defaultAuthorId } : {}),
      openaiResponseId: responseId,
      pipelineModel: getOpenAiBlogModel(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      ...draftHeroFirestore,
    });

    batch.set(socialRef, {
      topicId,
      blogDraftId: draftRef.id,
      status: "needs_review",
      linkedinPost: stripCompetitorReferenceLines(output.linkedinPost),
      socialImageUrl: typeof draftHeroFirestore.heroImageUrl === "string" ? draftHeroFirestore.heroImageUrl : null,
      socialImageAlt: typeof draftHeroFirestore.heroImageAlt === "string" ? draftHeroFirestore.heroImageAlt : null,
      openaiResponseId: responseId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    batch.update(topicDoc.ref, {
      status: "completed",
      lastDraftId: draftRef.id,
      lastSocialPostId: socialRef.id,
      lastOpenaiResponseId: responseId,
      updatedAt: FieldValue.serverTimestamp(),
      lastPipelineError: FieldValue.delete(),
    });

    try {
      await batch.commit();
    } catch (commitErr) {
      const msg = commitErr instanceof Error ? commitErr.message : String(commitErr);
      await topicDoc.ref.update({
        status: "failed",
        lastPipelineError: `Firestore commit failed: ${msg}`,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return { status: "failed", topicId, error: msg };
    }

    return {
      status: "completed",
      topicId,
      draftId: draftRef.id,
      socialPostId: socialRef.id,
      openaiResponseId: responseId,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await topicDoc.ref.update({
      status: "failed",
      lastPipelineError: msg,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return { status: "failed", topicId, error: msg };
  }
}
