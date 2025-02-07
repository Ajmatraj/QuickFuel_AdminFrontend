// HomePage.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from '../admin/components/Logout';

const HomePage = () => {
  const searchParams = useSearchParams();  // Get the query parameters from the URL
  const message = searchParams.get('message');  // Extract the 'message' param

  useEffect(() => {
    if (message) {
      toast.success(message);  // If the message exists, show the toast
    }
  }, [message]);

  return (
    <>
      <ToastContainer />
      {/* Your homepage content */}
      <h1>Welcome to the Home Page!</h1>
      <Logout/>
    </>
  );
};

export default HomePage;
