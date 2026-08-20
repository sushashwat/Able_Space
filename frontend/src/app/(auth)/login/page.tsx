'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/authStore';
import { guestLogin, googleLoginUrl } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const response = await guestLogin();
      setToken(response.access_token);
      setUser(response.user);
      router.push('/tasks');
    } catch (error) {
      console.error('Guest login failed:', error);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = googleLoginUrl();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
            <span className="text-white text-lg font-bold">▲</span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              Let&apos;s get back on track
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email below to login to your account.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? 'Logging in...' : 'Continue as Guest'}
            </Button>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}