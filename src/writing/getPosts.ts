import type { WritingPostModule, WritingMeta } from "./types";

export type WritingPost = {
  slug: string;
  meta: WritingMeta;
  Component: (props: unknown) => JSX.Element;
};

const postModules = import.meta.glob("./*.mdx", { eager: true }) as Record<
  string,
  WritingPostModule
>;

function deriveSlug(path: string): string {
  const match = path.match(/\/?([^\/]+)\.mdx$/);
  return match ? match[1] : path;
}

function compareByDateDesc(a: WritingPost, b: WritingPost) {
  return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
}

export function getWritingPosts(): WritingPost[] {
  const posts = Object.entries(postModules).map(([path, mod]) => {
    const slug = deriveSlug(path);
    return {
      slug,
      meta: mod.meta,
      Component: mod.default,
    };
  });

  return posts.sort(compareByDateDesc);
}
