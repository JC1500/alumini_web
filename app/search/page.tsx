
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "../search-bar";
import { Suspense } from "react";

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-black dark:text-gray-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Find alumni</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Discover people from your alumni community.
        </p>

        <SearchBar />

        <Suspense
          fallback={<p className="mt-6 text-sm text-gray-500">Loading...</p>}
        >
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const alumni = query
    ? await prisma.alumniProfile.findMany({
        where: {
          OR: [
            { fullName: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
            { department: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          username: true,
          fullName: true,
          headline: true,
          department: true,
          graduationYear: true,
          company: true,
        },
        take: 30,
        orderBy: { fullName: "asc" },
      })
    : [];

  return (
    <>
      {query && (
        <h2 className="mt-8 mb-4 text-lg font-semibold">
          Results for &quot;{query}&quot; ({alumni.length})
        </h2>
      )}

      <div className="space-y-3">
        {alumni.map((person) => (
          <Link
            key={person.username}
            href={`/u/${encodeURIComponent(person.username)}`}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              {person.fullName.trim().charAt(0).toUpperCase() || "A"}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{person.fullName}</h3>

              <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-300">
                {person.headline || "Alumni community member"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {[person.company, person.department, person.graduationYear]
                  .filter(Boolean)
                  .join(" · ")}
              </p>

              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                View profile →
              </p>
            </div>
          </Link>
        ))}

        {query && alumni.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="font-semibold">No alumni found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try searching with a different name, company, or department.
            </p>
          </div>
        )}

        {!query && (
          <p className="mt-6 text-sm text-gray-500">
            Enter a name, username, company, or department to get started.
          </p>
        )}
      </div>
    </>
  );
}
