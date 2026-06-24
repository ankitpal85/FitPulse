import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const CaloriesChart = () => {
  const { allActivityLogs, allFoodLogs } = useAppContext();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const getData = () => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const dailyFood = allFoodLogs.filter(log => log.createdAt?.split('T')[0] === dateString);
      const dailyActivity = allActivityLogs.filter(log => log.createdAt?.split('T')[0] === dateString);

      const intake = dailyFood.reduce((sum, item) => sum + (item.calories || 0), 0);
      const burn = dailyActivity.reduce((sum, item) => sum + (item.calories || 0), 0);

      data.push({
        name: dayName,
        Intake: intake,
        Burn: burn,
        date: dateString
      });
    }
    return data;
  };

  const data = getData();

  const axisColor = isDark ? '#64748b' : '#94a3b8';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const tooltipBg = isDark ? 'rgba(15,15,25,0.9)' : 'rgba(255,255,255,0.95)';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';

  return (
    <div className="w-full h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="intakeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: axisColor, fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: axisColor, fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
            contentStyle={{
              backgroundColor: tooltipBg,
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: `1px solid ${tooltipBorder}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              color: isDark ? '#e2e8f0' : '#1e293b',
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="Intake" fill="url(#intakeGradient)" radius={[6, 6, 0, 0]} barSize={14} name="Intake" />
          <Bar dataKey="Burn" fill="url(#burnGradient)" radius={[6, 6, 0, 0]} barSize={14} name="Burn" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CaloriesChart;
