// frontend/src/components/HabitItem.jsx
import '../styles/List.css';

export default function HabitItem({ habit, isCompletedToday, onToggle, onEdit }) {
    return (
        <div className={`habit-card ${isCompletedToday ? 'completed' : ''} ${habit.type === 'bad' ? 'bad-habit-card' : 'good-habit-card'}`}>

            {/* 🌟 Eye-Catching Color Accent on the left edge */}
            <div className="card-accent"></div>

            {/* The Check/Undo Button */}
            <button
                className={`toggle-action-btn ${isCompletedToday ? 'undo' : 'complete'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle(habit._id);
                }}
                title={isCompletedToday ? "Undo completion" : "Mark as complete"}
            >
                {isCompletedToday ? '✔' : ''}
            </button>

            {/* The Habit Details */}
            <div className="habit-details" onClick={() => onEdit(habit)}>

                {/* ROW 1: Title & Badges */}
                <div className="habit-header">
                    <span className="habit-title">{habit.name}</span>
                    <div className="badge-group">
                        {habit.type === 'bad' && <span className="badge bad-habit">Bad Habit</span>}
                        {habit.area && <span className="badge area-badge">{habit.area}</span>}
                    </div>
                </div>

                {/* ROW 2: Primary Metadata (Goal, Repeat) */}
                <div className="habit-metadata">
                    <span className="meta-pill meta-goal">
                        🎯 {habit.goalCount} {habit.goalUnit} {habit.goalPeriod}
                    </span>

                    <span className="meta-pill meta-repeat">
                        🔁 {habit.repeatFrequency}
                        {habit.repeatDays?.length > 0 && !habit.repeatDays.includes('Every Day')
                            ? ` (${habit.repeatDays.join(', ')})`
                            : ''}
                    </span>
                </div>

                {/* ROW 3: Extra details (Reminders, Checklists, Dates) */}
                {(habit.reminders?.length > 0 || habit.checklists?.length > 0 || habit.endDate) && (
                    <div className="habit-extra">
                        {habit.reminders?.length > 0 && (
                            <span className="meta-chip">🔔 {habit.reminders.join(', ')}</span>
                        )}

                        {habit.checklists?.length > 0 && (
                            <span className="meta-chip">☑️ {habit.checklists.length} sub-tasks</span>
                        )}

                        {habit.endCondition === 'On a Date' && habit.endDate && (
                            <span className="meta-chip">⏳ Ends: {new Date(habit.endDate).toLocaleDateString()}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
