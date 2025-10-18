import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getWritingPosts } from "../../writing/getPosts";
import type { WritingPost } from "../../writing/getPosts";

export default function WritingPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const posts = useMemo(() => getWritingPosts(), []);
  const post: WritingPost | undefined = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center text-sm text-gray-600">
        Post not found.
      </div>
    );
  }

  return (
    <div className="prose dark:prose-invert mx-auto max-w-3xl p-6">
      <h1>{post.meta.title}</h1>
      <p className="text-sm text-gray-500">
        {new Date(post.meta.date).toLocaleDateString()}
      </p>
      <post.Component />
    </div>
  );
}
