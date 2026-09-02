// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true } // This will hold the scrambled hash, NOT the real password
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


