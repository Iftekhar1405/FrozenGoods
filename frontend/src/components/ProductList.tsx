import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, PaginationResponse } from '../types/types';

interface ProductListProps {
  initialProducts?: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ initialProducts = [] }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://frezzers-faves-api.vercel.app/products?page=${page}&limit=20`
      );
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

  const handleAddToCart = (product: Product) => {
    const id = product._id;
    const quantity = quantities[id] || 1;
    console.log('Adding to cart:', { product, quantity });
    setQuantities({ ...quantities, [id]: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setSlideDirection(newPage > currentPage ? 'right' : 'left');
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= 99) {
      setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
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
                  <div
                    key={product._id}
                    className="bg-white border border-beigeShade2 rounded-lg overflow-hidden
                              transform transition-all duration-300 hover:-translate-y-1
                              hover:shadow-[0_3px_10px_rgb(0,0,0,0.08)]
                              animate-fade-in-up"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="p-3 space-y-1">
                      <h3 className="text-sm font-medium text-fontColor font-serifText line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold text-fontColor">
                        Rs.{product.price}
                      </p>

                      <div className="flex items-center gap-1 pt-1">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={quantities[product._id] || 1}
                          onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                          className="w-14 h-7 px-1 text-sm border border-beigeShade2 rounded 
                                   focus:ring-1 focus:ring-fontColor focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className={`
                            flex-1 h-7 px-2 rounded text-xs font-medium
                            transform transition-all duration-200
                            ${product.inStock 
                              ? 'bg-fontColor hover:bg-opacity-90 active:scale-95 text-white'
                              : 'bg-beigeShade1 text-gray-400 cursor-not-allowed'}
                          `}
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
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