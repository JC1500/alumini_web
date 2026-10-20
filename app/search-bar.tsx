"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type {
  FormEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

type AlumniProfile = {
  id: string;
  username: string;
  fullName: string;
  headline: string | null;
  profileImage: string | null;
};

type SearchApiResponse = {
  profiles?: AlumniProfile[];
  error?: string;
};

const STORAGE_KEY = "alumni_recent_searches";
const MAX_RECENT_SEARCHES = 8;

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState<string>("");
  const [profiles, setProfiles] = useState<AlumniProfile[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef<number>(0);

  // Load recent searches from localStorage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every((item): item is string => typeof item === "string")
        ) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  // Save a search, moving repeated searches to the top.
  const saveRecentSearch = useCallback((value: string): void => {
    const search = value.trim();

    if (!search) return;

    setRecentSearches((previous: string[]) => {
      const updated = [
        search,
        ...previous.filter(
          (item: string) => item.toLowerCase() !== search.toLowerCase()
        ),
      ].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Continue if localStorage is unavailable.
      }

      return updated;
    });
  }, []);

  // Fetch matching profiles while typing.
  useEffect(() => {
    const search = query.trim();
    const requestId = ++requestIdRef.current;

    if (!search) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(search)}`
        );

        if (!response.ok) {
          throw new Error("Failed to search alumni");
        }

        const data: SearchApiResponse = await response.json();

        if (requestId === requestIdRef.current) {
          setProfiles(
            Array.isArray(data.profiles) ? data.profiles : []
          );
        }
      } catch (error: unknown) {
        console.error("Alumni search error:", error);

        if (requestId === requestIdRef.current) {
          setProfiles([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    function handleOutsideClick(event: globalThis.MouseEvent): void {
      const target = event.target;

      if (
        target instanceof Node &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Submit full search.
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const search = query.trim();

    setIsOpen(false);

    if (!search) {
      router.push("/search");
      return;
    }

    saveRecentSearch(search);
    router.push(`/search?q=${encodeURIComponent(search)}`);
  }

  // Open an alumni profile.
  function handleProfileClick(profile: AlumniProfile): void {
    if (!profile.username) return;

    saveRecentSearch(profile.fullName || profile.username);
    setIsOpen(false);

    router.push(`/u/${encodeURIComponent(profile.username)}`);
  }

  // Select a previous search.
  function handleRecentSearchClick(search: string): void {
    setQuery(search);
    setIsOpen(true);
  }

  // Remove a previous search.
  function removeRecentSearch(search: string): void {
    setRecentSearches((previous: string[]) => {
      const updated = previous.filter((item: string) => item !== search);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors.
      }

      return updated;
    });
  }

  // Navigate to all results from the dropdown.
  function handleSeeAllResults(): void {
    const search = query.trim();

    if (!search) return;

    saveRecentSearch(search);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(search)}`);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* SEARCH INPUT */}
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
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsOpen(true)}
            autoComplete="off"
            placeholder="Search alumni by name, company, or department..."
            aria-label="Search alumni"
            aria-expanded={isOpen}
            className="min-w-0 w-full border-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setProfiles([]);
                setIsOpen(true);
              }}
              aria-label="Clear search"
              className="shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[min(75vh,600px)] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
          {/* MATCHING ALUMNI PROFILES */}
          {query.trim() && (
            <div>
              {loading && (
                <p className="px-5 py-4 text-sm text-gray-500">
                  Searching alumni...
                </p>
              )}

              {!loading && profiles.length > 0 && (
                <div className="py-2">
                  {profiles.slice(0, 8).map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => handleProfileClick(profile)}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      {profile.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt=""
                          className="size-11 shrink-0 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
                        />
                      ) : (
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {profile.fullName?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {profile.fullName || profile.username}
                        </p>

                        {profile.headline && (
                          <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                            {profile.headline}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!loading && profiles.length === 0 && (
                <p className="px-5 py-4 text-sm text-gray-500">
                  No matching alumni found.
                </p>
              )}
            </div>
          )}

          {/* RECENT SEARCHES */}
          {recentSearches.length > 0 && (
            <div
              className={
                query.trim()
                  ? "border-t border-gray-200 dark:border-gray-800"
                  : ""
              }
            >
              <p className="px-5 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Recent searches
              </p>

              {recentSearches.map((search: string) => (
                <div
                  key={search}
                  className="group flex items-center gap-3 px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <button
                    type="button"
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-5 shrink-0 text-gray-400"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>

                    <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                      {search}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeRecentSearch(search)}
                    aria-label={`Remove ${search}`}
                    className="shrink-0 rounded-full px-2 py-1 text-gray-400 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!query.trim() && recentSearches.length === 0 && (
            <p className="px-5 py-6 text-center text-sm text-gray-500">
              Search your alumni network.
            </p>
          )}

          {/* SEE ALL RESULTS */}
          {query.trim() && (
            <button
              type="button"
              onClick={handleSeeAllResults}
              className="w-full border-t border-gray-200 px-5 py-4 text-center text-sm font-semibold text-blue-600 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
            >
              See all results for &quot;{query.trim()}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
