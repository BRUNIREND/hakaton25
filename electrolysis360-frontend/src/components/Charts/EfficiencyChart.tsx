import React from 'react';

interface EfficiencyChartProps {
  data: Array<{ timestamp: string; efficiency: number }>;
}

const EfficiencyChart: React.FC<EfficiencyChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <h3>Динамика выхода по току</h3>
      <div style={{
        background: '#f8f9fa',
        padding: '1rem',
        borderRadius: '8px',
        minHeight: '200px'
      }}>
        {data.length === 0 ? (
          <p>Нет данных для отображения</p>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Последние значения:</strong>
            </div>
            {data.slice(-5).map((point, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                borderBottom: '1px solid #eee'
              }}>
                <span>{point.timestamp}</span>
                <strong>{point.efficiency.toFixed(1)}%</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EfficiencyChart;