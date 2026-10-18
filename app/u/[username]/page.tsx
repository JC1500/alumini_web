
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileView from "@/app/me/profile-view";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await prisma.alumniProfile.findUnique({
    where: { username },
  });

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-black dark:text-gray-100 sm:px-6 sm:py-12">
      <ProfileView profile={profile} editable={false} />
    </main>
  );
}
