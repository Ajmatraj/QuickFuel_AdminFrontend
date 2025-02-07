// Logout.tsx
'use client'
import React from "react";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove tokens and user data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    // Show success message using Toastify
    toast.success("Logout successful!");

    // Redirect to the login page or home page after logout
    router.push("/login"); // or you can redirect to the homepage '/' if you prefer
  };

  return (
    <>
      <ToastContainer />
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Logout;
