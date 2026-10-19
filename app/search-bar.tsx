
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-500 dark:border-gray-800 dark:bg-gray-950">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-5 shrink-0 text-gray-500"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>

        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          placeholder="Search alumni by name, company, or department..."
          aria-label="Search alumni"
          className="w-full border-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
        />

        <button
          type="submit"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}
