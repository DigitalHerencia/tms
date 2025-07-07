"use client";

import Link from "next/link";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { MapPinned } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const { signUp, isLoaded, setActive } = useSignUp();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!email.trim() || !password.trim() || !legalAccepted) {
      setError("All fields are required and you must accept the terms.");
      setLoading(false);
      return;
    }
    if (!isLoaded || !signUp) {
      setError("Sign up service unavailable. Please try again later.");
      setLoading(false);
      return;
    }
    try {
      const res = await signUp.create({
        emailAddress: email,
        password,
        legalAccepted: true,
      });
      if (res.status === "complete" && res.createdSessionId) {
        await setActive({ session: res.createdSessionId });
        window.location.href = "/onboarding";
      } else {
        setError("Sign up failed. Please try again.");
      }
    } catch (err: any) {
      if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        setError(err.errors[0].message || "Sign up failed. Please try again.");
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
        <div className='flex min-h-screen flex-col items-center justify-center mt-10 mb-10 rounded-lg bg-black px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md space-y-8'>
                <div className='flex flex-col items-center justify-center text-center'>
                    <div className='flex flex-1 items-center'>
                        <Link
                            className='flex items-center justify-center underline-offset-4 hover:text-blue-500 hover:underline'
                            href='/'
                        >
                            <MapPinned className='mr-1 h-6 w-6 text-blue-500' />
                            <span className='text-2xl font-extrabold text-white dark:text-white'>
                                FleetFusion
                            </span>
                        </Link>
                    </div>
          <h1 className="mt-2 text-3xl font-extrabold text-white">
            CREATE YOUR ACCOUNT
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-500 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-neutral-900 p-6 shadow-lg rounded-lg border border-neutral-800 flex flex-col gap-4"
        >
          <label className="text-gray-200 text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-md border border-neutral-700 bg-black text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-gray-200 text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            className="rounded-md border border-neutral-700 bg-black text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="flex items-center gap-2 text-gray-200 text-sm font-medium">
            <input
              type="checkbox"
              checked={legalAccepted}
              onChange={e => setLegalAccepted(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
              required
            />
            I accept the <a href="/terms" className="underline text-blue-400" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          </label>
          {error && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-950 p-3 border border-red-500">
              <div className="flex-1">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !isLoaded}
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}