'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

function Page() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const initialState = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
  };

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.role) {
      toast.error('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/v1/users/register', formData);
      
      // Success notification
      toast.success('Registration successful! Redirecting to login...');
      console.log(res.data);

      // Reset form after successful registration
      setFormData(initialState);

      // Redirect to login page after delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Error:', error);

      // Default error message
      let errorMessage = 'Something went wrong. Please try again.';

      // Handle specific errors
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Invalid input. Please check your details.';
        } else if (error.response.status === 409) {
          errorMessage = error.response.data?.message || 'Email or username already exists.';
        } else {
          errorMessage = error.response.data?.message || 'Registration failed.';
        }
      }

      // Show error notification
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
  <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
    <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
      <div>
        <img src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png" className="w-32 mx-auto" />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl xl:text-3xl font-extrabold">
          Sign up
        </h1>
        <div className="w-full flex-1 mt-8">
          <div className="flex flex-col items-center">
            <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
              <div className="bg-white p-2 rounded-full">
                <svg className="w-4" viewBox="0 0 533.5 544.3">
                  <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                  <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                  <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                  <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                </svg>
              </div>
              <span className="ml-4">
                Sign Up with Google
              </span>
            </button>
            
          </div>
          <div className="my-8 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Or sign up with e-mail
            </div>
          </div>
          
          <div className="mx-auto max-w-xs gap-5">
            <form onSubmit={handleSubmit}>
            <input 
            name='name' 
            value={formData.name} 
            required
            onChange={handleChange} 
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" 
            type="text" 
            placeholder="Full Name" />
            
            <input 
            name='email' 
            value={formData.email}
            required 
            onChange={handleChange} 
            className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" 
            type="email" 
            placeholder="Email" />

            <input 
            name='username' 
            value={formData.username}
            required 
            onChange={handleChange} 
            className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" 
            type="text" 
            placeholder="UserName" />

            <input 
            name='password' 
            value={formData.password}
            required 
            onChange={handleChange} 
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5" 
            type="password" 
            placeholder="Password" />
          
            <select
            name="role" 
            value={formData.role} 
            required 
            onChange={handleChange} 
             className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5">
            <option value="" disabled>Select a role</option>
              <option value="user">User</option>
              <option value="rider">Rider</option>
              <option value="fuelstation">Fuel Station</option>
            </select>
          
            <button type='submit'
             className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
             disabled={loading}
             >
              <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy={7} r={4} />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              <span className="ml-3">
              {loading ? 'Signing Up...' : 'Sign Up'}
              </span>
            </button>
             {/* Toastify Notification Container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            </form>
            <p className="mt-6 text-xs text-gray-600 text-center">
              I ready have an account - 
              <Link href="/login" className="border-b border-gray-500 border-dotted text-indigo-500">
                 Sign In
              </Link>
            </p>
            <p className="mt-6 text-xs text-gray-600 text-center">
              I agree to abide by templatana's
              <a href="#" className="border-b border-gray-500 border-dotted">
                Terms of Service
              </a>
              and its
              <a href="#" className="border-b border-gray-500 border-dotted">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
      <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" style={{backgroundImage: 'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")'}}>
      </div>
    </div>
  </div>
</div>
 
  );
}

export default Page;
