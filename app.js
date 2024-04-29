// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// MongoDB connection 
const mongoUrl = process.env.MONGO_URI; // Connection string from .env
const dbName = 'CarShop'; // Database name
const collectionName = 'cars'; // Collection name


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);


app.get('/', async (req, res) => {
    try {
        // Connect MongoDB
        const client = new MongoClient(mongoUrl);

        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch info from collection
        const result = await collection.find({}).toArray();

        // render index.html
        res.render('index', { documents: result });

        // Close connection to MongoDB
        await client.close();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});