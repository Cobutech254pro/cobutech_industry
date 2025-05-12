// backend/verification.js
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
let cobutechDB; // Database instance (will be set in server.js)

// Middleware to ensure database connection is established
router.use(async (req, res, next) => {
  if (!cobutechDB) {
    return res.status(500).json({ message: 'Database connection not established.' });
  }
  next();
});

// Verify API endpoint
router.post('/api/auth/verify/:verificationCode', async (req, res) => {
  try {
    const usersCollection = cobutechDB.collection('users');
    const { verificationCode } = req.params;

    const user = await usersCollection.findOne({ verificationCode: verificationCode });

    if (!user) {
      return res.status(404).json({ message: 'Invalid verification link.' });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'Account already verified.' });
    }

    if (new Date(user.verificationCodeExpiresAt) < new Date()) {
      return res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });
    }

    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { isVerified: true }, $unset: { verificationCode: 1, verificationCodeExpiresAt: 1 } }
    );

    res.status(200).json({ message: 'Account verified successfully!' });
    // TODO: Redirect the user to the account/userhtml directory (frontend logic)
    console.log('Account verified successfully! (Backend)');

  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ message: 'Internal server error during verification.' });
  }
});

// Export the router and a function to set the database instance
module.exports = {
  router: router,
  setDatabase: (db) => {
    cobutechDB = db;
  },
};
