const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "TaskManager"
    });
    console.log(`MongoDB Connected: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB Connection Failed: ${err.message}`);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = connectDB;
