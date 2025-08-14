import React from "react";
import { useParams } from "react-router-dom";
import FirstPost from "../../content/writing/first-post.mdx"; // Static import for now

export default function WritingPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const posts: Record<string, React.FC> = {
    "first-post": FirstPost,
  };

  const PostComponent = posts[slug ?? ""];

  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto p-6">
      {PostComponent ? <PostComponent /> : <div>Post not found</div>}
    </div>
  );
}
