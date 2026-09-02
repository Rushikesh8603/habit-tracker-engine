// frontend/src/components/BreakBadHabit.jsx
import { useState } from 'react';
import axios from 'axios';

export default function BreakBadHabit({ onClose, existingHabit, onDelete }) {
  // Determine initial mode: If goalCount is 0, default to 'Quit', otherwise 'Limit'
  const initialMode = existingHabit ? (existingHabit.goalCount === 0 ? 'Quit' : 'Limit') : 'Limit';
  const [mode, setMode] = useState(initialMode);
  
  const [formData, setFormData] = useState({
    name: existingHabit?.name || '',
    goalCount: existingHabit?.goalCount !== undefined && existingHabit?.goalCount !== 0 ? existingHabit.goalCount : 1,
    goalUnit: existingHabit?.goalUnit || 'times',
    goalPeriod: existingHabit?.goalPeriod || 'per day',
    startDate: existingHabit?.startDate 
      ? new Date(existingHabit.startDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  });

  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [isHoveredDelete, setIsHoveredDelete] = useState(false);
  const [isHoveredCancel, setIsHoveredCancel] = useState(false);
  const [isHoveredSave, setIsHoveredSave] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setStatusMessage({ text: 'Saving...', type: 'info' });

    try {
      const dataToSend = {
        ...formData,
        type: 'bad',
        goalCount: mode === 'Quit' ? 0 : Number(formData.goalCount),
      };

      if (existingHabit) {
        // Edit existing bad habit
        await axios.put(
          `http://localhost:5001/api/habits/${existingHabit._id}`, 
          dataToSend, 
          { withCredentials: true }
        );
      } else {
        // Create new bad habit
        await axios.post(
          'http://localhost:5001/api/habits', 
          dataToSend, 
          { withCredentials: true }
        );
      }

      onClose();
    } catch (error) {
      console.error("❌ Error saving bad habit:", error);
      const errorMsg = error.response?.data?.message || "Failed to save habit.";
      setStatusMessage({ text: errorMsg, type: 'error' });
    }
  };

  return (
    <>
      <div className="modal-body">
        {/* Main Input Row with Toggle */}
        <div className="form-row main-input-row bad-habit-header">
          <input 
            type="text" 
            name="name"
            placeholder="e.g., Late Night Snacking" 
            className="habit-name-input" 
            value={formData.name}
            onChange={handleChange}
            autoFocus 
          />
          {/* Quit / Limit Toggle with Light Pastel Styling */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            gap: '4px',
            border: '1px solid #e2e8f0'
          }}>
            <button 
              type="button"
              onClick={() => setMode('Quit')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: mode === 'Quit' ? '#ffffff' : 'transparent',
                color: mode === 'Quit' ? '#e11d48' : '#64748b',
                boxShadow: mode === 'Quit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Quit
            </button>
            <button 
              type="button"
              onClick={() => setMode('Limit')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: mode === 'Limit' ? '#ffffff' : 'transparent',
                color: mode === 'Limit' ? '#d97706' : '#64748b',
                boxShadow: mode === 'Limit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Goal Row (Only shows if Limit is selected) */}
        {mode === 'Limit' && (
          <div className="form-row">
            <label className="stacked-label">
              <div className="label-main">🎯 Limit</div>
              <div className="label-sub">No more than</div>
            </label>
            <div className="input-group">
              <input 
                type="number" 
                name="goalCount" 
                className="number-input" 
                value={formData.goalCount} 
                onChange={handleChange} 
                min="1" 
              />
              <select name="goalUnit" className="styled-select" value={formData.goalUnit} onChange={handleChange}>
                <option value="times">times</option>
                <option value="cigarettes">cigarettes</option>
                <option value="drinks">drinks</option>
                <option value="hours">hours</option>
                <option value="minutes">minutes</option>
              </select>
              <select name="goalPeriod" className="styled-select" value={formData.goalPeriod} onChange={handleChange}>
                <option value="per day">per day</option>
                <option value="per week">per week</option>
              </select>
            </div>
          </div>
        )}

        {/* Start Date */}
        <div className="form-row">
          <label>📅 Start Date</label>
          <input 
            type="date" 
            name="startDate" 
            className="styled-input date-input" 
            value={formData.startDate} 
            onChange={handleChange} 
          />
        </div>

        {/* Status Message */}
        {statusMessage.text && (
          <div style={{
            padding: '8px 12px',
            marginTop: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '13px',
            backgroundColor: statusMessage.type === 'error' ? '#fff1f2' : '#f0fdf4',
            color: statusMessage.type === 'error' ? '#be123c' : '#15803d',
            border: `1px solid ${statusMessage.type === 'error' ? '#fecdd3' : '#bbf7d0'}`
          }}>
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* Modal Footer with Light Themed Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: '#fafafa',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px'
      }}>
        {/* Left Side: Delete Habit Button */}
        <div>
          {existingHabit && (
            <button
              type="button"
              onClick={onDelete}
              onMouseEnter={() => setIsHoveredDelete(true)}
              onMouseLeave={() => setIsHoveredDelete(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid #fecdd3',
                backgroundColor: isHoveredDelete ? '#ffe4e6' : '#fff1f2',
                color: '#e11d48',
                transition: 'all 0.2s ease',
                boxShadow: isHoveredDelete ? '0 2px 4px rgba(225, 29, 72, 0.08)' : 'none'
              }}
            >
              🗑️ Delete Habit
            </button>
          )}
        </div>

        {/* Right Side: Cancel and Save */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            onMouseEnter={() => setIsHoveredCancel(true)}
            onMouseLeave={() => setIsHoveredCancel(false)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              border: '1px solid #e2e8f0',
              backgroundColor: isHoveredCancel ? '#f1f5f9' : '#ffffff',
              color: '#475569',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!formData.name}
            onMouseEnter={() => setIsHoveredSave(true)}
            onMouseLeave={() => setIsHoveredSave(false)}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: formData.name ? 'pointer' : 'not-allowed',
              border: '1px solid',
              borderColor: formData.name ? '#fca5a5' : '#e2e8f0',
              backgroundColor: formData.name 
                ? (isHoveredSave ? '#ffe4e6' : '#fff1f2') 
                : '#f8fafc',
              color: formData.name ? '#e11d48' : '#94a3b8',
              opacity: formData.name ? 1 : 0.6,
              transition: 'all 0.2s ease',
              boxShadow: formData.name && isHoveredSave ? '0 2px 6px rgba(225, 29, 72, 0.12)' : 'none'
            }}
          >
            {existingHabit ? 'Update Habit' : 'Save Habit'}
          </button>
        </div>
      </div>
    </>
  );
}


