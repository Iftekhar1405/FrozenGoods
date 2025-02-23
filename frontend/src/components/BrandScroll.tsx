import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../API/urls';

const BrandScroll = () => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);
    const containerRef = useRef(null);

    const fetchBrands = async () => {
        const response = await fetch(`${BASE_URL}products/brand`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    const { data: brands, isLoading, isError } = useQuery({
        queryKey: ['products/brand'],
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

    const handleCategoryClick = (brand: string) => {
        navigate(`/brand=${brand}`);
    };

    const handleShowAll = () => {
        setShowAll(true);
    };

    const getInitialDisplayCount = () => {
        if (window.innerWidth >= 1024) return 8; // lg breakpoint
        if (window.innerWidth >= 768) return 6; // md breakpoint
        return 3; // mobile
    };

    const displayBrands = showAll ? brands : brands.slice(0, getInitialDisplayCount());

    return (
        <div
            className="mt-4 p-6 rounded-lg bg-gray-50"
            ref={containerRef}
        >
            {/* Section Header with Animation */}
            <div className="flex items-center mb-6 animate-fade-in">
                <div className="flex-grow border-t-2 border-gray-300"></div>
                <h3 className="px-4 text-2xl font-bold text-gray-800">Our Brands</h3>
                <div className="flex-grow border-t-2 border-gray-300"></div>
            </div>

            {/* Brand Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {displayBrands.map((brand: any, index: number) => (
                    <div
                        key={index}
                        onClick={() => handleCategoryClick(brand.brandName)}
                        className="group cursor-pointer animate-fade-in-up"
                    >
                        <div className="aspect-square rounded-2xl bg-white p-4 shadow-sm border border-gray-100 
                            transition-all duration-300 ease-in-out transform
                            hover:shadow-lg hover:border-gray-200 hover:-translate-y-1 hover:scale-105">
                            <div className="h-full w-full flex flex-col items-center justify-center">
                                <img
                                    src={brand.img}
                                    alt={brand.brandName}
                                    className="w-full h-3/4 object-contain mb-2 transition-transform duration-300 group-hover:scale-110"
                                />
                                <p className="text-sm font-medium text-gray-700 text-center 
                             group-hover:text-red-500 transition-colors duration-300">
                                    {brand.brandName}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show All Button */}
            {!showAll && brands.length > getInitialDisplayCount() && (
                <div className="flex justify-center mt-8 animate-fade-in">
                    <button
                        onClick={handleShowAll}
                        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg
                       shadow-sm hover:bg-gray-600 hover:shadow-md 
                       transition-all duration-300 ease-in-out transform
                       hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Show All Brands
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrandScroll;
