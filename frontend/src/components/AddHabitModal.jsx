// frontend/src/components/AddHabitModal.jsx
import { useState } from 'react';
import BreakBadHabit from './BreakBadHabit';
import '../styles/Modal.css';


import axios from 'axios';

export default function AddHabitModal({ onClose, habitType, existingHabit }) {



    const [formData, setFormData] = useState({
        // Use existing data if available, otherwise use defaults
        name: existingHabit?.name || '',
        type: existingHabit?.type || habitType,
        repeatFrequency: existingHabit?.repeatFrequency || 'Daily',
        repeatDays: existingHabit?.repeatDays || ['Every Day'],
        goalCount: existingHabit?.goalCount || 1,
        goalUnit: existingHabit?.goalUnit || 'times',
        goalPeriod: existingHabit?.goalPeriod || 'per day',
        timeOfDay: existingHabit?.timeOfDay || { morning: true, afternoon: true, evening: true },
        startDate: existingHabit?.startDate || new Date().toISOString().split('T')[0],
        endCondition: existingHabit?.endCondition || 'Never',
        endDate: existingHabit?.endDate || '',
        reminders: existingHabit?.reminders || [],
        area: existingHabit?.area || '',
        checklists: existingHabit?.checklists || [],

        // These are just for the UI inputs, they don't need existing data
        newReminderInput: '',
        customAreaInput: '',
        newChecklistInput: ''
    });






    const [isRepeatDropdownOpen, setIsRepeatDropdownOpen] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const toggleTimeOfDay = (time) => setFormData({
        ...formData,
        timeOfDay: { ...formData.timeOfDay, [time]: !formData.timeOfDay[time] }
    });

    // Action: Cycle through magic fill ideas
    const handleMagicFill = () => {
        const ideas = ['Complete 2 LeetCode Problems', 'Read 10 Pages', '7-Hour Deep Work', 'Workout for 45 Mins', 'Review Business Strategy'];
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
        setFormData({ ...formData, name: randomIdea });
    };

    // Action: Handle List Additions (Reminders & Checklists)
    const handleAddList = (e, listName, inputName) => {
        if (e.key === 'Enter' && formData[inputName]) {
            setFormData({
                ...formData,
                [listName]: [...formData[listName], formData[inputName]],
                [inputName]: ''
            });
        }
    };

    const removeListItem = (listName, itemToRemove) => {
        setFormData({
            ...formData,
            [listName]: formData[listName].filter(item => item !== itemToRemove)
        });
    };

    // Action: Perfectly handles selecting specific days
    const toggleDay = (day) => {
        let newDays = [...formData.repeatDays];

        // If 'Every Day' was selected, clear it out first
        if (newDays.includes('Every Day')) newDays = [];

        if (newDays.includes(day)) {
            newDays = newDays.filter(d => d !== day); // Remove if already selected
        } else {
            newDays.push(day); // Add if not selected
        }

        // If they selected all 7 days manually, or none at all, default back to Every Day
        if (newDays.length === 7 || newDays.length === 0) {
            newDays = ['Every Day'];
        }

        setFormData({ ...formData, repeatDays: newDays });
    };

    // 1. Add this state to track the message and its type (success or error)
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    const handleSave = async () => {
        setStatusMessage({ text: 'Saving...', type: 'info' });

        try {
            // 1. Prepare the exact data we want to send to the backend
            const dataToSend = { ...formData };

            // Fix the Custom Area Bug: If they chose "Custom", swap in what they actually typed
            if (dataToSend.area === 'Custom') {
                dataToSend.area = dataToSend.customAreaInput;
            }

            // 2. Check if we are Updating (PUT) or Creating (POST)
            if (existingHabit) {
                // We are EDITING an existing habit
                await axios.put(
                    `/api/habits/${existingHabit._id}`,
                    dataToSend,
                   
                );
                setStatusMessage({ text: 'Habit updated successfully! 🎉', type: 'success' });
            } else {
                // We are CREATING a new habit
                await axios.post(
                    import.meta.env.VITE_API_URL + '/api/habits',
                    dataToSend,
                   
                );
                setStatusMessage({ text: 'Habit saved successfully! 🎉', type: 'success' });
            }

            // 3. Wait 1.5 seconds so they can read it, THEN close the modal
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error) {
            console.error("❌ Error:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to save habit.";
            setStatusMessage({ text: errorMessage, type: 'error' });
        }
    };


    const handleDelete = async () => {
        // 1. Ask for confirmation so they don't accidentally delete it!
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this habit?");
        if (!confirmDelete) return;

        setStatusMessage({ text: 'Deleting...', type: 'info' });

        try {
            // 2. Send the DELETE request to your Express backend
            await axios.delete(
                `/api/habits/${existingHabit._id}`,
               
            );

            // 3. Instantly close the modal (which triggers a refresh in HabitGrid)
            onClose();

        } catch (error) {
            console.error("❌ Error deleting habit:", error);
            setStatusMessage({ text: "Failed to delete habit.", type: 'error' });
        }
    };



    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>

                {/* Cleaned up header tabs */}
                <div className="modal-tabs">
                    <span className="tab active" style={{ flex: 1, textAlign: 'center', cursor: 'default' }}>
                        {habitType === 'bad' ? 'Break Bad Habit' : 'Create New Habit'}
                    </span>
                </div>

                {habitType === 'bad' && !existingHabit ? (
                    <BreakBadHabit onClose={onClose} />
                ) : habitType === 'bad' && existingHabit ? (
                    <BreakBadHabit
                        existingHabit={existingHabit}
                        onClose={onClose}
                        onDelete={handleDelete}
                    />
                )
                    // Good habit form...
                    : (
                        <>
                            <div className="modal-body">
                                {/* Main Input - Removed "?" and upgraded Magic Fill */}
                                <div className="form-row main-input-row">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter Habit Name"
                                        className="habit-name-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoFocus
                                        style={{ paddingLeft: '0' }}
                                    />
                                    <span className="magic-fill" onClick={handleMagicFill}>✨ Magic Fill</span>
                                </div>

                                {/* Advanced Repeat Dropdown */}
                                <div className="form-row">
                                    <label>🔁 Repeat</label>
                                    <div className="input-group">
                                        <select name="repeatFrequency" className="styled-select" value={formData.repeatFrequency} onChange={handleChange}>
                                            <option value="Daily">Daily</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="Monthly">Monthly</option>
                                        </select>

                                        <div className="custom-dropdown-container">
                                            <div className="styled-select custom-dropdown-trigger" onClick={() => setIsRepeatDropdownOpen(!isRepeatDropdownOpen)}>
                                                {formData.repeatDays.length > 0 ? formData.repeatDays.join(', ') : 'Select Days'}
                                            </div>
                                            {isRepeatDropdownOpen && (
                                                <div className="custom-dropdown-menu">
                                                    <label className="dropdown-item">
                                                        <input type="checkbox" checked={formData.repeatDays.includes('Every Day')} onChange={() => setFormData({ ...formData, repeatDays: ['Every Day'] })} /> Every Day
                                                    </label>
                                                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                                        <label key={day} className="dropdown-item">
                                                            <input type="checkbox" checked={formData.repeatDays.includes(day)} onChange={() => toggleDay(day)} /> {day}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Goal - Added Missing Dropdown Options */}
                                <div className="form-row">
                                    <label>🎯 Goal</label>
                                    <div className="input-group">
                                        <input type="number" name="goalCount" className="number-input" value={formData.goalCount} onChange={handleChange} min="1" />
                                        <select name="goalUnit" className="styled-select" value={formData.goalUnit} onChange={handleChange}>
                                            <option value="times">times</option>
                                            <option value="minutes">minutes</option>
                                            <option value="hours">hours</option>
                                            <option value="pages">pages</option>
                                            <option value="km">km</option>
                                        </select>
                                        <select name="goalPeriod" className="styled-select" value={formData.goalPeriod} onChange={handleChange}>
                                            <option value="per day">per day</option>
                                            <option value="per week">per week</option>
                                            <option value="per month">per month</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Time of Day */}
                                <div className="form-row">
                                    <label>☀️ Time of Day</label>
                                    <div className="chip-group">
                                        <div className={`time-chip ${formData.timeOfDay.morning ? 'active' : ''}`} onClick={() => toggleTimeOfDay('morning')}>Morning</div>
                                        <div className={`time-chip ${formData.timeOfDay.afternoon ? 'active' : ''}`} onClick={() => toggleTimeOfDay('afternoon')}>Afternoon</div>
                                        <div className={`time-chip ${formData.timeOfDay.evening ? 'active' : ''}`} onClick={() => toggleTimeOfDay('evening')}>Evening</div>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div className="form-row">
                                    <label>📅 Start Date</label>
                                    <input type="date" name="startDate" className="styled-input date-input" value={formData.startDate} onChange={handleChange} />
                                </div>

                                {/* End Condition */}
                                <div className="form-row">
                                    <label>🚫 End Condition</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                        <select name="endCondition" className="styled-select full-select" value={formData.endCondition} onChange={handleChange}>
                                            <option value="Never">Never</option>
                                            <option value="On a Date">On a Date</option>
                                        </select>
                                        {formData.endCondition === 'On a Date' && (
                                            <input type="date" name="endDate" className="styled-input date-input" value={formData.endDate} onChange={handleChange} />
                                        )}
                                    </div>
                                </div>

                                {/* Reminders */}
                                <div className="form-row">
                                    <label>🔔 Reminders</label>
                                    <div className="reminder-box">
                                        {formData.reminders.map((time, index) => (
                                            <span key={index} className="active-reminder">🕒 {time} <strong onClick={() => removeListItem('reminders', time)}>✕</strong></span>
                                        ))}
                                        <input type="time" name="newReminderInput" className="borderless-input" value={formData.newReminderInput} onChange={handleChange} onKeyDown={(e) => handleAddList(e, 'reminders', 'newReminderInput')} />
                                    </div>
                                </div>

                                {/* Area - Added more options and custom text input logic */}
                                <div className="form-row">
                                    <label>📁 Area</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                        <select name="area" className="styled-select full-select" value={formData.area} onChange={handleChange}>
                                            <option value="" disabled>Select area</option>
                                            <option value="Technical Prep">Technical Prep</option>
                                            <option value="Health & Fitness">Health & Fitness</option>
                                            <option value="Business Strategy">Business Strategy</option>
                                            <option value="Mindset & Routine">Mindset & Routine</option>
                                            <option value="Custom">Custom Area...</option>
                                        </select>

                                        {/* Shows up ONLY if they select "Custom Area..." */}
                                        {formData.area === 'Custom' && (
                                            <input
                                                type="text"
                                                name="customAreaInput"
                                                placeholder="Type your custom area..."
                                                className="styled-input"
                                                value={formData.customAreaInput}
                                                onChange={handleChange}
                                                autoFocus
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Checklist */}
                                <div className="form-row">
                                    <label>☑️ Checklist</label>
                                    <div className="reminder-box" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                        {formData.checklists.map((item, index) => (
                                            <div key={index} className="checklist-item">
                                                <span>• {item}</span> <strong onClick={() => removeListItem('checklists', item)}>✕</strong>
                                            </div>
                                        ))}
                                        <input type="text" name="newChecklistInput" placeholder="Add New Checklist (Press Enter)" className="borderless-input" value={formData.newChecklistInput} onChange={handleChange} onKeyDown={(e) => handleAddList(e, 'checklists', 'newChecklistInput')} />
                                    </div>
                                </div>

                            </div>


                            {/* Add this inside your modal body, perhaps right before the footer */}
                            {statusMessage.text && (
                                <div
                                    style={{
                                        padding: '10px',
                                        marginTop: '10px',
                                        borderRadius: '5px',
                                        textAlign: 'center',
                                        backgroundColor: statusMessage.type === 'error' ? '#ffe6e6' : '#e6ffe6',
                                        color: statusMessage.type === 'error' ? '#cc0000' : '#006600',
                                        border: `1px solid ${statusMessage.type === 'error' ? '#cc0000' : '#006600'}`
                                    }}
                                >
                                    {statusMessage.text}
                                </div>
                            )}

                            <div className="modal-footer">
                                {/* CHANGED FOOTER: Now includes a Delete button if existingHabit is true */}
                                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

                                    {/* Left Side: Delete Button (Only shows when editing) */}
                                    <div className="footer-left">
                                        {existingHabit && (
                                            <button
                                                className="btn-delete"
                                                onClick={handleDelete}
                                                style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                🗑️ Delete Habit
                                            </button>
                                        )}
                                    </div>

                                    {/* Right Side: Cancel & Save Buttons */}
                                    <div className="footer-right" style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn-cancel" onClick={onClose}>Cancel</button>
                                        <button
                                            className={`btn-save ${formData.name ? 'ready' : ''}`}
                                            disabled={!formData.name}
                                            onClick={handleSave}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
            </div>
        </div>
    );
}

