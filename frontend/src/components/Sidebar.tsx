import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://frezzers-faves-api.vercel.app/products/category/');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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

  const SidebarContent = () => (
    <div className="flex flex-col gap-4 p-4">
      <NavigationLink
        to="/"
        className={`rounded-lg p-3 shadow-sm  hover:bg-orange-50 hover:text-stone-700 ${
          currentPath === "/" ? "bg-beigeShade1" : "bg-white"
        }`}
      >
        <span className="font-bold">Home</span>
      </NavigationLink>

      <div className="mt-4">
        <h2 className="mb-4 text-lg font-bold">Categories</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center font-medium text-stone-800">
            No categories available.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {categories.map((category) => (
              <NavigationLink
                key={category._id}
                to={`/category/${category.name.toLowerCase()}`}
                className="block transition-transform hover:-translate-y-0.5 hover:no-underline"
              >
                <div className="flex items-center gap-3 rounded-lg text-stone-700 bg-white p-3 shadow-lg hover:bg-orange-50">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="h-12 w-12 rounded-full object-cover"
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