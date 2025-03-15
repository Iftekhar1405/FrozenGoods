import { ArrowLeft, CreditCard, Minus, Plus, ShoppingCart, Trash2, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Hooks.tsx/useCart';

const CartItem = ({ item, addToCart, removeFromCart }: any) => {
  const { product, quantity } = item;

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Product Image */}
        <div className="relative w-20 h-20 flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
          {product.discount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 w-full sm:w-auto text-center sm:text-left">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <div className="text-xs text-gray-500 mt-0.5">
            {product.brand.brandName}
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <span className="text-sm font-semibold text-blue-600">₹{product.price}</span>
            <span className="text-xs line-through text-gray-400">₹{product.MRP}</span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-3 sm:mt-0">
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1.5">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
              onClick={() => addToCart({ productId: product._id, quantity: -1 })}
              disabled={quantity === 1}
              aria-label="Decrease quantity"
            >
              <Minus size={16} className={quantity === 1 ? 'text-gray-400' : 'text-gray-600'} />
            </button>

            <span className="w-8 text-center text-sm font-medium">{quantity}</span>

            <button
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-gray-50 transition-all"
              onClick={() => addToCart({ productId: product._id, quantity: 1 })}
              aria-label="Increase quantity"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">₹{product.price * quantity}</span>
            <button
              className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-md p-2"
              onClick={() => removeFromCart(product._id)}
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartLoading,
    itemCount,
    addToCart,
    removeFromCart,
    clearAllFromCart,
    isClearingCart,
  } = useCart();

  if (isCartLoading) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="animate-spin flex items-center justify-center rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent shadow-md"></div>
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="w-full max-w-xl flex flex-col items-center justify-center space-y-4 p-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingCart size={36} className="text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800">Your cart is empty</p>
            <p className="text-gray-500 mt-2">Add items to your cart to start shopping</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-8">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-gray-700">My Items</span>
              <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {itemCount}
              </span>
            </div>

            <button
              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-all rounded-lg px-3 py-1.5"
              onClick={() => clearAllFromCart("")}
              disabled={isClearingCart}
            >
              <Trash2 size={16} />
              <span className="text-sm font-medium hidden sm:inline">Clear All</span>
              {isClearingCart && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {cart.items.map((item) => (
              <CartItem key={item.product._id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
            ))}
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-6 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden sticky top-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="font-medium text-gray-700">Order Summary</h2>
            </div>

            <div className="p-4">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">₹{cart.totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Included</span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-base font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">₹{cart.totalPrice}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg text-base font-semibold
                               transition-all duration-200 
                               hover:bg-blue-700 active:scale-95
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               shadow-md shadow-blue-500/20">
                Proceed to Checkout
              </button>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CreditCard size={14} />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck size={14} />
                  <span>Fast shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;