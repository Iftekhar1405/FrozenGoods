import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const BrandScroll = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

  const fetchBrands = async () => {
    const response = await fetch('https://frezzers-faves-api.vercel.app/products/brand');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data: brands, isLoading, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-red-500">Failed to load brands</p>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p>No brands available</p>
      </div>
    );
  }

  const handleCategoryClick = (brand:string) => {
    navigate(`/brand=${brand}`);
  };

  const handleSeeMore = () => {
    setShowAll(true);
  };

  const displayBrands = showAll ? brands : brands.slice(0, 4);

  return (
    <div className="mt-4 p-6 rounded-lg shadow-lg bg-gray-50" ref={containerRef}>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t-2 border-slate-400"></div>
        <div className="w-3 h-3 rounded-full bg-black mx-2 transform translate-y-px"></div>
        <div className="flex-grow border-t-2 border-slate-400"></div>
      </div>

      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Explore Your Brands:
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {displayBrands.map((brand:any, index:number) => (
          <div
            key={index}
            className="p-4 bg-white rounded-md shadow-sm border cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
            onClick={() => handleCategoryClick(brand.brandName)}
          >
            <img
              src={brand.img}
              alt={brand.brandName}
              className="h-32 w-full object-contain mb-2 rounded"
            />
            <p className="font-bold text-center bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              {brand.brandName}
            </p>
          </div>
        ))}
      </div>

      {!showAll && brands.length > 4 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSeeMore}
            className="px-8 py-2 bg-red-500 text-white rounded-md shadow-md hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            See More
          </button>
        </div>
      )}

      <div className="flex items-center my-4">
        <div className="flex-grow border-t-2 border-slate-400"></div>
        <div className="w-3 h-3 rounded-full bg-black mx-2 transform -translate-y-px"></div>
        <div className="flex-grow border-t-2 border-slate-400"></div>
      </div>
    </div>
  );
};

export default BrandScroll;