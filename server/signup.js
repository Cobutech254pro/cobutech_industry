// backend/signup.js
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating verification codes
const path = require('path'); // Import the 'path' module

const router = express.Router();
let cobutechDB; // Database instance (will be set in server.js)

// Middleware to ensure database connection is established
router.use(async (req, res, next) => {
  if (!cobutechDB) {
    return res.status(500).json({ message: 'Database connection not established.' });
  }
  next();
});

// Signup API endpoint
router.post('/api/auth/signup', async (req, res) => {
  try {
    const usersCollection = cobutechDB.collection('users');
    const { email, name, password } = req.body;

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(20).toString('hex'); // Generate a unique verification code
    const verificationCodeExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // Expires in 30 minutes (adjust as needed)

    const newUser = {
      email,
      name,
      password: hashedPassword,
      isVerified: false, // Initially false
      verificationCode: verificationCode,
      verificationCodeExpiresAt: verificationCodeExpiresAt
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

// Export the router and a function to set the database instance
module.exports = {
  router: router,
  setDatabase: (db) => {
    cobutechDB = db;
  },
};
