const express = require('express');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env then override with .env.local when present (keeps secrets local)
dotenv.config();
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
}
const authRoutes = require('./routes/auth');

const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');
const { protect, admin } = require('./middleware/authMiddleware');
const Order = require('./models/Order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route Middleware
app.use('/api/auth', authRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Canteen API is online!' });
});

// --- MENU ROUTES ---

// GET /api/menu - Public: Anyone can view the menu
app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching menu items' });
  }
});

// POST /api/menu - Protected + Admin: Only logged-in staff can add items
app.post('/api/menu', protect, admin, async (req, res) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- ORDER ROUTES ---

// POST /api/orders - Protected: Only logged-in users can place an order
app.post('/api/orders', protect, async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    const order = await Order.create({
      user: req.user.id, // We get this ID from the token via the protect middleware!
      orderItems,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// GET /api/orders - Protected + Admin: Only staff can view ALL orders for the kitchen dashboard
app.get('/api/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// PUT /api/orders/:id/status - Protected + Admin: Update an order status from the kitchen dashboard
app.put('/api/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
(async () => {
  const conn = await connectDB();
  if (!conn) {
    console.warn('Proceeding without a database connection. Some endpoints may fail.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();