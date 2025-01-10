import React from 'react';
import { Menu, ShoppingCart } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const NAVBAR_HEIGHT = "80px";

export const Navbar: React.FC<{onMenuClick:any, isOpen:boolean}> = ({ onMenuClick, isOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full p-0">
        <div className="flex h-20 items-center justify-between bg-white px-4 shadow-sm">
          {/* Left Section with Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center rounded-md p-2 text-blue-600 hover:bg-blue-50 focus:outline-none"
              aria-label="Open Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-xl font-bold text-blue-600 md:hidden">
              Freezer Faves
            </span>
          </div>

          {/* Center Logo Section */}
          <div className="flex items-center justify-center">
            <div className="hidden md:block">
              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 transition-all hover:bg-blue-600">
                  <img 
                    src="/api/placeholder/40/40" 
                    alt="Logo" 
                    className="rounded-full"
                  />
                </div>
                <span className="text-xl font-bold text-blue-600">
                  Freezer Faves
                </span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-blue-50"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  3
                </span>
              </div>
            </button>
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;