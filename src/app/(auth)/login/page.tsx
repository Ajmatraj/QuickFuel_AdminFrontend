'use client'
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:8000/api/v1/users/login", {
        email,
        password,
      });

      // If login is successful, store the tokens (access token, refresh token) and role
      const { accessToken, refreshToken, role ,userDetails } = response.data.data;

      localStorage.setItem("accessToken", accessToken); // Store access token in localStorage
      localStorage.setItem("refreshToken", refreshToken); // Store refresh token in localStorage
      localStorage.setItem("role", role); // Store user role in localStorage
      localStorage.setItem("userDetails", JSON.stringify(userDetails)); // Store user role in localStorage

      // Show success message
      toast.success("Login successful! Redirecting...");
     
      // Redirect to the appropriate page based on the user's role
      if (role === "admin") {
        router.push("/admin"); // Redirect to admin dashboard
      } else if (role === "user" || "fuelstation") {
        router.push("/"); // Redirect to user dashboard 
      }else if (role === "fuelstation") {
        router.push("/"); // Redirect to user dashboard
      } else {
        router.push("/"); // Redirect to default homepage if role is undefined
      }
    } catch (error) {
      setLoading(false); // Hide loading indicator once request completes

      // Handle error
      let errorMsg = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || errorMsg;

        // Handle different error statuses
        if (status === 400) {
          errorMsg = "Invalid email or password. Please try again.";
        } else if (status === 401) {
          errorMsg = "Unauthorized. Please check your credentials.";
        } else if (status === 500) {
          errorMsg = "Server error. Please try again later.";
        } else {
          errorMsg = message; // Generic message for other status codes
        }
      } else if ((error as any).request) {
        // Handle network errors (no response from server)
        errorMsg = "Network error. Please check your internet connection.";
      } else {
        // Handle other types of errors (request setup, etc.)
        errorMsg = "Login failed. Please try again.";
      }

      // Set error message in state
      setErrorMessage(errorMsg);

      // Display error using react-toastify
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <ToastContainer />
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
  <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
    <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
      <div>
        <img src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png" className="w-32 mx-auto" />
      </div>
      <div className="mt-4 flex flex-col items-center">
        <h1 className="text-2xl xl:text-3xl font-extrabold">
          Sign In
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
                Sign In with Google
              </span>
            </button>
          </div>
          <div className="my-5 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Or sign up with e-mail
            </div>
          </div>
          <div className="mx-auto max-w-xs">
          <form onSubmit={handleSubmit}>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" 
            placeholder="Email" />
            
            <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5" 
            placeholder="Password" />
            
            <button disabled={loading} className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
              <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy={7} r={4} />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              <span className="ml-3">
              {loading ? "Logging in..." : "Login"}
              </span>
            </button>
            </form>
             <p className="mt-6 text-xs text-gray-600 text-center">
                          I don't have an account - 
                          <Link href="/register" className="border-b border-gray-500 border-dotted text-indigo-500">
                             Sign Up
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
    </>
  );
};

export default LoginForm;
