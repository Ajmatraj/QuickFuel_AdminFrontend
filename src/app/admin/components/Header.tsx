import React from 'react';
import { Search, Bell, User, Menu, HomeIcon } from 'lucide-react';
import { redirect } from 'next/navigation'

interface HeaderProps {
  toggleSidebar: () => void;
}


const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {



  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden">
          <Menu className="h-6 w-6 text-black" />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
      <button onClick={() => redirect('/')} className="p-2 text-gray-500 hover:text-gray-700">
          <HomeIcon className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
