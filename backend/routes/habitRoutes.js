// backend/routes/habitRoutes.js
const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit')
const jwt = require('jsonwebtoken');



// 1. CREATE THE MIDDLEWARE (The Bouncer)
const authenticateToken = (req, res, next) => {
    // Look for the "Bearer eyJhbGci..." token in the headers React sent
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer" from the token

    // If no token exists, kick them out
    if (!token) return res.status(401).json({ message: "Access Denied. Please log in." });

    // Verify the token is real and hasn't expired (using your secret key)
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json({ message: "Token expired or invalid." });
        
        // Success! Attach the user's ID to the request so we know who is saving the habit
        req.user = decodedUser; 
        next(); // Tell Express to move on to the actual route below
    });
};


// backend/routes/habitRoutes.js

// ==========================================
// 5. UPDATE: Edit full habit details
// ==========================================
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        // Ensure the habit actually belongs to the user trying to edit it
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
        
        if (!habit) {
            return res.status(404).json({ message: "Habit not found or unauthorized" });
        }

        // Update the habit with the new data from React (req.body)
        const updatedHabit = await Habit.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true } // Returns the newly updated document instead of the old one
        );

        res.json({ message: "Habit updated!", habit: updatedHabit });
    } catch (err) {
        console.error("❌ Error updating habit:", err);
        res.status(500).json({ message: "Failed to update habit" });
    }
});


// ==========================================
// READ: Fetch all habits for the logged-in user
// ==========================================
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Find ONLY the habits that belong to the logged-in user
        const habits = await Habit.find({ userId: req.user.id });
        res.json(habits);
        console.log('giving habibit data to forntend ')
    } catch (err) {
        console.error("❌ Error fetching habits:", err);
        res.status(500).json({ message: err.message });
    }
});






router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log(`📥 Received new habit data from user ID: ${req.user.id}`);

    // 1. COMBINE the React data (req.body) with the Secure User ID (req.user.id)
    const habitData = {
        ...req.body,
        userId: req.user.id // This is required by your Mongoose Schema!
    };

    // 2. Create the database entry using the combined data
    const newHabit = new Habit(habitData);

    // 3. Save it permanently to MongoDB
    const savedHabit = await newHabit.save();

    // 4. Send a success message back to React
    res.status(201).json({ message: "Habit saved successfully!", habit: savedHabit });

  } catch (error) {
    console.error("❌ Error saving habit:", error);
    // Pro-tip: send back the actual error message to help you debug in the future
    res.status(500).json({ error: error.message || "Failed to save habit" });
  }
});


// ==========================================
// TOGGLE: Mark Habit as Complete or Undo
// ==========================================
router.put('/:id/toggle', authenticateToken, async (req, res) => {
    // React will send today's date in the request body
    const { date } = req.body; 
    
    try {
        // 1. Find the habit (and make sure it belongs to this specific user!)
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
        if (!habit) return res.status(404).json({ message: "Habit not found" });

        // 2. The Complete / Undo Logic:
        if (habit.completedDates.includes(date)) {
            // UNDO: If the date is already there, filter it out (remove it)
            habit.completedDates = habit.completedDates.filter(d => d !== date);
        } else {
            // COMPLETE: If the date is missing, push it in (add it)
            habit.completedDates.push(date);
        }
        
        // 3. Save the changes to MongoDB
        const updatedHabit = await habit.save();
        res.json(updatedHabit);
        
    } catch (err) {
        console.error("❌ Error toggling habit:", err);
        res.status(500).json({ message: err.message });
    }
});

// backend/routes/habitRoutes.js

// ==========================================
// 6. DELETE: Remove a habit completely
// ==========================================
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        // Find the habit by ID and ensure it belongs to the logged-in user before deleting
        const deletedHabit = await Habit.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!deletedHabit) {
            return res.status(404).json({ message: "Habit not found or unauthorized" });
        }

        res.json({ message: "Habit deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting habit:", err);
        res.status(500).json({ message: "Failed to delete habit" });
    }
});






module.exports = router;
