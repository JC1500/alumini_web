
"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Cropper, { type Area } from "react-easy-crop";
import ConfirmDeleteModal from "../confirm-delete-modal";

type ImageType = "avatar" | "cover";

export type ProfileImageManagerHandle = {
  open: (type: ImageType) => void;
};

type Props = {
  name: string;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  onUpdated: (type: ImageType, url: string | null) => void;
  hideControls?: boolean;
};

async function createCroppedImage(
  imageSrc: string,
  area: Area,
): Promise<File> {
  const image = new Image();
  image.src = imageSrc;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not load image"));
  });

  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Image editor is unavailable");
  }

  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("Could not crop image")),
      "image/webp",
      0.9,
    );
  });

  return new File([blob], "upload.webp", {
    type: "image/webp",
  });
}

const ProfileImageManager = forwardRef<
  ProfileImageManagerHandle,
  Props
>(function ProfileImageManager(
  {
    name,
    profileImageUrl,
    coverImageUrl,
    onUpdated,
    hideControls = false,
  },
  ref,
) {
  const [type, setType] = useState<ImageType>("avatar");
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentImage =
    type === "avatar" ? profileImageUrl : coverImageUrl;

  function openManager(nextType: ImageType) {
    setType(nextType);
    setSource(null);
    setError("");
    setOpen(true);
  }

  useImperativeHandle(
    ref,
    () => ({
      open: openManager,
    }),
    [],
  );

  function chooseFile() {
    fileInput.current?.click();
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPEG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The original image must be 5 MB or smaller.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setSource(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedArea(null);
      setError("");
    };

    reader.readAsDataURL(file);
  }

  async function saveImage() {
    if (!source || !croppedArea) return;

    setBusy(true);
    setError("");

    try {
      const file = await createCroppedImage(source, croppedArea);
      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/profile/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      onUpdated(type, result.url);
      setSource(null);
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed.",
      );
    } finally {
      setBusy(false);
    }
  }

async function deleteImage() {
  if (!currentImage) return;

  setBusy(true);
  setError("");

  try {
    const response = await fetch("/api/profile/image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Could not delete image.");
    }

    onUpdated(type, null);
    setShowDeleteConfirm(false);
    setOpen(false);
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Delete failed.",
    );
  } finally {
    setBusy(false);
  }
}

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleFile}
      />

      {!hideControls && (
        <div className="space-y-6">
          {/* Profile photo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => openManager("avatar")}
              aria-label="Manage profile photo"
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-blue-100 text-3xl font-semibold text-blue-800 ring-1 ring-black/10"
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={`${name}'s profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                name.trim().charAt(0).toUpperCase() || "?"
              )}
              <span className="absolute inset-0 flex items-end justify-center bg-black/0 pb-2 text-xs text-transparent transition hover:bg-black/40 hover:text-white">
                Edit
              </span>
            </button>

            <div>
              <h3 className="font-semibold">Profile photo</h3>
              <p className="text-sm text-gray-500">
                Displayed beside your name.
              </p>
              <button
                type="button"
                onClick={() => openManager("avatar")}
                className="mt-2 text-sm font-medium text-blue-600 hover:underline"
              >
                Manage photo
              </button>
            </div>
          </div>

          {/* Cover image */}
          <div>
            <h3 className="mb-2 font-semibold">Cover image</h3>

            <button
              type="button"
              onClick={() => openManager("cover")}
              aria-label="Manage cover image"
              className="relative block h-36 w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-800"
            >
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt="Profile cover"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-sm text-white">
                Edit cover
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Image management popup */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) {
              setOpen(false);
              setSource(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-dialog-title"
            className="flex relative max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1b1f22] text-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2
                id="image-dialog-title"
                className="text-xl font-semibold"
              >
                {type === "avatar" ? "Profile photo" : "Cover image"}
              </h2>

              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  setSource(null);
                }}
                aria-label="Close"
                className="text-3xl text-gray-300 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </header>

            <div className="overflow-y-auto p-5">
              {source ? (
                <div className="space-y-4">
                  <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-black sm:h-[380px]">
                    <Cropper
                      image={source}
                      crop={crop}
                      zoom={zoom}
                      aspect={type === "avatar" ? 1 : 1600 / 600}
                      cropShape={type === "avatar" ? "round" : "rect"}
                      showGrid
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(_, area) =>
                        setCroppedArea(area)
                      }
                    />
                  </div>

                  <label className="block text-sm text-gray-300">
                    Zoom
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(event) =>
                        setZoom(Number(event.target.value))
                      }
                      className="mt-2 block w-full accent-blue-500"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={chooseFile}
                    disabled={busy}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Choose another image
                  </button>
                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center gap-4">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt="Current image"
                      className={
                        type === "avatar"
                          ? "h-48 w-48 rounded-full object-cover"
                          : "h-40 w-full rounded-xl object-cover"
                      }
                    />
                  ) : (
                    <div
                      className={
                        type === "avatar"
                          ? "flex h-48 w-48 items-center justify-center rounded-full bg-black text-6xl font-semibold"
                          : "flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-r from-slate-800 to-indigo-900 text-gray-300"
                      }
                    >
                      {type === "avatar"
                        ? name.trim().charAt(0).toUpperCase() || "?"
                        : "Default cover"}
                    </div>
                  )}

                  <p className="text-sm text-gray-400">
                    {type === "avatar"
                      ? "Your photo appears on your alumni profile."
                      : "Personalize the banner at the top of your profile."}
                  </p>
                </div>
              )}

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-400">
                  {error}
                </p>
              )}
            </div>

            <footer className="flex flex-wrap items-center gap-3 border-t border-white/10 p-4">
              {!source ? (
                <>
                  <button
                    type="button"
                    onClick={chooseFile}
                    disabled={busy}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
                  >
                    Update
                  </button>

                  {currentImage && (
                    <button
                      type="button"
                      onClick={chooseFile}
                      disabled={busy}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={busy || !currentImage}
                    className="ml-auto rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSource(null)}
                    disabled={busy}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveImage}
                    disabled={busy || !croppedArea}
                    className="ml-auto rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
                  >
                    {busy ? "Saving..." : "Save image"}
                  </button>
                </>
              )}

              {busy && (
                <p className="w-full text-sm text-gray-400">
                  Processing your image. Please wait…
                </p>
              )}
            </footer>

            <ConfirmDeleteModal
  open={showDeleteConfirm}
  title={`Delete ${
    type === "avatar" ? "profile photo" : "cover image"
  }?`}
  description="This image will be permanently deleted. This action cannot be undone."
  loading={busy}
  onCancel={() => setShowDeleteConfirm(false)}
  onConfirm={deleteImage}
/>
          </section>
        </div>
      )}
    </>
  );
});

export default ProfileImageManager;
