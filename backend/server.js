// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();

// 1. CORS Configuration (Keep at the top of the middleware stack)
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// 2. Request Parsers
app.use(express.json());
app.use(cookieParser());

// 3. Database Connection
if (!process.env.MONGO_URI) {
    console.error('CRITICAL: MONGO_URI is not defined in your .env file');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' MongoDB Connected'))
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// 4. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));



// 5. Server Initialization
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server booting up on port ${PORT}...`);
});

