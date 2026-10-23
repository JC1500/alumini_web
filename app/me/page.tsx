
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/sessions";
import ProfileForm from "./profile-form";
import ProfileView from "./profile-view";

export default function MyProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-black dark:text-gray-100 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Suspense
          fallback={
            <p className="py-12 text-center text-gray-500">
              Loading your profile...
            </p>
          }
        >
          <ProfileContent />
        </Suspense>
      </div>
    </main>
  );
}

async function ProfileContent() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/sign-in");
  }

  const profile = await prisma.alumniProfile.findUnique({
    where: { userId: session.user.id },
  });

  const isProfileFilled =
    !!profile?.fullName.trim() && !!profile?.username.trim();

  if (isProfileFilled && profile) {
    return <ProfileView profile={profile} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Create your alumni profile
      </h1>

      <p className="mt-2 mb-8 text-gray-600 dark:text-gray-400">
        Add your details so fellow alumni can learn about you.
      </p>

      <ProfileForm profile={profile} />
    </div>
  );
}
