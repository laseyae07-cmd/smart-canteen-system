import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/orders', {
        orderItems: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          menuItem: item.menuItem,
        })),
        totalPrice,
      });

      clearCart();
      setSuccess('Order placed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
      <p className="mt-2 text-gray-600">Review your order before checkout.</p>

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          Your cart is empty.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item.menuItem} className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">${item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.menuItem, item.quantity - 1)}
                  className="h-9 w-9 rounded-full border text-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                  className="h-9 w-9 rounded-full border text-lg hover:bg-gray-100"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.menuItem)}
                  className="ml-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;