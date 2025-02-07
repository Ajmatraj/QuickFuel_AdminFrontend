'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = (allowedRoles: string[]) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Prevent running on the server

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login'); // Redirect to login if no token
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!allowedRoles.includes(userData.role)) {
        router.push('/login'); // Redirect if the role is not allowed
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading };
};
