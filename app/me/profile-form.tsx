
"use client";

import { useActionState, useState } from "react";
import { saveProfile } from "@/app/actions/profile";
import { locationData } from "@/data/location-data";
import { SKILL_OPTIONS } from "@/data/skills-data";

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
  country?: string | null;
  state?: string | null;
  district?: string | null;
  city?: string | null;
  skills: string[];
};

type AcademicIdentity = {
  degreeCode: string;
  degreeName: string;
  enrollmentYear: number;
  academicDepartmentCode: string;
  rollNumber: string;
  expectedGraduationYear: number;
};

type ProfileFormProps = {
  profile: AlumniProfile | null;
  academicIdentity?: AcademicIdentity;
};

const departments = [
  { value: "CS", label: "Computer Science (CS)" },
  { value: "ME", label: "Mechanical (ME)" },
  { value: "CIV", label: "Civil (CIV)" },
  { value: "EE", label: "Electrical and Electronics (EE)" },
  { value: "EC", label: "Electronics and Communication (EC)" },
] as const;

const currentYear = new Date().getFullYear();

const graduationYears = Array.from(
  { length: currentYear + 4 - 2013 + 1 },
  (_, index) => currentYear + 4 - index,
).sort((a, b) => a - b);

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "block text-sm font-medium";

function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children} <span className="text-red-500">*</span>
    </label>
  );
}

