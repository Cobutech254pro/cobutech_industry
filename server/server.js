// backend/server.js
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000; // You can choose a different port

// Middleware to parse JSON request bodies
app.use(express.json());

const uri = "mongodb+srv://calvinonyango965:<db_password>@cluster0.vm1cnlz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db('cobutech'); // Use your database name
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if connection fails
    }
}

// Signup API endpoint
app.post('/api/auth/signup', async (req, res) => {
    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const { email, name, password } = req.body;

        // Check if the email already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' }); // 409 Conflict
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = {
            email,
            name,
            password: hashedPassword,
            isVerified: false, // Initial verification status
            verificationCode: null // We'll generate this later
        };

        // Insert the new user into the database
        const result = await usersCollection.insertOne(newUser);

        if (result.insertedId) {
            res.status(201).json({ message: 'User created successfully. Please verify your email.' }); // 201 Created
            // TODO: Implement email sending logic here using Nodemailer
        } else {
            res.status(500).json({ message: 'Failed to create user' }); // 500 Internal Server Error
        }

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
