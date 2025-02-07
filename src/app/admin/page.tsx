'use client';

import React from 'react';
import { useAuth } from '@/lib/authChecker';

const DashboardPage = () => {
  const { user, loading } = useAuth(['admin', 'user']);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Avoid hydration issues

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Dashboard</h1>
          <div className="mt-4">
            <h2 className="text-xl font-bold">User Details</h2>
            <div className="mt-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
