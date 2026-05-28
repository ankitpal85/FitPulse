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

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  return (
    <div className="w-full h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            contentStyle={{
              backgroundColor: tooltipBg,
              borderRadius: '12px',
              border: `1px solid ${tooltipBorder}`,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: isDark ? '#e2e8f0' : '#1e293b',
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="Intake" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} name="Intake" />
          <Bar dataKey="Burn" fill="#f97316" radius={[4, 4, 0, 0]} barSize={12} name="Burn" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CaloriesChart;
