import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import { 
  Box, 
  CheckCircle, 
  LayoutGrid, 
  Trash2
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subText }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${color}-500`}></div>
    <div>
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subText && <span className="text-xs text-gray-400">{subText}</span>}
      </div>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-500 group-hover:bg-${color}-100 transition-colors`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  subText: PropTypes.string
};

const DashboardCharts = ({ stats }) => {
  if (!stats) return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;

  const { overview, models } = stats;
  
  const safeOverview = overview || {
    total: 0,
    inUse: 0,
    spare: 0,
    faulty: 0,
    disposed: 0,
    pendingReturns: 0,
    pendingRequests: 0
  };

  // Chart Data
  const allocationData = [
    { name: 'In Use', value: safeOverview.inUse, color: '#10b981' }, // Green
    { name: 'Spare', value: safeOverview.spare, color: '#f59e0b' },  // Orange
    { name: 'Faulty', value: safeOverview.faulty, color: '#ef4444' }, // Red
    { name: 'Disposed', value: safeOverview.disposed, color: '#6b7280' } // Gray
  ].filter(item => item.value > 0);

  // If no data, show empty placeholder
  if (allocationData.length === 0) {
    allocationData.push({ name: 'No Data', value: 1, color: '#e5e7eb' });
  }

  const modelData = (models || []).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Assets" 
          value={safeOverview.total} 
          icon={Box} 
          color="blue"
        />
        <StatCard 
          title="In Use" 
          value={safeOverview.inUse} 
          icon={CheckCircle} 
          color="emerald"
          subText={`${((safeOverview.inUse / safeOverview.total || 0) * 100).toFixed(1)}%`}
        />
        <StatCard 
          title="Spare" 
          value={safeOverview.spare} 
          icon={LayoutGrid} 
          color="amber" 
        />
        <StatCard 
          title="Faulty / Disposed" 
          value={safeOverview.faulty + safeOverview.disposed} 
          icon={Trash2} 
          color="red" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Donut */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Asset Allocation</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#374151', fontWeight: 600 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Models Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top 10 Asset Models</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={modelData} 
                layout="vertical" 
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{fontSize: 11, fill: '#6b7280'}} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  label={{ position: 'right', fill: '#6b7280', fontSize: 12 }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardCharts.propTypes = {
  stats: PropTypes.object
};

export default DashboardCharts;
