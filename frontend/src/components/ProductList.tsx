import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, PaginationResponse } from '../types/types';
import { useCart } from '../Hooks.tsx/useCart';
import { BASE_URL } from '../API/urls';
import {ProductCard} from './ProductCard';

interface ProductListProps {
  initialProducts?: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ initialProducts = [] }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const { addToCart } = useCart();

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}products?page=${page}&limit=20`);
      const data: PaginationResponse = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(parseInt(data.currentPage));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    const payload = { productId, quantity };
    await addToCart(payload);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setSlideDirection(newPage > currentPage ? 'right' : 'left');
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const LoadingSkeleton = () => (
    <div className="bg-white border border-beigeShade1 rounded-lg p-3 space-y-2">
      <div className="h-32 bg-beigeShade1 rounded animate-pulse" />
      <div className="h-3 bg-beigeShade1 rounded w-2/3 animate-pulse" />
      <div className="h-3 bg-beigeShade1 rounded w-1/2 animate-pulse" />
      <div className="h-6 bg-beigeShade1 rounded animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-beigeShade1">
      <div className="w-full px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`
              grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 
              gap-3 md:gap-4 mb-8
              transition-all duration-500 ease-in-out
              transform
              ${slideDirection === 'right' 
                ? 'translate-x-0 opacity-100' 
                : '-translate-x-full opacity-0'
              }
            `}
          >
            {isLoading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
              : products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
          </div>

          <div className="flex justify-center items-center py-8 mt-4 bg-white rounded-lg shadow-sm
                         transform transition-all duration-300 hover:shadow-md">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded-full bg-beigeShade1 hover:bg-beigeShade2 
                          transition-all duration-300 transform hover:scale-105
                          disabled:opacity-50 disabled:hover:scale-100"
              >
                <ChevronLeft className="w-5 h-5 text-fontColor" />
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`
                        w-8 h-8 rounded-full text-sm font-medium
                        transition-all duration-300 transform
                        ${currentPage === pageNum
                          ? 'bg-fontColor text-white scale-110'
                          : 'bg-beigeShade1 hover:bg-beigeShade2 text-fontColor hover:scale-105'}
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="p-2 rounded-full bg-beigeShade1 hover:bg-beigeShade2 
                          transition-all duration-300 transform hover:scale-105
                          disabled:opacity-50 disabled:hover:scale-100"
              >
                <ChevronRight className="w-5 h-5 text-fontColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;