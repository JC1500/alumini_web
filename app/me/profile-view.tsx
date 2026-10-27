"use client";

import { useState } from "react";
import ProfileForm from "./profile-form";
import ProfileImageManager from "@/components/profile/ProfileImageManager";
import ProfilePosts from "@/components/profile/ProfilePosts";

type ProfileViewProfile = {
  fullName: string;
  username: string;
  headline: string;
  bio: string;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  department: string;
  graduationYear: number;
  degree: string | null;
  company: string | null;
  jobTitle: string | null;
  location: string;
  skills: string[];
  country?: string | null;
  state?: string | null;
  district?: string | null;
  city?: string | null;
};

export default function ProfileView({
  profile,
  editable = true,
}: {
  profile: ProfileViewProfile;
  editable?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [profileImageUrl, setProfileImageUrl] = useState(
  profile.profileImageUrl,
);

const [coverImageUrl, setCoverImageUrl] = useState(
  profile.coverImageUrl,
);

  const initial = profile.fullName.trim().charAt(0).toUpperCase();

  if (isEditing && editable) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="mb-5 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to profile
        </button>

        <h1 className="mb-2 text-2xl font-bold">Edit your profile</h1>
        <p className="mb-6 text-sm text-gray-500">
          Keep your alumni information up to date.
        </p>

        <ProfileForm profile={profile} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Profile header */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="relative h-32 overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 sm:h-44">
  {coverImageUrl && (
    <img
      src={coverImageUrl}
      alt={`${profile.fullName}'s cover`}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )}
</div>

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-100 text-4xl font-bold text-blue-800 dark:border-gray-950 dark:bg-blue-950 dark:text-blue-200 sm:size-28">
  {profileImageUrl ? (
    <img
      src={profileImageUrl}
      alt={`${profile.fullName}'s profile photo`}
      className="h-full w-full object-cover"
    />
  ) : (
    initial || "A"
  )}
</div>
            </div>

           {editable && (
  <button
    type="button"
    onClick={() => setIsEditing(true)}
    className="rounded-full border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950"
  >
    Edit profile
  </button>
)}
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {profile.fullName}
            </h1>

            <p className="mt-1 text-gray-600 dark:text-gray-300">
              {profile.headline || "Alumni community member"}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              @{profile.username}
              {profile.location ? ` · ${profile.location}` : ""}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.department && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                {profile.department}
              </span>
            )}

            {profile.graduationYear && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                Class of {profile.graduationYear}
              </span>
            )}

            {profile.degree && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {profile.degree}
              </span>
            )}
          </div>
        </div>
      </section>

      {editable && (
  <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
    <h2 className="mb-4 text-lg font-bold">
      Profile appearance
    </h2>

    <ProfileImageManager
      name={profile.fullName}
      profileImageUrl={profileImageUrl}
      coverImageUrl={coverImageUrl}
      onUpdated={(type, url) => {
        if (type === "avatar") {
          setProfileImageUrl(url);
        } else {
          setCoverImageUrl(url);
        }
      }}
    />
  </section>
)}

      {/* About */}
      {profile.bio && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-7">
          <h2 className="text-xl font-bold">About</h2>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-600 dark:text-gray-300">
            {profile.bio}
          </p>
        </section>
      )}

      <ProfilePosts
  username={profile.username}
  editable={editable}
/>
      {/* Experience */}
      {(profile.company || profile.jobTitle) && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-7">
          <h2 className="text-xl font-bold">Experience</h2>

          <div className="mt-4 flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
              {(profile.company || profile.jobTitle || "W")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              {profile.jobTitle && (
                <h3 className="font-semibold">{profile.jobTitle}</h3>
              )}
              {profile.company && (
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {profile.company}
                </p>
              )}
              {profile.location && (
                <p className="mt-1 text-sm text-gray-500">
                  {profile.location}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-7">
          <h2 className="text-xl font-bold">Skills</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium dark:border-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
