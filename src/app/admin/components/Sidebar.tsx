'use client'

import Link from 'next/link'
import { Home, Users, ShoppingCart, BarChart2, Settings, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    }

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  return (
    <aside
      className={`bg-gray-800 text-white w-64 min-h-screen p-4 transition-all duration-300 ease-in-out 
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white"
        >
          <X className="h-6 w-6" />
        </button>
      )}
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/admin" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/ordersdetails" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <Users className="h-5 w-5" />
              <span>Orders Details</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/fuelstation" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <ShoppingCart className="h-5 w-5" />
              <span>Add Fuel Station</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/update" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <BarChart2 className="h-5 w-5" />
              <span>update</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
