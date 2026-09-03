// frontend/src/components/ProgressDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressHeader from './ProgressHeader';

import ProgressCharts from './ProgressCharts';

import ProgressHeatmap from './ProgressHeatmap';




// We will import the Heatmap and HabitCards here later!

import '../styles/Progress.css'; 

export default function ProgressDashboard() {
    const [habits, setHabits] = useState([]);

    // Fetch all habits so we can run math on them
    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + '/api/habits');
                setHabits(response.data);
            } catch (error) {
                console.error("Failed to load habits for progress", error);
            }
        };
        fetchHabits();
    }, []);

    return (
        <div className="progress-container">
            <div className="progress-page-title">
                <h2>Your Analytics</h2>
                <p>Track your consistency and long-term growth.</p>
            </div>

            {/* 1. The Header Module (Global Stats) */}
            <ProgressHeader habits={habits} />



            {/* 👈 2. THE NEW CODEFORCES HEATMAP */}
            <ProgressHeatmap habits={habits} />

            
            <ProgressCharts habits={habits} />



            {/* 2. The Heatmap Module (Coming Next) */}
            {/* <ProgressHeatmap habits={habits} /> */}

            {/* 3. The Individual Cards Module (Coming Later) */}
            {/* <ProgressList habits={habits} /> */}
        </div>
    );
}

