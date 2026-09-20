const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not defined. Skipping DB connection.');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;