import { Menu, ShoppingCart } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../Hooks.tsx/useCart";

export const Navbar: React.FC<{ onMenuClick: any; isOpen: boolean }> = ({
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { itemCount } = useCart()
  const handleLoginClick = () => {
    navigate("/auth");
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
                  <img src="/logo.jpg" alt="Logo" className="rounded-full" />
                </div>
                <span className="text-xl font-serifText tracking-wider text-fontColor">
                  FREEZER FAVES
                </span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {!isLoading && isAuthenticated && (
              <button
                onClick={() => navigate("/cart")}
                className="inline-flex items-center justify-center rounded-md p-2  text-gray-700 border-none focus:outline-none0 "
                aria-label="Shopping cart"
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white ">
                      {itemCount}
                    </span>
                  )}
                </div>
              </button>
            )}

            {!isLoading && !isAuthenticated && (
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
