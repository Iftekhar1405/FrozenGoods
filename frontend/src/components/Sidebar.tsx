import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  img: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPath, onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError(null);
        const response = await fetch('https://frezzers-faves-api.vercel.app/products/category/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Unable to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const NavigationLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(to);
      }}
      className={className}
    >
      {children}
    </a>
  );

  const CustomAlert = ({ message }: { message: string }) => (
    <div className="m-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
      <AlertCircle className="h-4 w-4" />
      <p className="text-sm">{message}</p>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-3">
        <AlertCircle className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">No Categories Found</h3>
      <p className="text-sm text-gray-500">
        Check back later for new categories or try refreshing the page.
      </p>
      <button
        onClick={() => {
          setLoading(true);
          setError(null);
          window.location.reload();
        }}
        className="mt-4 rounded-lg bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200"
      >
        Refresh Page
      </button>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col gap-4 p-4">
      <NavigationLink
        to="/"
        className={`rounded-lg p-3 shadow-sm hover:bg-orange-50 hover:text-stone-700 ${
          currentPath === "/" ? "bg-beigeShade1" : "bg-white"
        }`}
      >
        <span className="font-bold">Home</span>
      </NavigationLink>

      <div className="mt-4">
        <h2 className="mb-4 text-lg font-bold">Categories</h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-sm text-gray-500">Loading categories...</p>
          </div>
        ) : error ? (
          <CustomAlert message={error} />
        ) : categories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {categories.map((category) => (
              <NavigationLink
                key={category._id}
                to={`/category/${category.name.toLowerCase()}`}
                className="block transition-transform hover:-translate-y-0.5 hover:no-underline"
              >
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 text-stone-700 shadow-lg hover:bg-orange-50">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="h-12 w-12 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-category.png'; // Fallback image
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
              </NavigationLink>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <NavigationLink
          to="/scan"
          className={`block rounded-lg p-3 shadow-sm hover:bg-blue-50 ${
            currentPath === "/scan" ? "bg-blue-100" : "bg-white"
          }`}
        >
          <span className="font-bold">Scan QR Code</span>
        </NavigationLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay - only shown on mobile */}
      <div
        className={`fixed inset-0 z-40 transform bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar - both mobile and desktop */}
      <div
        className={`fixed left-0 z-40 h-[calc(100vh-80px)] w-64 transform overflow-y-auto bg-gray-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;