
"use client";

import Link from "next/link";
import { useState } from "react";
import { Show, useClerk, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  const initial =
    user?.fullName?.trim().charAt(0).toUpperCase() ||
    user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-5"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight">Alumini</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
          >
            Home
          </Link>

          <Show when="signed-in">
            <Link
              href="/feed"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
            >
              Feed
            </Link>
          </Show>

          <Link
            href="/search"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
          >
            Explore Alumni
          </Link>

          <Link
            href="/#about"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Sign up
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/search"
              aria-label="Search alumni"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open user menu"
                aria-expanded={menuOpen}
                className="flex size-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800 ring-2 ring-transparent transition hover:ring-blue-400 dark:bg-blue-950 dark:text-blue-200"
              >
                {initial}
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close user menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />

                  <div className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-950">
                    <div className="border-b border-gray-100 px-3 py-3 dark:border-gray-800">
                      <p className="truncate text-sm font-semibold">
                        {user?.fullName || "Alumini member"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>

                    <Link
                      href="/me"
                      onClick={() => setMenuOpen(false)}
                      className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      My Profile
                    </Link>

                    <Link
                      href="/feed"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Feed
                    </Link>

                    <Link
                      href="/search"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Explore Alumni
                    </Link>

                    <button
                      type="button"
                      onClick={() => signOut({ redirectUrl: "/" })}
                      className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </Show>
        </div>
      </nav>
    </header>
  );
}