export default function ProfileForm({
  profile,
  academicIdentity,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState<
    ProfileActionState,
    FormData
  >(saveProfile, {});

  const [selectedState, setSelectedState] = useState(
    profile?.state ?? "",
  );

  const [selectedDistrict, setSelectedDistrict] = useState(
    profile?.district ?? "",
  );

  const [selectedCity, setSelectedCity] = useState(
    profile?.city ?? "",
  );

  const [bio, setBio] = useState(profile?.bio ?? "");

  const [skills, setSkills] = useState<string[]>(
    profile?.skills?.slice(0, 5) ?? [],
  );

  const [skillQuery, setSkillQuery] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] =
    useState(false);

  const states = Object.keys(locationData).sort();

  const districts = selectedState
    ? Object.keys(locationData[selectedState] ?? {}).sort()
    : [];

  const cities =
    selectedState && selectedDistrict
      ? locationData[selectedState]?.[selectedDistrict] ?? []
      : [];

  const filteredSkills = SKILL_OPTIONS.filter(
    (skill) =>
      skill.toLowerCase().includes(skillQuery.trim().toLowerCase()) &&
      !skills.some(
        (selected) =>
          selected.toLowerCase() === skill.toLowerCase(),
      ),
  ).slice(0, 8);

  function addSkill(skill: string) {
    const value = skill.trim();

    if (
      !value ||
      skills.length >= 5 ||
      skills.some(
        (selected) =>
          selected.toLowerCase() === value.toLowerCase(),
      )
    ) {
      return;
    }

    setSkills((previous) => [...previous, value]);
    setSkillQuery("");
    setShowSkillSuggestions(false);
  }

  return (
    <form action={formAction} className="mt-8 space-y-10">
      {/* Verified academic identity */}
      {academicIdentity && (
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">
              Verified academic details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These details come from your verified college email and
              cannot be edited here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="degreeName" className={labelClass}>
                Degree / Course
              </label>
              <input
                id="degreeName"
                value={`${academicIdentity.degreeName} (${academicIdentity.degreeCode})`}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="enrollmentYear" className={labelClass}>
                Enrollment batch
              </label>
              <input
                id="enrollmentYear"
                value={academicIdentity.enrollmentYear}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="academicDepartmentCode"
                className={labelClass}
              >
                Department code
              </label>
              <input
                id="academicDepartmentCode"
                value={academicIdentity.academicDepartmentCode}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rollNumber" className={labelClass}>
                Roll number
              </label>
              <input
                id="rollNumber"
                value={academicIdentity.rollNumber}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="expectedGraduationYear"
                className={labelClass}
              >
                Expected passing year
              </label>
              <input
                id="expectedGraduationYear"
                value={academicIdentity.expectedGraduationYear}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </div>
          </div>
        </section>
      )}

      {/* Basic information */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">
            Personal information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell the alumni community who you are.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <RequiredLabel htmlFor="fullName">Full name</RequiredLabel>
            <input
              id="fullName"
              name="fullName"
              required
              autoComplete="name"
              maxLength={100}
              defaultValue={profile?.fullName ?? ""}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="username">Username</RequiredLabel>
            <input
              id="username"
              name="username"
              required
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_]+"
              title="Use only letters, numbers, and underscores."
              defaultValue={profile?.username ?? ""}
              placeholder="e.g. mayank_joshi"
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">
              3–30 characters; letters, numbers, and underscores.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <RequiredLabel htmlFor="headline">
              Professional headline
            </RequiredLabel>
            <input
              id="headline"
              name="headline"
              required
              maxLength={120}
              defaultValue={profile?.headline ?? ""}
              placeholder="e.g. Software Engineer | AI/ML Enthusiast"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="department">
              Department
            </RequiredLabel>

            {academicIdentity ? (
              <>
                <input
                  id="department"
                  value={academicIdentity.academicDepartmentCode}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-70`}
                />
                <input
                  type="hidden"
                  name="department"
                  value={academicIdentity.academicDepartmentCode}
                />
              </>
            ) : (
              <select
                id="department"
                name="department"
                required
                defaultValue={profile?.department ?? ""}
                className={inputClass}
              >
                <option value="" disabled>
                  Select your department
                </option>
                {departments.map((department) => (
                  <option
                    key={department.value}
                    value={department.value}
                  >
                    {department.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="graduationYear">
              Graduation year
            </RequiredLabel>

            {academicIdentity ? (
              <>
                <input
                  id="graduationYear"
                  value={academicIdentity.expectedGraduationYear}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-70`}
                />
                <input
                  type="hidden"
                  name="graduationYear"
                  value={academicIdentity.expectedGraduationYear}
                />
              </>
            ) : (
              <select
                id="graduationYear"
                name="graduationYear"
                required
                defaultValue={profile?.graduationYear?.toString() ?? ""}
                className={inputClass}
              >
                <option value="" disabled>
                  Select graduation year
                </option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Location</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select your location from the available options.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <RequiredLabel htmlFor="country">Country</RequiredLabel>
            <input
              id="country"
              name="country"
              value="India"
              readOnly
              aria-readonly="true"
              className={`${inputClass} cursor-not-allowed opacity-70`}
            />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="state">
              State / Union Territory
            </RequiredLabel>
            <select
              id="state"
              name="state"
              required
              value={selectedState}
              onChange={(event) => {
                setSelectedState(event.target.value);
                setSelectedDistrict("");
                setSelectedCity("");
              }}
              className={inputClass}
            >
              <option value="" disabled>
                Select state
              </option>
              {states.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="district">District</RequiredLabel>
            <select
              id="district"
              name="district"
              required
              value={selectedDistrict}
              disabled={!selectedState || districts.length === 0}
              onChange={(event) => {
                setSelectedDistrict(event.target.value);
                setSelectedCity("");
              }}
              className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="" disabled>
                {selectedState ? "Select district" : "Select a state first"}
              </option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor="city">City / Town</RequiredLabel>
            <select
              id="city"
              name="city"
              required
              value={selectedCity}
              disabled={!selectedDistrict || cities.length === 0}
              onChange={(event) => setSelectedCity(event.target.value)}
              className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="" disabled>
                {selectedDistrict ? "Select city" : "Select a district first"}
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Professional details */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Professional details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your work experience and expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="company" className={labelClass}>
              Company <span className="text-muted-foreground">(Optional)</span>
            </label>
            <input
              id="company"
              name="company"
              maxLength={100}
              defaultValue={profile?.company ?? ""}
              placeholder="Your current company"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="jobTitle" className={labelClass}>
              Job title <span className="text-muted-foreground">(Optional)</span>
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              maxLength={100}
              defaultValue={profile?.jobTitle ?? ""}
              placeholder="Your current role"
              className={inputClass}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2 sm:col-span-2">
            <RequiredLabel htmlFor="skills-input">Skills</RequiredLabel>
            <p className="text-xs text-muted-foreground">
              Select at least 1 and up to 5 skills.
            </p>

            <div
              className="relative rounded-xl border border-input bg-background p-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  setShowSkillSuggestions(false);
                }
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-sm font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      aria-label={`Remove ${skill}`}
                      onClick={() =>
                        setSkills((previous) =>
                          previous.filter((item) => item !== skill),
                        )
                      }
                      className="rounded-full text-muted-foreground transition hover:text-red-500"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </span>
                ))}

                {skills.length < 5 && (
                  <input
                    id="skills-input"
                    type="text"
                    value={skillQuery}
                    autoComplete="off"
                    placeholder={
                      skills.length === 0
                        ? "Type a skill..."
                        : "Add another skill..."
                    }
                    onFocus={() => setShowSkillSuggestions(true)}
                    onChange={(event) => {
                      setSkillQuery(event.target.value);
                      setShowSkillSuggestions(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        if (filteredSkills.length > 0) {
                          addSkill(filteredSkills[0]);
                        } else if (skillQuery.trim()) {
                          addSkill(skillQuery);
                        }
                      }

                      if (event.key === "Escape") {
                        setShowSkillSuggestions(false);
                      }

                      if (
                        event.key === "Backspace" &&
                        !skillQuery &&
                        skills.length > 0
                      ) {
                        setSkills((previous) => previous.slice(0, -1));
                      }
                    }}
                    className="min-w-32 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
                  />
                )}

                {skills.length >= 5 && (
                  <span className="px-2 py-2 text-xs text-muted-foreground">
                    Maximum reached
                  </span>
                )}
              </div>

              {showSkillSuggestions &&
                skills.length < 5 &&
                skillQuery.trim() &&
                filteredSkills.length > 0 && (
                  <div
                    className="absolute left-0 right-0 top-full z-50 mt-2 max-h-56 overflow-y-auto rounded-xl border border-border bg-background p-1 shadow-lg"
                    role="listbox"
                    aria-label="Skill suggestions"
                  >
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        role="option"
                        aria-selected={false}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => addSkill(skill)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-muted"
                      >
                        <span>{skill}</span>
                        <span className="text-muted-foreground">+</span>
                      </button>
                    ))}
                  </div>
                )}

              {showSkillSuggestions &&
                skills.length < 5 &&
                skillQuery.trim() &&
                filteredSkills.length === 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-background p-3 text-sm shadow-lg">
                    <p className="text-muted-foreground">
                      No matching suggestions.
                    </p>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => addSkill(skillQuery)}
                      className="mt-2 font-medium text-primary hover:underline"
                    >
                      Add &quot;{skillQuery.trim()}&quot; as a custom skill
                    </button>
                  </div>
                )}
            </div>

            {skills.map((skill, index) => (
              <input
                key={`${skill}-${index}`}
                type="hidden"
                name="skills"
                value={skill}
              />
            ))}

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Choose suggestions or add your own skill.</span>
              <span>{skills.length}/5</span>
            </div>

            {skills.length === 0 && (
              <p className="text-xs text-red-500">
                Please select at least one skill.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">About you</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Introduce yourself to fellow alumni.
          </p>
        </div>

        <RequiredLabel htmlFor="bio">About you</RequiredLabel>
        <textarea
          id="bio"
          name="bio"
          required
          rows={5}
          minLength={10}
          maxLength={2000}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Share your interests, experience, achievements, and what you're working on..."
          className={`${inputClass} min-h-32 resize-y`}
        />
        <div className="text-right text-xs text-muted-foreground">
          {bio.length}/2000 characters
        </div>
      </section>

      {/* Feedback */}
      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {state.error}
        </p>
      )}

      {state.success && (
        <p
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
        >
          Your profile has been saved successfully!
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="text-red-500">*</span> Required fields
        </p>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending
            ? "Saving profile..."
            : profile
              ? "Update profile"
              : "Create profile"}
        </button>
      </div>
    </form>
  );
}
