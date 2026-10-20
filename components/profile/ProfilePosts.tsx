
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
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

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
            err instanceof Error ? err.message : "Failed to load posts.",
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

    void fetchPosts();

    window.addEventListener("posts-updated", handlePostsUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("posts-updated", handlePostsUpdated);
    };
  }, [username]);

  async function handleDeletePost(postId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone.",
    );

    if (!confirmed) return;

    setDeletingPostId(postId);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/posts?id=${encodeURIComponent(postId)}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post.");
      }

      // Remove the deleted post immediately from the UI.
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );

      // Notify any other components that the posts have changed.
      window.dispatchEvent(new Event("posts-updated"));
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete post.",
      );
    } finally {
      setDeletingPostId(null);
    }
  }

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

      {deleteError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {deleteError}
        </p>
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
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                {editable && (
                  <button
                    type="button"
                    onClick={() => void handleDeletePost(post.id)}
                    disabled={deletingPostId !== null}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950"
                    aria-label="Delete post"
                  >
                    {deletingPostId === post.id ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"
                          />
                        </svg>
                        Delete
                      </>
                    )}
                  </button>
                )}
              </div>

              {post.text && (
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-800 dark:text-gray-200">
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
