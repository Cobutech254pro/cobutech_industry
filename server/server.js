require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating verification codes
const path = require('path'); // Import the 'path' module

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
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectDB().catch(console.error); // Connect to the database when the server starts

// Signup API endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    if (!cobutechDB) {
      return res.status(500).json({ message: 'Database connection not established.' });
    }
    const usersCollection = cobutechDB.collection('users');
    const { email, name, password } = req.body;

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(20).toString('hex'); // Generate a unique verification code

    const newUser = {
      email,
      name,
      password: hashedPassword,
      isVerified: false, // Initially false
      verificationCode: verificationCode
    };

    const result = await usersCollection.insertOne(newUser);

    if (result.insertedId) {
      // TODO: Implement email sending logic here using Nodemailer
      // Send an email to the user with a link containing the verificationCode
      console.log(`Verification link would be: http://yourdomain.com/api/auth/verify/${verificationCode}`);
      res.status(201).json({ message: 'User created successfully. Please check your email to verify your account.' });
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }

  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// TODO: Implement the /api/auth/login endpoint here

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
