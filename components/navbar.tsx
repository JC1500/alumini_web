"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Show, useClerk, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);

  const { user } = useUser();
  const { signOut } = useClerk();

  const initial =
    user?.fullName?.trim().charAt(0).toUpperCase() ||
    user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() ||
    "U";

  /*
   * Show bottom navigation when scrolling UP.
   * Hide it when scrolling DOWN.
   */
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Small tolerance so tiny scroll movements don't constantly
      // show/hide the navigation.
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      if (scrollDifference < 5) {
        return;
      }

      // User is scrolling UP
      if (currentScrollY < lastScrollY) {
        setShowBottomNav(true);
      }

      // User is scrolling DOWN
      else {
        setShowBottomNav(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* =========================
          TOP NAVBAR
      ========================== */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
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

            <span className="text-xl font-bold tracking-tight">
              Alumini
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Signed out */}
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

            {/* Signed in */}
            <Show when="signed-in">
              {/* Search */}
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

              {/* Profile menu */}
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
                    {/* Overlay */}
                    <button
                      type="button"
                      aria-label="Close user menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setMenuOpen(false)}
                    />

                    {/* Menu */}
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

      {/* =====================================
          MOBILE BOTTOM NAVIGATION
          Appears when user scrolls UP
      ====================================== */}
      <Show when="signed-in">
        <nav
          aria-label="Mobile navigation"
          className={`
            fixed bottom-0 left-0 right-0 z-50
            border-t border-gray-200
            bg-white/95
            shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
            backdrop-blur-xl
            transition-transform duration-300 ease-out
            dark:border-gray-800
            dark:bg-gray-950/95
            md:hidden
            ${
              showBottomNav
                ? "translate-y-0"
                : "translate-y-full"
            }
          `}
        >
          <div className="mx-auto flex h-16 max-w-md items-center justify-center px-4">
            <Link
              href="/feed"
              className="flex h-full min-w-[100px] flex-col items-center justify-center gap-1 text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              {/* Feed icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-6"
                aria-hidden="true"
              >
                <path d="M4 5h16" />
                <path d="M4 10h16" />
                <path d="M4 15h10" />
                <path d="M4 20h7" />
              </svg>

              <span className="text-xs font-medium">
                Feed
              </span>
            </Link>
          </div>

          {/* Safe area for phones with home indicator */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      </Show>
    </>
  );
}