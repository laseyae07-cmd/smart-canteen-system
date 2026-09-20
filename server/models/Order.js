const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // The user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Array of items in the order
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);