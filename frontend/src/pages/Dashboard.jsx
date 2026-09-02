// frontend/src/pages/Dashboard.jsx


import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';
import HabitGrid from '../components/HabitGrid';

import ProgressDashboard from '../components/ProgressDashboard';

export default function Dashboard() {
    const { user, logout } = useAuth();

    // 1. The State: Tracks which sidebar item is currently active
    const [activeView, setActiveView] = useState('all'); // 'all', 'progress', 'morning', etc.

    // 2. The Traffic Cop: Decides what HTML to render based on the active state
    const renderContent = () => {
            if (activeView === 'progress') {
                return (
                    <ProgressDashboard />
                );
            }

            // If the view is all, morning, afternoon, or evening, use the HabitGrid!
            if (['all', 'morning', 'afternoon', 'evening'].includes(activeView)) {
                return <HabitGrid timeFilter={activeView} />;
            }
        };


    return (
        <div className="dashboard-container">

            {/* LEFT SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-profile">
                    <div className="profile-pic">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="profile-name">{user?.username || 'User'}</span>
                </div>

                <ul className="sidebar-menu">
                    <li className={`menu-item ${activeView === 'all' ? 'active' : ''}`} onClick={() => setActiveView('all')}>
                        <span>☰</span> All Habits
                    </li>
                    <li className={`menu-item ${activeView === 'progress' ? 'active' : ''}`} onClick={() => setActiveView('progress')}>
                        <span>📊</span> Progress
                    </li>
                </ul>

                <div className="sidebar-section-title">Time of Day</div>
                <ul className="sidebar-menu">
                    <li className={`menu-item ${activeView === 'morning' ? 'active' : ''}`} onClick={() => setActiveView('morning')}>
                        <span>🌤️</span> Morning
                    </li>
                    <li className={`menu-item ${activeView === 'afternoon' ? 'active' : ''}`} onClick={() => setActiveView('afternoon')}>
                        <span>☀️</span> Afternoon
                    </li>
                    <li className={`menu-item ${activeView === 'evening' ? 'active' : ''}`} onClick={() => setActiveView('evening')}>
                        <span>🌙</span> Evening
                    </li>
                </ul>

                <div className="sidebar-section-title">Preferences</div>
                <ul className="sidebar-menu">
                    <li className="menu-item logout-item" onClick={logout}>
                        <span>🚪</span> Log Out
                    </li>
                </ul>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="main-dashboard">
                <header className="dashboard-header">
                    {/* Dynamic Header Title */}
                    <h2 className="header-title">
                        {activeView === 'all' && 'All Habits'}
                        {activeView === 'progress' && 'Your Progress'}
                        {activeView === 'morning' && 'Morning Routine'}
                        {activeView === 'afternoon' && 'Afternoon Focus'}
                        {activeView === 'evening' && 'Evening Wind Down'}
                    </h2>

                </header>

                {/* SCROLLABLE CONTAINER */}
                <div className="scrollable-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

