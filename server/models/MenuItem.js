const mongoose = require('mongoose');

// Schema defines the structure and rules for a menu item in our database
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter the item name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter the price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Mains', 'Snacks', 'Beverages', 'Desserts'], // Restricts value to these categories
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);