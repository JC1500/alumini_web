
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type FeedImage = {
  id: string;
  imageUrl: string;
};

type FeedAuthor = {
  id: string;
  username: string;
  fullName: string;
  profileImageUrl: string | null;
};

type FeedPost = {
  id: string;
  text: string | null;
  createdAt: string;
  author: FeedAuthor;
  images: FeedImage[];
};

type FeedResponse = {
  posts: FeedPost[];
  nextCursor: string | null;
  hasMore: boolean;
};

export default function FeedList() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);

  const loadPosts = useCallback(async (initial = false) => {
    if (loadingRef.current) return;
    if (!initial && !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ limit: "10" });
      const cursor = initial ? null : cursorRef.current;

      if (cursor) {
        params.set("cursor", cursor);
      }

      const response = await fetch(`/api/feed?${params.toString()}`, {
        cache: "no-store",
      });

      const data: FeedResponse | { error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          "error" in data
            ? data.error || "Failed to load feed."
            : "Failed to load feed.",
        );
      }

      const result = data as FeedResponse;

      setPosts((current) => {
        if (initial) return result.posts;

        // Avoid duplicates if a post appears in more than one response.
        const existingIds = new Set(current.map((post) => post.id));
        return [
          ...current,
          ...result.posts.filter((post) => !existingIds.has(post.id)),
        ];
      });

      cursorRef.current = result.nextCursor;
      hasMoreRef.current = result.hasMore;

      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load feed.",
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts(true);
  }, [loadPosts]);

  
useEffect(() => {
  const target = sentinelRef.current;
  if (!target) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (
        entry?.isIntersecting &&
        !loadingRef.current &&
        autoLoadEnabled &&
        hasMoreRef.current
      ) {
        void loadPosts();
      }
    },
    {
      rootMargin: "100px 0px",
    },
  );

  observer.observe(target);

  return () => observer.disconnect();
}, [loadPosts]);


  return (
    <section className="mx-auto w-full max-w-2xl space-y-4">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <Link
              href={`/u/${encodeURIComponent(post.author.username)}`}
              className="shrink-0"
              aria-label={`View ${post.author.fullName}'s profile`}
            >
              {post.author.profileImageUrl ? (
                <img
                  src={post.author.profileImageUrl}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {post.author.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/u/${encodeURIComponent(post.author.username)}`}
                className="block truncate text-sm font-semibold hover:underline"
              >
                {post.author.fullName}
              </Link>

              <p className="truncate text-xs text-gray-500">
                @{post.author.username}
              </p>
            </div>

            <time
              dateTime={post.createdAt}
              className="shrink-0 text-xs text-gray-500"
            >
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>

          {post.text && (
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-gray-800 dark:text-gray-200">
              {post.text}
            </p>
          )}

          {post.images.length > 0 && (
            <div
              className={`mt-3 grid gap-2 ${
                post.images.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-2"
              }`}
            >
              {post.images.map((image) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt="Post attachment"
                  loading="lazy"
                  className="max-h-[500px] w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}
        </article>
      ))}

      {error && (
        <div className="rounded-xl border border-red-200 p-4 text-sm text-red-600 dark:border-red-900">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void loadPosts(posts.length === 0)}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <p className="py-5 text-center text-sm text-gray-500">
          Loading posts...
        </p>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="rounded-2xl border border-gray-200 p-8 text-center dark:border-gray-800">
          <h2 className="font-semibold">Your feed starts here</h2>
          <p className="mt-2 text-sm text-gray-500">
            There are no posts yet. Check back when alumni start sharing.
          </p>
        </div>
      )}

      {!loading && posts.length > 0 && !hasMore && (
        <p className="py-5 text-center text-sm text-gray-500">
          You're all caught up!
        </p>
      )}

      <div ref={sentinelRef} aria-hidden="true" className="h-1" />

      {!loading && hasMore && !error && posts.length > 0 && (
        <button
          type="button"
          onClick={() => void loadPosts()}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
        >
          Load more posts
        </button>
      )}
    </section>
  );
}
