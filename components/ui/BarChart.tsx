import React from 'react';

interface BarChartProps {
  data: { name: string; value: number; color: string }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.abs(d.value)), 1);
  const chartHeight = 200;
  const barWidth = 40;
  const barMargin = 20;
  const chartWidth = data.length * (barWidth + barMargin);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="w-full h-full">
        {data.map((item, index) => {
            const barHeight = Math.abs(item.value / maxValue) * chartHeight;
            const x = index * (barWidth + barMargin);
            const y = item.value >= 0 ? chartHeight - barHeight : chartHeight;
            
            return (
            <g key={item.name}>
                <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={item.color}
                    rx="4"
                />
                <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-current text-gray-700 dark:text-gray-300"
                >
                    {formatCurrency(item.value)}
                </text>
                 <text
                    x={x + barWidth / 2}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className="text-sm fill-current text-gray-500 dark:text-gray-400"
                >
                    {item.name}
                </text>
            </g>
            );
        })}
        {/* Zero line */}
        <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1" />
        </svg>
    </div>
  );
};

export default BarChart;