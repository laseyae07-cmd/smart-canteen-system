const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevents two users from registering with the same email
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'staff'], // Only these two roles are allowed
      default: 'student',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);