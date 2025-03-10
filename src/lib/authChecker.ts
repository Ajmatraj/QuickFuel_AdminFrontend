'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import Toastify

export const useAuth = (allowedRoles?: string[]) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userDataString = localStorage.getItem('userDetails');

    if (!accessToken || !userDataString) {
      setLoading(false);
      toast.error('You are not authenticated'); 
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userDataString);
      const role = userData?.role;

      if (!userData || !role) {
        setLoading(false);
        toast.error('User data is missing');
        router.push('/login');
        return;
      }

      // Validate role
      if (allowedRoles && !allowedRoles.includes(role)) {
        setLoading(false);
        toast.error('You do not have permission to access this page');
        router.push('/login');
        return;
      }

      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      setLoading(false);
      toast.error('An error occurred while fetching user data');
      router.push('/login');
    }
  }, [router]); 
  // Removed `allowedRoles` from dependencies to prevent unnecessary re-renders

  return { user, loading };
};
