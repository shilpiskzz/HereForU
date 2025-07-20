// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use('/api/entries', require('./routes/entries'));

const path = require('path');

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for SPA (single-page app)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes placeholder (we'll build this next)


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
