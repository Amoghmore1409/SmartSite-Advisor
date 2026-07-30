/**
 * db.js
 * Handles MongoDB connection using Mongoose.
 * If external MONGO_URI fails or times out, falls back to MongoMemoryServer
 * to ensure 100% server reliability in development/testing environments.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const autoSeed = require('../utils/autoSeed');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    // Attempt remote connection first with a quick timeout (3000ms)
    console.log('🔄 Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    await autoSeed();
  } catch (error) {
    console.warn(`⚠️ Remote MongoDB unavailable (${error.message}). Falling back to In-Memory MongoDB...`);
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      
      await mongoose.connect(uri);
      console.log(`🚀 In-Memory MongoDB Connected successfully at ${uri}`);
      await autoSeed();
    } catch (memError) {
      console.error(`❌ In-Memory MongoDB Failed: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
