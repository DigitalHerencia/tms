'use client';

import React, { useState } from 'react';
import { useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import type { NextPage } from 'next';

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Status message when reset email is sent
  const [statusMessage, setStatusMessage] = useState('');

  // No router - middleware handles redirects
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  // No redirects here - middleware handles all auth redirects
  if (!isLoaded) {
    // Show a loading spinner or fallback UI
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span className="text-white">Loading...</span>
      </div>
    );
  }

  // RULE #5: Use Clerk's process for resetting passwords
  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatusMessage('');

    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setStep('reset');
      setStatusMessage('Reset code sent! Check your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });
      if (result?.status === 'complete') {
        await setActive?.({ session: result.createdSessionId });
        setStatusMessage('Password reset successful! Redirecting...');
        // Wait for Clerk to update user context, then redirect
        setTimeout(() => {
          // Try to get orgId from user.publicMetadata
          const orgId = user?.publicMetadata?.organizationId as string | undefined;
          const userId = user?.id;
          if (orgId && userId) {
            router.replace(`/${orgId}/dashboard/${userId}`);
          } else {
            router.replace('/onboarding');
          }
        }, 1200);
      } else if (result?.status === 'needs_second_factor') {
        setError('2FA is required. Please complete second factor authentication.');
      } else {
        setError('Password reset failed. Try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="mt-2 text-3xl font-extrabold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-400">
            Enter your email to receive a password reset code.
          </p>
        </div>
        <form
          onSubmit={step === 'request' ? handleRequest : handleReset}
          className="mt-8 flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-lg"
        >
          {step === 'request' ? (
            <>
              <label className="text-sm font-medium text-gray-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-blue-500 py-2 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send reset code'}
              </button>
            </>
          ) : (
            <>
              <label className="text-sm font-medium text-gray-200" htmlFor="password">
                New Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="text-sm font-medium text-gray-200" htmlFor="code">
                Reset Code
              </label>
              <input
                id="code"
                type="text"
                required
                className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-blue-500 py-2 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </>
          )}
          <div className="flex justify-between">
            <a href="/sign-in" className="text-xs text-blue-400 hover:underline">
              Back to sign in
            </a>
            <a href="/sign-up" className="text-xs text-blue-400 hover:underline">
              Create account
            </a>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          {statusMessage && <p className="mt-2 text-sm text-green-500">{statusMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
