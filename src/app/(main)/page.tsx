'use client'
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserDetails {
  id:string;
  name: string;
  email: string;
  avatar: string | null;
}

interface StoredUser {
  accessToken: string | null;
  refreshToken: string | null;
  userDetails: UserDetails | null;
  role: string | null; // Added the role field here
}

const HomePage = () => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const message = new URLSearchParams(window.location.search).get('message');
      if (message) {
        toast.success(message);
      }

      const storedUser = {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        userDetails: localStorage.getItem('userDetails'),
        role: localStorage.getItem('role'),  // Fetching the role from localStorage
      };

      const parsedUserDetails = storedUser.userDetails ? JSON.parse(storedUser.userDetails) : null;

      if (storedUser.accessToken && parsedUserDetails) {
        setUser({
          ...storedUser,
          userDetails: parsedUserDetails,
        });
      } else {
        toast.error("Failed to load user details.");
      }

      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <p>Loading user details...</p>;
  }

  return (
    <>
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
      {user && user.userDetails && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-300">Attribute</th>
                <th className="px-4 py-2 border border-gray-300">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-300 font-semibold">ID</td>
                <td className="px-4 py-2 border border-gray-300">{user.userDetails?.id}</td> {/* Displaying user details */}
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 font-semibold">Name</td>
                <td className="px-4 py-2 border border-gray-300">{user.userDetails.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 font-semibold">Role</td>
                <td className="px-4 py-2 border border-gray-300">{user.role}</td> {/* Fixed role display */}
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 font-semibold">Email</td>
                <td className="px-4 py-2 border border-gray-300">{user.userDetails.email}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 font-semibold">Avatar</td>
                <td className="px-4 py-2 border border-gray-300">
                  {user.userDetails.avatar ? (
                    <img src={user.userDetails.avatar} alt="User Avatar" className="w-16 h-16 rounded-full" />
                  ) : (
                    'No avatar available'
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300 font-semibold">Refresh Token</td>
                <td className="px-4 py-2 border border-gray-300">{user.refreshToken}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default HomePage;
