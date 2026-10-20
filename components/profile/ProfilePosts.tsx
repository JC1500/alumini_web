
"use client";

import { useEffect, useState } from "react";
import CreatePostForm from "@/components/CreatePostForm";

type PostImage = {
  id: string;
  imageUrl: string;
};

type Post = {
  id: string;
  text: string | null;
  createdAt: string;
  images: PostImage[];
};

export default function ProfilePosts({
  username,
  editable = false,
}: {
  username: string;
  editable?: boolean;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        setError("");

        const response = await fetch(
          `/api/posts?username=${encodeURIComponent(username)}`,
          { cache: "no-store" },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load posts.");
        }

        if (!cancelled) {
          setPosts(data.posts);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load posts.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    function handlePostsUpdated() {
      void fetchPosts();
    }

    // Load posts when the component mounts.
    void fetchPosts();

    // Reload posts whenever a new post is published.
    window.addEventListener("posts-updated", handlePostsUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener(
        "posts-updated",
        handlePostsUpdated,
      );
    };
  }, [username]);


  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Posts</h2>

        {editable && (
          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Create post"}
          </button>
        )}
      </div>

      {editable && showForm && (
        <div className="mt-5">
          <CreatePostForm />
        </div>
      )}

      {loading ? (
        <p className="mt-5 text-sm text-gray-500">Loading posts...</p>
      ) : error ? (
        <p role="alert" className="mt-5 text-sm text-red-600">
          {error}
        </p>
      ) : posts.length === 0 ? (
        <p className="mt-5 text-sm text-gray-500">No posts yet.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
            >
              {post.text && (
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-800 dark:text-gray-200">
                  {post.text}
                </p>
              )}

              {post.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {post.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.imageUrl}
                      alt="Post attachment"
                      loading="lazy"
                      className="max-h-72 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              <p className="mt-3 text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
