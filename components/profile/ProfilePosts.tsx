
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

type Tab = "posts" | "saved";

export default function ProfilePosts({
  username,
  editable = false,
}: {
  username: string;
  editable?: boolean;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedLoaded, setSavedLoaded] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [savedError, setSavedError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [removingSavedId, setRemovingSavedId] = useState<string | null>(null);

  // Fetch posts belonging to the profile being viewed.
  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        setError("");

        const response = await fetch(
          `/api/posts?username=${encodeURIComponent(username)}`,
          { cache: "no-store" },
        );

        const data: { posts?: Post[]; error?: string } =
          await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load posts.");
        }

        if (!Array.isArray(data.posts)) {
          throw new Error("The server returned an invalid posts response.");
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

      if (editable) {
        setSavedLoaded(false);
      }
    }

    void fetchPosts();

    window.addEventListener("posts-updated", handlePostsUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("posts-updated", handlePostsUpdated);
    };
  }, [username, editable]);

  // Fetch saved posts only when the profile owner opens the Saved Posts tab.
  useEffect(() => {
    if (!editable || activeTab !== "saved" || savedLoaded) {
      return;
    }

    let cancelled = false;

    async function fetchSavedPosts() {
      setSavedLoading(true);
      setSavedError("");

      try {
        const response = await fetch("/api/posts/saved", {
          cache: "no-store",
        });

        const data: { posts?: Post[]; error?: string } =
          await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load saved posts.");
        }

        if (!Array.isArray(data.posts)) {
          throw new Error(
            "The server returned an invalid saved posts response.",
          );
        }

        if (!cancelled) {
          setSavedPosts(data.posts);
          setSavedLoaded(true);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setSavedError(
            err instanceof Error
              ? err.message
              : "Failed to load saved posts.",
          );
        }
      } finally {
        if (!cancelled) {
          setSavedLoading(false);
        }
      }
    }

    void fetchSavedPosts();

    return () => {
      cancelled = true;
    };
  }, [activeTab, editable, savedLoaded]);

  // Delete a post owned by the current profile.
  async function handleDeletePost(postId: string) {
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/posts?id=${encodeURIComponent(postId)}`,
        { method: "DELETE" },
      );

      const data: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post.");
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
    if (!postToDelete || deleting) {
      return;
    }

    setDeleting(true);

    try {
      await handleDeletePost(postToDelete);
    } finally {
      setDeleting(false);
    }
  }

  // Remove a post from the user's saved list without deleting the original.
  async function handleRemoveSavedPost(postId: string) {
    if (removingSavedId !== null) {
      return;
    }

    setRemovingSavedId(postId);
    setSavedError("");

    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(postId)}/favourite`,
        { method: "DELETE" },
      );

      const data: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove saved post.");
      }

      setSavedPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );
    } catch (err: unknown) {
      setSavedError(
        err instanceof Error
          ? err.message
          : "Failed to remove saved post.",
      );
    } finally {
      setRemovingSavedId(null);
    }
  }

  function renderPost(post: Post, isSaved = false) {
    return (
      <article
        key={post.id}
        className="relative rounded-xl border border-gray-200 p-4 dark:border-gray-800"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          {isSaved ? (
            <button
              type="button"
              onClick={() => void handleRemoveSavedPost(post.id)}
              disabled={removingSavedId !== null}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              {removingSavedId === post.id
                ? "Removing..."
                : "Remove saved"}
            </button>
          ) : (
            editable && (
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
            )
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

        {!isSaved && editable && (
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
        )}
      </article>
    );
  }

  const displayedPosts = activeTab === "posts" ? posts : savedPosts;
  const isLoading = activeTab === "posts" ? loading : savedLoading;
  const displayedError = activeTab === "posts" ? error : savedError;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold">
          {activeTab === "posts" ? "Posts" : "Saved Posts"}
        </h2>

        {activeTab === "posts" && editable && (
          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Create post"}
          </button>
        )}
      </div>

      {editable && (
        <div className="mt-5 flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            aria-pressed={activeTab === "posts"}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === "posts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            My Posts
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            aria-pressed={activeTab === "saved"}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === "saved"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Saved Posts
          </button>
        </div>
      )}

      {activeTab === "posts" && editable && showForm && (
        <div className="mt-5">
          <CreatePostForm />
        </div>
      )}

      {activeTab === "posts" && deleteError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {deleteError}
        </p>
      )}

      {isLoading ? (
        <p className="mt-5 text-sm text-gray-500">
          {activeTab === "posts"
            ? "Loading posts..."
            : "Loading saved posts..."}
        </p>
      ) : displayedError ? (
        <div className="mt-5">
          <p role="alert" className="text-sm text-red-600">
            {displayedError}
          </p>

          {activeTab === "saved" && (
            <button
              type="button"
              onClick={() => setSavedLoaded(false)}
              className="mt-2 text-sm font-medium text-blue-600 hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      ) : displayedPosts.length === 0 ? (
        <p className="mt-5 text-sm text-gray-500">
          {activeTab === "posts"
            ? "No posts yet."
            : "You haven't saved any posts yet."}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {displayedPosts.map((post) =>
            renderPost(post, activeTab === "saved"),
          )}
        </div>
      )}
    </section>
  );
}
