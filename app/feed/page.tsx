
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedList from "@/components/feed/FeedList";

export default async function FeedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-black sm:py-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Alumni Feed
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover what your alumni community is sharing.
          </p>
        </header>

        <FeedList />
      </div>
    </main>
  );
}

