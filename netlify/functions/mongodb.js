const mongoose = require('mongoose');

let isConnected = false; // Flag to track connection state

const handler = async (event, context) => {
  // Ensure the function doesn't time out during async operations
  context.callbackWaitsForEmptyEventLoop = false;

  // MongoDB connection URI from environment variables
  const mongoUri = process.env.MONGODB_URI || 
    "mongodb+srv://dbUser:dbUserPassword@backenddb.8q78t.mongodb.net/api?retryWrites=true&w=majority&appName=BackendDB";

  if (!isConnected) {
    try {
      // Connect to MongoDB
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("Connected to database");
    } catch (error) {
      console.error("Connection failed:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to connect to the database" }),
      };
    }
  }

  // Example API response
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Serverless function connected to MongoDB!" }),
  };
};

module.exports = { handler };
