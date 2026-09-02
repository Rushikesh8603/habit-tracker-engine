// frontend/src/components/ProgressCharts.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProgressCharts({ habits }) {
    
    // 1. Process Data for Chart 1: Habits by Area (e.g., Health, Work)
    const areaCounts = habits.reduce((acc, habit) => {
        const areaName = habit.area || 'Other';
        acc[areaName] = (acc[areaName] || 0) + 1;
        return acc;
    }, {});

    const areaData = Object.keys(areaCounts).map(key => ({
        name: key,
        value: areaCounts[key]
    }));

    // 2. Process Data for Chart 2: Good vs Bad Habits
    const typeCounts = habits.reduce((acc, habit) => {
        acc[habit.type] = (acc[habit.type] || 0) + 1;
        return acc;
    }, {});

    const typeData = [
        { name: 'Good Habits', value: typeCounts['good'] || 0 },
        { name: 'Bad Habits', value: typeCounts['bad'] || 0 }
    ];

    // Premium Color Palettes
    const AREA_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#64748b'];
    const TYPE_COLORS = ['#10b981', '#ef4444']; // Green for Good, Red for Bad

    // If there are no habits, don't render empty charts
    if (habits.length === 0) return null;

    return (
        <div className="charts-grid">
            
            {/* Chart 1: Categories (Pie Chart) */}
            <div className="chart-card">
                <h3>Habits by Category</h3>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={areaData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                stroke="none"
                            >
                                {areaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={AREA_COLORS[index % AREA_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart 2: Good vs Bad (Donut Chart) */}
            <div className="chart-card">
                <h3>Good vs. Bad Habits</h3>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={typeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60} /* This makes it a Donut Chart! */
                                outerRadius={90}
                                dataKey="value"
                                stroke="none"
                            >
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}

