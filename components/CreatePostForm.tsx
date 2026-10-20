
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UploadedImage = {
  imageUrl: string;
  imageKey: string;
};

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CreatePostForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleImageSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    setError("");
    setSuccess(false);

    const remaining = MAX_IMAGES - images.length;

    if (files.length > remaining) {
      setError(`You can attach up to ${MAX_IMAGES} images.`);
      return;
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, and WebP images are allowed.");
        return;
      }

      if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        setError("Each image must be smaller than 5 MB.");
        return;
      }
    }

    const selected = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...selected]);
  }

  function removeImage(id: string) {
    setImages((current) => {
      const selected = current.find((image) => image.id === id);

      if (selected) {
        URL.revokeObjectURL(selected.previewUrl);
      }

      return current.filter((image) => image.id !== id);
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText && images.length === 0) {
      setError("Write something or attach at least one image.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let uploadedImages: UploadedImage[] = [];

      // 1. Upload images to Cloudflare R2.
      if (images.length > 0) {
        const formData = new FormData();

        images.forEach(({ file }) => {
          formData.append("images", file);
        });

        const uploadResponse = await fetch("/api/posts/images", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.error || "Failed to upload images.",
          );
        }

        uploadedImages = uploadData.images;
      }

      // 2. Save the post and its image records.
      const postResponse = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmedText,
          images: uploadedImages,
        }),
      });

      const postData = await postResponse.json();

      if (!postResponse.ok) {
        throw new Error(postData.error || "Failed to publish post.");
      }

      // 3. Clear previews and reset the form.
      images.forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl);
      });

      setImages([]);
      setText("");
      setSuccess(true);

      // Notify the profile page to refresh its displayed posts.
      router.refresh();
      window.dispatchEvent(new Event("posts-updated"));
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950"
    >
      <label
        htmlFor="post-text"
        className="block text-lg font-semibold text-gray-900 dark:text-white"
      >
        Create a post
      </label>

      <textarea
        id="post-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Share something with your alumni community..."
        rows={5}
        maxLength={5000}
        disabled={loading}
        className="w-full resize-y rounded-xl border border-gray-200 bg-transparent p-4 text-sm outline-none transition focus:border-blue-500 dark:border-gray-700 dark:text-white"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.previewUrl}
                alt={image.file.name}
                className="h-36 w-full rounded-xl object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(image.id)}
                disabled={loading}
                aria-label={`Remove ${image.file.name}`}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-500">
            {text.length}/5000
          </span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || images.length >= MAX_IMAGES}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            Add images ({images.length}/{MAX_IMAGES})
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={handleImageSelection}
          />
        </div>

        <button
          type="submit"
          disabled={loading || (!text.trim() && images.length === 0)}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Post"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600">
          Your post was published successfully.
        </p>
      )}
    </form>
  );
}
