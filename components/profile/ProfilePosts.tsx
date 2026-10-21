"use client";

import { useEffect, useState } from "react";
import CreatePostForm from "@/components/CreatePostForm";
import ConfirmDeleteModal from "../confirm-delete-modal";

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
  const [deleteError, setDeleteError] = useState("");
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        setError("");

        const response = await fetch(
          `/api/posts?username=${encodeURIComponent(username)}`,
          { cache: "no-store" },
        );

        let data: { posts?: Post[]; error?: string };

        try {
          data = await response.json();
        } catch {
          throw new Error(
            `Failed to load posts (HTTP ${response.status}; the server returned an empty or invalid response).`,
          );
        }

        if (!response.ok) {
          throw new Error(
            data.error || `Failed to load posts (HTTP ${response.status}).`,
          );
        }

        if (!Array.isArray(data.posts)) {
          throw new Error("The server returned an invalid posts response.");
        }

        if (!cancelled) setPosts(data.posts);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load posts.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
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
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/posts?id=${encodeURIComponent(postId)}`,
        { method: "DELETE" },
      );

      let data: { error?: string };

      try {
        data = await response.json();
      } catch {
        throw new Error(
          `Failed to delete post (HTTP ${response.status}; the server returned an empty or invalid response).`,
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to delete post (HTTP ${response.status}).`,
        );
      }

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );
      setPostToDelete(null);
      window.dispatchEvent(new Event("posts-updated"));
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete post.",
      );
    }
  }

  async function confirmDeletePost() {
    if (!postToDelete || deleting) return;

    setDeleting(true);
    try {
      await handleDeletePost(postToDelete);
    } finally {
      setDeleting(false);
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
              className="rounded-xl relative border border-gray-200 p-4 dark:border-gray-800"
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
                    onClick={() => {
                      setDeleteError("");
                      setPostToDelete(post.id);
                    }}
                    disabled={deleting}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950"
                    aria-label="Delete post"
                  >
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
              <ConfirmDeleteModal
        open={postToDelete === post.id}
        title="Delete this post?"
        description="This post will be permanently deleted. This action cannot be undone."
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setPostToDelete(null);
            setDeleteError("");
          }
        }}
        onConfirm={confirmDeletePost}
      />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
