
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyCollegeEmailPage() {
  const router = useRouter();

  const [collegeEmail, setCollegeEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function handleSendCode(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail = collegeEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter your college email address.");
      return;
    }

    if (
      !/^(bt|mt)\d{2}[a-z]{2,10}\d{3}@nituk\.ac\.in$/i.test(
        normalizedEmail,
      )
    ) {
      setError(
        "Enter a valid NIT Uttarakhand college email, such as bt24cse017@nituk.ac.in.",
      );
      return;
    }

    setSending(true);

    try {
      const response = await fetch(
        "/api/auth/college-email/send-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            collegeEmail: normalizedEmail,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send the verification code.");
        return;
      }

      setCollegeEmail(normalizedEmail);
      setCode("");
      setCodeSent(true);
      setMessage(
        "A verification code has been sent to your college email.",
      );
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setVerifying(true);

    try {
      const response = await fetch(
        "/api/auth/college-email/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            collegeEmail,
            code,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed. Please try again.");
        return;
      }

      if (data.nextStep !== "PROFILE_COMPLETION") {
        setError(
          "Your email was verified, but the next step could not be determined. Please sign in again.",
        );
        return;
      }

      setMessage("College email verified! Redirecting to your profile...");

      router.replace("/complete-profile");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setVerifying(false);
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
              <path d="M2 10 12 4l10 6-10 6L2 10Z" />
              <path d="M6 12.5V17c3.5 2.5 8.5 2.5 12 0v-4.5" />
              <path d="M22 10v6" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Verify your college email
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Verify your NIT Uttarakhand email to confirm your academic
            details and continue setting up your alumni profile.
          </p>
        </div>

        {!codeSent ? (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label
                htmlFor="collegeEmail"
                className="mb-2 block text-sm font-medium"
              >
                College email address
              </label>

              <input
                id="collegeEmail"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={collegeEmail}
                onChange={(event) =>
                  setCollegeEmail(event.target.value)
                }
                placeholder="bt24cse017@nituk.ac.in"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950"
              />

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Currently supported: BT and MT college email formats.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter the 6-digit code sent to
              </p>

              <p className="mt-1 break-all text-sm font-semibold">
                {collegeEmail}
              </p>

              <button
                type="button"
                onClick={() => {
                  setCodeSent(false);
                  setCode("");
                  setError("");
                  setMessage("");
                }}
                className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Change college email
              </button>
            </div>

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
                  setCode(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
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
              disabled={verifying}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifying
                ? "Verifying..."
                : "Verify college email"}
            </button>

            <button
              type="button"
              onClick={() => handleSendCode()}
              disabled={sending || verifying}
              className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-blue-400"
            >
              {sending ? "Sending code..." : "Resend verification code"}
            </button>
          </form>
        )}

        {message && !codeSent && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300"
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already verified?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
