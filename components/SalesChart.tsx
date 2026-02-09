import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface Props {
  current: number;
  target: number;
}

const SalesChart: React.FC<Props> = ({ current, target }) => {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const data = [
    { name: 'Completed', value: current },
    { name: 'Remaining', value: Math.max(0, target - current) },
  ];
  
  const COLORS = ['#FF4500', '#E5E7EB'];

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              value={`${percentage}%`}
              position="center"
              dy={-10}
              className="text-3xl font-bold fill-gray-900"
              style={{ fontSize: '2rem', fontWeight: '800' }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-gray-500 text-sm">Progresso Atual</p>
      </div>
    </div>
  );
};

export default SalesChart;
