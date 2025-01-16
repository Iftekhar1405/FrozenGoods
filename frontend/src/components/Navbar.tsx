import { MoreVertical, Menu, ShoppingCart, LogOut, User, Book } from "lucide-react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar: React.FC<{ onMenuClick: any, isOpen: boolean }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full p-0">
        <div className="flex h-20 items-center justify-between bg-navBarColor px-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
          {/* Left Section with Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center rounded-md p-2 text-blue-600 hover:bg-blue-50 focus:outline-none"
              aria-label="Open Menu"
            >
              <Menu className="text-fontColor h-7 w-7 md:h-6 md:w-8" />
            </button>
            <span className="text-xl font-serifText underline tracking-wider text-fontColor md:hidden">
              FREEZER FAVES
            </span>
          </div>

          {/* Center Logo Section */}
          <div className="flex items-center justify-center">
            <div className="hidden md:block">
              <div className="relative flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full transition-all hover:bg-blue-600">
                  <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="rounded-full"
                  />
                </div>
                <span className="text-xl font-serifText tracking-wider text-fontColor">
                  FREEZER FAVES
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

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-blue-50"
                >
                  <MoreVertical className="h-6 w-6" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          navigate('/profile');
                          setShowDropdown(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          navigate('/catalog');
                          setShowDropdown(false);
                        }}
                      >
                        <Book className="mr-2 h-4 w-4" />
                        Catalog
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;