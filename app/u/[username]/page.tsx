import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileView from "@/app/me/profile-view";
import { getCurrentProfile } from "@/lib/chat/get-current-profile";
import MessageButton from "@/components/chat/message-button";

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ messageError?: string }>;
}) {
  const { username } = await params;
  const query = searchParams ? await searchParams : {};

  const profile = await prisma.alumniProfile.findUnique({
    where: { username },
    select: {
      id: true,
      fullName: true,
      username: true,
      headline: true,
      bio: true,
      profileImageUrl: true,
      coverImageUrl: true,
      department: true,
      graduationYear: true,
      degree: true,
      company: true,
      jobTitle: true,
      location: true,
      skills: true,
    },
  });

  if (!profile) {
    notFound();
  }

  const viewer = await getCurrentProfile();
  const canMessage =
    viewer.status === "authenticated" && viewer.profile.id !== profile.id;
  const messageError =
    query.messageError === "not_found"
      ? "That profile could not be found."
      : query.messageError === "invalid_input"
        ? "You cannot start a conversation with this profile."
        : query.messageError === "server_error"
          ? "Couldn't start a conversation. Please try again."
          : null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-black dark:text-gray-100 sm:px-6 sm:py-12">
      {messageError && (
        <p
          role="alert"
          className="mx-auto mb-4 max-w-4xl rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {messageError}
        </p>
      )}
      {canMessage && (
        <div className="mx-auto mb-4 flex max-w-4xl justify-end">
          <MessageButton username={profile.username} />
        </div>
      )}
      <ProfileView
        profile={{
          fullName: profile.fullName,
          username: profile.username,
          headline: profile.headline,
          bio: profile.bio,
          profileImageUrl: profile.profileImageUrl,
          coverImageUrl: profile.coverImageUrl,
          department: profile.department,
          graduationYear: profile.graduationYear,
          degree: profile.degree,
          company: profile.company,
          jobTitle: profile.jobTitle,
          location: profile.location,
          skills: profile.skills,
        }}
        editable={false}
      />
    </main>
  );
}
