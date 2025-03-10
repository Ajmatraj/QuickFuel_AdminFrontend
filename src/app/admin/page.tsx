'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authChecker'; // Import the custom hook
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage = () => {
  // Define allowed roles
  const allowedRoles = ['admin', 'user', 'fuelstation'];
  const { user, loading } = useAuth(allowedRoles);
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user) {
      // Save user details in local storage
      localStorage.setItem('userDetails', JSON.stringify(user));
      setUserDetails(user);
    } else {
      // Retrieve from local storage if available
      const storedUser = localStorage.getItem('userDetails');
      if (storedUser) {
        setUserDetails(JSON.parse(storedUser));
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span>Loading...</span>
      </div>
    );
  }

  // If the user is not authenticated, redirect to login
  if (!user && !userDetails) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Dashboard</h1>
            <div className="mt-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <div className="mt-2 space-y-2">
                <p><strong>Username:</strong> {userDetails?.Username}</p>
                <p><strong>Email:</strong> {userDetails?.email}</p>
                <p><strong>Role:</strong> {userDetails?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
