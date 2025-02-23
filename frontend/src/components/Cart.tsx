import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../Hooks.tsx/useCart';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ item, addToCart, removeFromCart }:any) => {
  const { product, quantity } = item;
  
  return (
    <div className="w-full p-3 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100">
      <div className="flex items-center gap-3">
        {/* Compact Product Image */}
        <div className="relative w-16 h-16 flex-shrink-0">
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
        
        {/* Product Details - Minimized */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <div className="text-xs text-gray-500 mt-0.5">
            {product.brand.brandName}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-blue-600">₹{product.price}</span>
            <span className="text-xs line-through text-gray-400">₹{product.MRP}</span>
          </div>
        </div>

        {/* Compact Quantity Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <button
              className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
              onClick={() => addToCart({ productId: product._id, quantity: -1 })}
              disabled={quantity === 1}
            >
              <Minus size={14} className={quantity === 1 ? 'text-gray-400' : 'text-gray-600'} />
            </button>
            
            <span className="w-5 text-center text-sm font-medium">{quantity}</span>
            
            <button
              className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-gray-50 transition-all"
              onClick={() => addToCart({ productId: product._id, quantity: 1 })}
            >
              <Plus size={14} className="text-gray-600" />
            </button>
          </div>

          <button
            className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-md p-1.5"
            onClick={() => removeFromCart(product._id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate()
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
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="w-full max-w-xl flex flex-col items-center justify-center space-y-4 p-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingCart size={32} className="text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800">Your cart is empty</p>
            <p className="text-gray-500 mt-2">Add items to your cart to start shopping</p>
          </div>
          <button  className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-800">Shopping Cart</h1>
              <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {itemCount}
              </span>
            </div>
            
            <button
              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-all rounded-lg px-2 py-1"
              onClick={() => clearAllFromCart("")}
              disabled={isClearingCart}
            >
              <Trash2 size={16} />
              <span className="text-sm font-medium">Clear</span>
              {isClearingCart && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
              )}
            </button>
          </div>

          <div className="space-y-2">
            {cart.items.map((item) => (
              <CartItem key={item.product._id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold pt-2">
                <span>Total</span>
                <span className="text-blue-600">₹{cart.totalPrice}</span>
              </div>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg text-base font-semibold
                           transition-all duration-200 
                           hover:bg-blue-700 active:scale-99
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           shadow-md shadow-blue-500/20">
              Checkout
            </button>
            
            <button onClick={() => navigate("/")} className="w-full mt-2 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-2">
              <ArrowLeft size={18} />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;