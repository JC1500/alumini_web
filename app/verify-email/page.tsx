
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please sign up again.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Verification failed. Please try again.");
        return;
      }

      setMessage("Email verified successfully! Redirecting...");

      router.replace("/feed");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please sign up again.");
      return;
    }

    setResending(true);

    try {
      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to resend the code.");
        return;
      }

      setCode("");
      setMessage("A new verification code has been sent to your email.");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            Alumini
          </Link>

          <div className="mx-auto mt-6 flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-7"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Verify your email
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter the 6-digit code we sent to
          </p>

          <p className="mt-1 break-all text-sm font-semibold">
            {email || "Email address missing"}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label
              htmlFor="code"
              className="mb-2 block text-sm font-medium"
            >
              Verification code
            </label>

            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || loading || !email}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-blue-400"
          >
            {resending ? "Sending code..." : "Resend verification code"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Entered the wrong email?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Sign up again
          </Link>
        </p>
      </div>
    </main>
  );
}
