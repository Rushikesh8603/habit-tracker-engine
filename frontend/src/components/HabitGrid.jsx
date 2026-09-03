// frontend/src/components/HabitGrid.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddHabitModal from './AddHabitModal';
import HabitItem from './HabitItem';
import '../styles/List.css'; 

// 1. ADDED PROPS: Defaults to 'all' if nothing is passed
export default function HabitGrid({ timeFilter = 'all' }) {
    const [habits, setHabits] = useState([]);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('good'); 
    const [editingHabit, setEditingHabit] = useState(null);

    // Get today's date safely at the top!
    const today = new Date().toLocaleDateString('en-CA'); 

    // Fetch habits from backend on load
    const fetchHabits = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + '/api/habits');
            setHabits(response.data);
        } catch (error) {
            console.error("Failed to load habits", error);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    // Modal Handlers
    const openAddModal = (type) => {
        setModalType(type);
        setEditingHabit(null); 
        setIsModalOpen(true);
    };

    const openEditModal = (habit) => {
        setModalType(habit.type);
        setEditingHabit(habit); 
        setIsModalOpen(true);
    };

    const closeModalAndRefresh = () => {
        setIsModalOpen(false);
        fetchHabits(); 
    };

    // Toggle Complete/Undo
    const handleToggle = async (id) => {
        try {
            await axios.put(
                `/api/habits/${id}/toggle`, 
                { date: today }, 
               
            );
            fetchHabits(); 
        } catch (error) {
            console.error("Failed to toggle habit", error);
        }
    };

    // ==========================================
    // FILTERING LOGIC
    // ==========================================

    // 1. Filter by Time of Day (Morning, Afternoon, Evening, All)
    const displayHabits = habits.filter(habit => {
        if (timeFilter === 'all') return true; 
        if (timeFilter === 'morning') return habit.timeOfDay?.morning;
        if (timeFilter === 'afternoon') return habit.timeOfDay?.afternoon;
        if (timeFilter === 'evening') return habit.timeOfDay?.evening;
        return true;
    });

    // 2. Split habits into Pending and Completed arrays 
    // (Notice the `?.` which prevents the app from crashing!)
    const completedHabits = displayHabits.filter(h => h.completedDates?.includes(today));
    const pendingHabits = displayHabits.filter(h => !h.completedDates?.includes(today));

    // 3. Dynamic Section Title
    const sectionTitle = timeFilter === 'all' 
        ? 'To Do Today' 
        : `To Do Today (${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)})`;

    return (
        <div className="list-view-container">
            
            {/* ADD ACTIONS GROUP */}
            <div className="add-actions-group">
                <div className="add-habit-trigger" onClick={() => openAddModal('good')}>
                    <span className="plus-icon">+</span> Add habit
                </div>
                <div className="add-habit-trigger bad-habit" onClick={() => openAddModal('bad')}>
                    <span className="plus-icon">−</span> Break bad habit
                </div>
            </div>

            {/* PENDING HABITS SECTION */}
            <div className="habit-section">
                <h3>{sectionTitle}</h3>
                {pendingHabits.length === 0 ? <p>All caught up!</p> : pendingHabits.map(habit => (
                    <HabitItem 
                        key={habit._id} 
                        habit={habit} 
                        isCompletedToday={false} 
                        onToggle={handleToggle}
                        onEdit={openEditModal}
                    />
                ))}
            </div>

            {/* COMPLETED HABITS SECTION */}
            <div className="habit-section">
                <h3>Completed</h3>
                {completedHabits.length === 0 ? <p>No completed habits yet.</p> : completedHabits.map(habit => (
                    <HabitItem 
                        key={habit._id} 
                        habit={habit} 
                        isCompletedToday={true} 
                        onToggle={handleToggle}
                        onEdit={openEditModal}
                    />
                ))}
            </div>

            {/* THE MODAL */}
            {isModalOpen && (
                <AddHabitModal 
                    onClose={closeModalAndRefresh} 
                    habitType={modalType} 
                    existingHabit={editingHabit} 
                />
            )}
        </div>
    );
}


