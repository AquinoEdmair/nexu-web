'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useRefreshToken } from '@/lib/hooks/useAuth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, token, setLoading } = useAuthStore();
  const router = useRouter();
  const { refresh } = useRefreshToken();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated && token) {
      // Has a persisted token but not yet validated — attempt silent refresh
      setLoading(true);
      refresh();
    } else if (!isAuthenticated && !token) {
      setLoading(false);
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, mounted]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-fixed border-t-transparent" />
          <p className="text-sm text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
