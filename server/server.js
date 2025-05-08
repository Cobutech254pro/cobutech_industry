// backend/server.js
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating verification codes

const app = express();
const port = 5000;

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
        return client.db('cobutech');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

// Signup API endpoint
app.post('/api/auth/signup', async (req, res) => {
    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
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
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
