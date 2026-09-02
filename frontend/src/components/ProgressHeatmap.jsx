import { useState, useMemo } from 'react';



import '../styles/Progress.css';


export default function ProgressHeatmap({ habits }) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // 1. Aggregate all completions into a frequency map
    const activityMap = useMemo(() => {
        const counts = {};
        habits.forEach(habit => {
            habit.completedDates?.forEach(date => {
                counts[date] = (counts[date] || 0) + 1;
            });
        });
        return counts;
    }, [habits]);

    // 2. Generate the calendar grid and month positions
    const { days, months, stats } = useMemo(() => {
        const yearStart = new Date(selectedYear, 0, 1);
        const yearEnd = new Date(selectedYear, 11, 31);
        const allDays = [];
        const monthLabels = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        let yearlyTotal = 0;

        // Pad the first week (0 = Sunday)
        const startDayOfWeek = yearStart.getDay();
        for (let i = 0; i < startDayOfWeek; i++) {
            allDays.push({ placeholder: true });
        }

        for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
            // Check if it's the 1st of the month to place the label
            if (d.getDate() === 1) {
                const weekIndex = Math.floor(allDays.length / 7);
                monthLabels.push({ name: monthNames[d.getMonth()], week: weekIndex });
            }

            const dateStr = d.toLocaleDateString('en-CA');
            const count = activityMap[dateStr] || 0;
            if (count > 0) yearlyTotal += count;
            
            allDays.push({ date: dateStr, count, placeholder: false });
        }

        const allTimeTotal = Object.values(activityMap).reduce((a, b) => a + b, 0);

        return { days: allDays, months: monthLabels, stats: { yearlyTotal, allTimeTotal } };
    }, [selectedYear, activityMap]);

    // 3. Fixed color thresholds (Codeforces/GitHub style)
    const getColor = (count) => {
        if (count === 0) return '#ebedf0'; // Grey
        if (count === 1) return '#c6e48b'; // Light green (1 habit)
        if (count === 2) return '#7bc96f'; // Medium green (2 habits)
        if (count === 3) return '#239a3b'; // Dark green (3 habits)
        return '#196127';                  // Darkest green (4+ habits)
    };

    return (
        <div className="cf-heatmap-container">
            <div className="cf-header">
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="cf-year-select"
                >
                    {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            <div className="cf-grid-wrapper">
                
                <div className="cf-grid-inner">
                    {/* Month Labels Row */}
                    <div className="cf-months">
                        {months.map((m, i) => (
                            <span 
                                key={i} 
                                className="cf-month-label" 
                                style={{ left: `${m.week * 16}px` }} /* 13px square + 3px gap = 16px */
                            >
                                {m.name}
                            </span>
                        ))}
                    </div>

                    {/* The Grid */}
                    <div className="cf-grid">
                        {days.map((day, i) => (
                            <div 
                                key={i} 
                                className={`cf-square ${day.placeholder ? 'placeholder' : ''}`}
                                style={{ backgroundColor: day.placeholder ? 'transparent' : getColor(day.count) }}
                                title={day.placeholder ? '' : `${day.count} completions on ${day.date}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="cf-stats-row">
                <div className="cf-stat-group">
                    <div className="cf-stat-number">{stats.allTimeTotal} completions</div>
                    <div className="cf-stat-label">logged for all time</div>
                </div>
                <div className="cf-stat-group">
                    <div className="cf-stat-number">{stats.yearlyTotal} completions</div>
                    <div className="cf-stat-label">logged for the selected year</div>
                </div>
            </div>
        </div>
    );
}

