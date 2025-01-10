import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
  img: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
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

  const SidebarContent = () => (
    <div className="flex flex-col gap-4 p-4">
      <Link
        to="/"
        className={`rounded-lg p-3 shadow-sm hover:bg-blue-50 ${
          location.pathname === "/" ? "bg-blue-100" : "bg-white"
        }`}
      >
        <span className="font-bold">Home</span>
      </Link>

      {/* Categories Section */}
      <div className="mt-4">
        <h2 className="mb-4 text-lg font-bold">Categories</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center font-medium text-gray-500">
            No categories available.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.name.toLowerCase()}`}
                className="block transition-transform hover:-translate-y-0.5 hover:no-underline"
              >
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm hover:bg-blue-50">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link
          to="/scan"
          className={`block rounded-lg p-3 shadow-sm hover:bg-blue-50 ${
            location.pathname === "/scan" ? "bg-blue-100" : "bg-white"
          }`}
        >
          <span className="font-bold">Scan QR Code</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 transform bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-20 left-0 z-40 h-[calc(100vh-80px)] w-64 transform overflow-y-auto bg-gray-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="fixed top-20 left-0 hidden h-[calc(100vh-80px)] w-64 border-r border-gray-200 bg-gray-50 md:block">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;