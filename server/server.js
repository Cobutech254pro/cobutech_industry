require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path'); // Import the 'path' module
const signupRoutes = require('./signup'); // Import the signup routes

const app = express();
const port = process.env.PORT || 5000; // Use environment port or default to 5000

app.use(express.json());

// Serve static files from the root directory (consider if your frontend is separate)
app.use(express.static(path.join(__dirname, '../')));

// Define a route for the root path to serve index.html (consider if your frontend is separate)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const uri = process.env.MONGODB_URI; // Use environment variable for MongoDB URI
let dbClient; // Store the MongoDB client instance
let cobutechDB; // Store the database instance

async function connectDB() {
  try {
    dbClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await dbClient.connect();
    console.log("Connected to MongoDB!");
    cobutechDB = dbClient.db('cobutech');
    // Set the database instance for the signup routes
    signupRoutes.setDatabase(cobutechDB);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectDB().catch(console.error); // Connect to the database when the server starts

// Use the signup routes
app.use('/', signupRoutes.router);

// TODO: Implement other API endpoints here (excluding login)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Close the MongoDB connection when the Node.js process exits
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...');
  if (dbClient) {
    await dbClient.close();
  }
  process.exit(0);
});
