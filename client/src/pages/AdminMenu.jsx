import { useEffect, useState } from 'react';
import axios from 'axios';

const emptyForm = {
  name: '',
  description: '',
  category: 'Mains',
  price: '',
  imageUrl: '',
};

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMenu = async () => {
    try {
      const response = await axios.get('/api/menu');
      setItems(response.data);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };

      await axios.post('/api/menu', payload);
      setForm(emptyForm);
      setSuccess('Menu item added successfully.');
      fetchMenu();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add menu item.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      await axios.put(`/api/menu/${itemId}/availability`, {
        isAvailable: !currentStatus,
      });
      fetchMenu();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  return (
    <div className="space-y-8 rounded-2xl bg-white p-8 shadow-lg">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Menu Management</h1>
        <p className="mt-2 text-gray-600">Add new dishes and manage inventory availability.</p>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {success && (
        <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border bg-gray-50 p-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="Mains">Mains</option>
            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submitting ? 'Adding item...' : 'Add Item'}
          </button>
        </div>
      </form>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Current Menu</h2>

        {loading ? (
          <p className="text-gray-500">Loading menu...</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category} • ${item.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => toggleAvailability(item._id, item.isAvailable)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    item.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
