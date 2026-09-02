// frontend/src/components/ProgressHeader.jsx

export default function ProgressHeader({ habits }) {
    
    // 1. Calculate Total Completions (All Time)
    const totalCompletions = habits.reduce((total, habit) => {
        return total + (habit.completedDates?.length || 0);
    }, 0);

    // 2. Calculate Active Habits Today
    const today = new Date().toLocaleDateString('en-CA');
    const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;
    const totalActiveHabits = habits.length;

    // 3. Calculate 7-Day Consistency (Total checkmarks in the last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-CA');
    });

    const checkmarksLast7Days = habits.reduce((total, habit) => {
        const checksThisWeek = habit.completedDates?.filter(date => last7Days.includes(date)).length || 0;
        return total + checksThisWeek;
    }, 0);

    return (
        <div className="progress-header-grid">
            
            <div className="stat-card">
                <div className="stat-icon purple">🏆</div>
                <div className="stat-info">
                    <span className="stat-label">All-Time Completions</span>
                    <span className="stat-value">{totalCompletions}</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon blue">✅</div>
                <div className="stat-info">
                    <span className="stat-label">Completed Today</span>
                    <span className="stat-value">{completedToday} <span className="stat-sub">/ {totalActiveHabits}</span></span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon orange">🔥</div>
                <div className="stat-info">
                    <span className="stat-label">7-Day Activity</span>
                    <span className="stat-value">{checkmarksLast7Days} <span className="stat-sub">checkmarks</span></span>
                </div>
            </div>

        </div>
    );
}

