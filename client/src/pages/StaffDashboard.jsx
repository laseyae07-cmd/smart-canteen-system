import { useEffect, useState } from 'react';
import axios from 'axios';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load staff dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-red-600">Staff Dashboard</h1>
      <p className="mt-2 text-gray-600">Manage incoming orders and kitchen workflow.</p>

      {loading ? (
        <p className="mt-6 text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
          No orders yet.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border p-5">
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Order #{order._id.slice(-6)}</h2>
                  <p className="text-sm text-gray-600">Customer: {order.user?.name || 'Customer'}</p>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                  {order.status}
                </span>
              </div>

              <ul className="mb-4 space-y-1 text-gray-700">
                {order.orderItems.map((item, idx) => (
                  <li key={`${order._id}-${idx}`}>
                    {item.quantity} x {item.name}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {['pending', 'preparing', 'ready', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order._id, status)}
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      order.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
