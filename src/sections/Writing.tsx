import React, { useEffect, useMemo, useState } from "react";
import { getWritingPosts } from "../writing/getPosts";
import type { WritingPost } from "../writing/getPosts";

type WritingProps = {
  initialSlug?: string;
};

export default function Writing({ initialSlug }: WritingProps) {
  const posts = useMemo(() => getWritingPosts(), []);
  const firstSlug = posts.length > 0 ? posts[0].slug : null;
  const initialSelected =
    initialSlug && posts.some((post) => post.slug === initialSlug) ? initialSlug : firstSlug;

  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSelected);

  useEffect(() => {
    if (!initialSlug) return;
    if (!posts.some((post) => post.slug === initialSlug)) return;
    setSelectedSlug((current) => (current === initialSlug ? current : initialSlug));
  }, [initialSlug, posts]);

  const selectedPost = useMemo<WritingPost | undefined>(
    () => posts.find((post) => post.slug === selectedSlug),
    [posts, selectedSlug],
  );

  const formatDate = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [],
  );

  if (posts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-600">
        Writing coming soon — check back later!
      </div>
    );
  }

  return (
    <section className="flex h-full min-h-[320px] flex-col gap-4 md:flex-row md:gap-6 md:overflow-hidden">
      <aside className="rounded-md border border-white/20 bg-white/40 px-3 py-3 text-sm shadow-sm backdrop-blur-sm md:h-full md:w-64 md:flex-shrink-0 md:overflow-y-auto md:px-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
          Writing
        </h2>
        <ul className="mt-3 space-y-2">
          {posts.map((post) => {
            const isActive = post.slug === selectedSlug;
            return (
              <li key={post.slug}>
                <button
                  type="button"
                  onClick={() => setSelectedSlug(post.slug)}
                  className={`w-full rounded-md px-3 py-2 text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm"
                      : "bg-transparent text-gray-800 hover:bg-white/60"
                  }`}
                >
                  <div className="text-[13px] font-semibold leading-tight">
                    {post.meta.title}
                  </div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wide text-gray-500">
                    {formatDate.format(new Date(post.meta.date))}
                  </div>
                  {post.meta.description ? (
                    <p className="mt-1 text-[12px] text-gray-600 line-clamp-2">
                      {post.meta.description}
                    </p>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="md:flex-1 md:overflow-hidden">
        {selectedPost ? (
          <article className="h-full overflow-y-auto rounded-md border border-white/20 bg-white/60 p-4 shadow-sm backdrop-blur-sm md:p-6">
            <header className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                {selectedPost.meta.title}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {formatDate.format(new Date(selectedPost.meta.date))}
                {selectedPost.meta.tags && selectedPost.meta.tags.length > 0 ? (
                  <span className="ml-2 text-xs uppercase tracking-wide text-gray-500">
                    {selectedPost.meta.tags.join(" • ")}
                  </span>
                ) : null}
              </p>
              {selectedPost.meta.description ? (
                <p className="mt-2 text-sm text-gray-700">
                  {selectedPost.meta.description}
                </p>
              ) : null}
            </header>
            <div className="writing-content prose prose-sm max-w-none prose-headings:font-semibold prose-p:text-gray-800 prose-a:text-sky-600">
              <selectedPost.Component />
            </div>
          </article>
        ) : (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-white/20 bg-white/40 text-sm text-gray-600">
            Select a post to read.
          </div>
        )}
      </div>
    </section>
  );
}
