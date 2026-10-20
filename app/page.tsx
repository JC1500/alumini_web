
import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { Suspense } from "react";

const features = [
  {
    number: "01",
    title: "Find your people",
    description:
      "Discover alumni by name, department, graduation year, or company and reconnect with people who share your journey.",
    symbol: "↗",
  },
  {
    number: "02",
    title: "Build your identity",
    description:
      "Create your alumni profile, showcase your skills, and share your professional experience with your community.",
    symbol: "◎",
  },
  {
    number: "03",
    title: "Explore career journeys",
    description:
      "Learn about the companies, roles, and paths other alumni have taken after graduation.",
    symbol: "⌘",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative isolate bg-[#10182B] text-white">
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 size-[500px] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-32 -z-10 size-[450px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
              <span className="size-2 rounded-full bg-blue-400" />
              Your alumni community
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your past connects to your{" "}
              <span className="text-blue-400">future.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Your college journey doesn&apos;t end at graduation. Discover
              alumni, explore career journeys, and build connections that last
              beyond campus.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Suspense fallback={null}>
                <Show when="signed-out">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    Join the community <span aria-hidden="true">→</span>
                  </Link>

                  <Link
                    href="/sign-in"
                    className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Sign in
                  </Link>
                </Show>

                <Show when="signed-in">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    Explore alumni <span aria-hidden="true">→</span>
                  </Link>

                  <Link
                    href="/me"
                    className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View my profile
                  </Link>
                </Show>
              </Suspense>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              One community. Different journeys. Endless possibilities.
            </p>
          </div>

          {/* Decorative network illustration */}
          <div className="relative mx-auto flex min-h-[340px] w-full max-w-lg items-center justify-center sm:min-h-[420px]">
            <div className="absolute size-56 rounded-full border border-white/10 sm:size-72" />
            <div className="absolute size-72 rounded-full border border-white/10 sm:size-[400px]" />
            <div className="absolute size-40 rounded-full bg-blue-500/20 blur-3xl sm:size-56" />

            <div className="relative flex size-28 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl sm:size-36">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="size-14 text-blue-300 sm:size-20"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                <path d="M3 5.5a3 3 0 0 0 0 5.8M21 5.5a3 3 0 0 1 0 5.8" />
              </svg>
            </div>

            <div className="absolute left-0 top-[18%] rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-lg sm:left-4 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-violet-400/20 font-bold text-violet-200">
                  A
                </span>
                <div>
                  <p className="text-sm font-semibold">Alumni</p>
                  <p className="text-xs text-slate-300">Shared beginnings</p>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-[27%] rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-lg sm:right-2 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-emerald-400/20 font-bold text-emerald-200">
                  C
                </span>
                <div>
                  <p className="text-sm font-semibold">Careers</p>
                  <p className="text-xs text-slate-300">New opportunities</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[13%] left-[12%] rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-lg sm:left-[15%] sm:p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-amber-400/20 font-bold text-amber-200">
                  N
                </span>
                <div>
                  <p className="text-sm font-semibold">Networking</p>
                  <p className="text-xs text-slate-300">Connections for life</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="about"
        className="bg-white px-4 py-20 dark:bg-gray-950 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              More than a directory
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Stay connected to the people who share your story.
            </h2>

            <p className="mt-5 leading-7 text-gray-600 dark:text-gray-400">
              Alumini brings your alumni community together in one place,
              making it easier to discover people and learn from their
              experiences.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {feature.symbol}
                  </span>

                  <span className="text-sm font-semibold text-gray-400">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold">{feature.title}</h3>

                <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-4 pb-20 dark:bg-gray-950 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your next connection could change everything.
              </h2>

              <p className="mt-4 leading-7 text-blue-100">
                Create your profile and become part of a community that grows
                with every new journey.
              </p>
            </div>

            <Suspense fallback={null}>
              <Show when="signed-out">
                <Link
                  href="/sign-up"
                  className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Get started <span aria-hidden="true">→</span>
                </Link>
              </Show>

              <Show when="signed-in">
                <Link
                  href="/search"
                  className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Find alumni <span aria-hidden="true">→</span>
                </Link>
              </Show>
            </Suspense>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 dark:border-gray-800 dark:bg-gray-950 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-bold">
            Alumini<span className="text-blue-600">.</span>
          </Link>

          <p className="text-sm text-gray-500">
            Built to keep alumni connected.
          </p>

          <Link
            href="/search"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
          >
            Explore the community →
          </Link>
        </div>
      </footer>
    </main>
  );
}
