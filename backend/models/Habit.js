// backend/models/Habit.js
const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['good', 'bad'],  required: true },
    
    // Add the new fields from your React formData:
    repeatFrequency: { type: String, default: 'Daily' },
    repeatDays: [{ type: String }], 
    goalCount: { type: Number, default: 1 },
    goalUnit: { type: String, default: 'times' },
    goalPeriod: { type: String, default: 'per day' },
    
    timeOfDay: {
        morning: { type: Boolean, default: true },
        afternoon: { type: Boolean, default: true },
        evening: { type: Boolean, default: true }
    },
    
    startDate: { type: String },
    endCondition: { type: String, default: 'Never' },
    endDate: { type: String },
    reminders: [{ type: String }],
    area: { type: String },
    checklists: [{ type: String }],
    
    // Keeps track of the dates the user clicked "Complete"
    completedDates: [{ type: String }] 
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);

