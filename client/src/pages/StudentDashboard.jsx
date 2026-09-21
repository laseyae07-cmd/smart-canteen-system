import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/my');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to load student orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome, {user?.name}</p>

      {loading ? (
        <p className="mt-6 text-gray-500">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
          You have no orders yet.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border p-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-6)}</h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {order.status}
                </span>
              </div>
              <ul className="space-y-1 text-gray-700">
                {order.orderItems.map((item, idx) => (
                  <li key={`${order._id}-${idx}`}>
                    {item.quantity} x {item.name}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-semibold text-gray-800">Total: ${order.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
