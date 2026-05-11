/** Shared shapes for `blogTopics` queue rows (server + CMS UI). */

export type QueuedBlogTopicRow = {
  id: string;
  title: string;
  targetKeyword: string;
  angle: string;
  notes: string;
  priority: number;
  status: string;
};

export type AddBlogTopicInput = {
  title: string;
  targetKeyword: string;
  angle: string;
  notes: string;
  priority: number;
  audienceFallback: string;
};
