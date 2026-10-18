
"use client";

import { useActionState } from "react";
import { saveProfile } from "@/app/actions/profile";

type ProfileActionState = {
  success?: boolean;
  error?: string;
};

type AlumniProfile = {
  fullName: string;
  username: string;
  headline: string | null;
  bio: string | null;
  department: string | null;
  graduationYear: number | null;
  company: string | null;
  jobTitle: string | null;
  location: string | null;
  skills: string[];
};

type ProfileFormProps = {
  profile: AlumniProfile | null;
};

export default function ProfileForm({
  profile,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState<
    ProfileActionState,
    FormData
  >(saveProfile, {});

  const fields = [
    {
      name: "fullName",
      label: "Full name",
      value: profile?.fullName ?? "",
      required: true,
      placeholder: "Your full name",
    },
    {
      name: "username",
      label: "Username",
      value: profile?.username ?? "",
      required: true,
      placeholder: "e.g. mayank_joshi",
    },
    {
      name: "headline",
      label: "Professional headline",
      value: profile?.headline ?? "",
      placeholder: "e.g. Software Developer",
    },
    {
      name: "department",
      label: "Department",
      value: profile?.department ?? "",
      placeholder: "e.g. Computer Science",
    },
    {
      name: "graduationYear",
      label: "Graduation year",
      value: profile?.graduationYear?.toString() ?? "",
      placeholder: "e.g. 2028",
      type: "number",
    },
    {
      name: "company",
      label: "Company",
      value: profile?.company ?? "",
      placeholder: "Your current company",
    },
    {
      name: "jobTitle",
      label: "Job title",
      value: profile?.jobTitle ?? "",
      placeholder: "Your current role",
    },
    {
      name: "location",
      label: "Location",
      value: profile?.location ?? "",
      placeholder: "e.g. Bengaluru, India",
    },
    {
      name: "skills",
      label: "Skills",
      value: profile?.skills.join(", ") ?? "",
      placeholder: "React, Python, Machine Learning",
    },
  ];

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium"
            >
              {field.label}
              {"required" in field && field.required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </label>

            <input
              id={field.name}
              name={field.name}
              type={"type" in field ? field.type : "text"}
              required={"required" in field ? field.required : false}
              defaultValue={field.value}
              placeholder={field.placeholder}
              min={field.name === "graduationYear" ? 1950 : undefined}
              max={field.name === "graduationYear" ? 2100 : undefined}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="block text-sm font-medium"
        >
          About you
        </label>

        <textarea
          id="bio"
          name="bio"
          rows={5}
          maxLength={2000}
          defaultValue={profile?.bio ?? ""}
          placeholder="Tell your alumni community about yourself..."
          className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      {state.success && (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          Your profile has been saved successfully!
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {pending
          ? "Saving profile..."
          : profile
            ? "Update profile"
            : "Create profile"}
      </button>
    </form>
  );
}
