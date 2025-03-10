// import { useState } from 'react';
// import { signOut, useSession } from 'next-auth/react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { UserIcon, LogIn  } from 'lucide-react';
// import { useAuth } from '@/lib/authChecker';

// export function SessionDropdown() {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     // Define allowed roles, for example, 'admin' and 'user'
//     const allowedRoles = ['admin', 'user','fuelstation']; // Adjust according to your needs
//     const { user, loading } = useAuth(allowedRoles); // Use the authentication hook
  
//     // Show loading spinner while data is loading
//     if (loading) {
//       return (
//         <div className="min-h-screen flex justify-center items-center">
//           <span>Loading...</span> {/* You can replace this with a spinner */}
//         </div>
//       );
//     }
  
   
//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//   };

//   // Close dropdown when clicking outside
//   const handleClickOutside = () => {
//     setIsDropdownOpen(false);
//   };

//   if (!user) {
//     return (
//       <Link
//         href="/login"
//         className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition duration-300 font-extrabold flex items-center"
//       >
//         LOGIN
//         <LogIn className='ml-2'/> 
//       </Link>
//     );
//   }
  

//   return (
//     <div className="relative">
//       {user?.image ? (
//         <Image
//           src={user.image}
//           alt="User Avatar"
//           width={40}
//           height={40}
//           className="inline-block h-10 w-10 cursor-pointer rounded-full object-cover object-center ring-2 ring-white hover:ring-primary transition-all"
//           onClick={toggleDropdown}
//         />
//       ) : (
//         <div
//           className="h-10 w-10 cursor-pointer rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-white font-bold ring-2 ring-white transition-all"
//           onClick={toggleDropdown}
//         >
//           <div className='flex flex-col flex-1 items-center p-8'>
//           <UserIcon/>
//           {/* <span className='text-xs text-center'>{session?.user?.name?.[0]?.toUpperCase() }</span> */}
//           </div>
//         </div>
//       )}
      
//       {isDropdownOpen && (
//         <>
//           <div 
//             className="fixed inset-0 z-50" 
//             onClick={handleClickOutside}
//           />
//           <ul
//             role="menu"
//             className="absolute z-[60] w-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg focus:outline-none right-0 mt-2"
//           >
//             {/* User Info Section */}
//             <div className="px-4 py-3 border-b border-slate-200">
//               <div className="font-medium text-sm text-slate-900">{session?.user?.name}</div>
//               <div className="text-xs text-slate-500 truncate">{session?.user?.email}</div>
//             </div>

//             {/* Menu Items */}
//             <div className="p-1.5">
//               <li
//                 role="menuitem"
//                 className=" w-full rounded-md px-2 py-2 text-sm hover:bg-slate-50 transition-colors"
//               >
                
//                 <Link href="/profile" className="w-full flex items-center justify-center cursor-pointer">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   className="w-5 h-5 text-slate-400 mr-3"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                   My Profile
//                 </Link>
//               </li>

//               {user?.role?.toUpperCase() === 'ADMIN' && (
//                 <li
//                   role="menuitem"
//                   className="w-full rounded-md px-2 py-2 text-sm hover:bg-slate-50 transition-colors"
//                 >
                  
//                   <Link href="/admin" className="w-full flex items-center justify-center cursor-pointer">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                     className="w-5 h-5 text-slate-400 mr-3"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                     Admin Panel
//                   </Link>
//                 </li>
//               )}

//               <div className="h-px bg-slate-200 my-1.5" />

//               <li
//                 role="menuitem"
//                 className="w-full rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//               >
               
//                 <button
//                   onClick={() => signOut({ callbackUrl: '/' })}
//                   className="w-full flex items-center justify-center cursor-pointer"
//                 >
//                    <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   className="w-5 h-5 mr-3"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
//                     clipRule="evenodd"
//                   />
//                   <path
//                     fillRule="evenodd"
//                     d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                   Logout
//                 </button>
//               </li>
//             </div>
//           </ul>
//         </>
//       )}
//     </div>
//   );
// }