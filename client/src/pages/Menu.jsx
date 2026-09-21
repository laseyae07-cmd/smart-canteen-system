import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <div className="mt-20 text-center text-xl font-semibold">Loading menu...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">Today's Menu</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:shadow-lg"
          >
            <img src={item.imageUrl} alt={item.name} className="h-48 w-full object-cover" />
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                <span className="rounded bg-green-100 px-2 py-1 text-sm font-bold text-green-800">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <p className="mb-2 text-sm text-gray-500">{item.category}</p>
              <p className="mb-4 text-sm text-gray-600">{item.description}</p>

              <button
                onClick={() => addItem({ name: item.name, price: item.price, menuItem: item._id })}
                className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;