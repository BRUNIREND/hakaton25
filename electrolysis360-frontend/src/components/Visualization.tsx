import React from 'react';
import EfficiencyChart from './Charts/EfficiencyChart';
import {SimulationRequest, SimulationResponse} from "../types/models";

interface VisualizationProps {
  parameters: SimulationRequest
  results: SimulationResponse;
  chartData: Array<{ timestamp: string; efficiency: number }>;
}

const Visualization: React.FC<VisualizationProps> = ({
  parameters,
  results,
  chartData,
}) => {
  const getElectrolyzerColor = (status: string) => {
    switch (status) {
      case 'Normal': return '#27ae60';
      case 'Warning': return '#f39c12';
      case 'Critical': return '#e74c3c';
      default: return '#27ae60';
    }
  };
  console.log("---")
  console.log(results.warnings)
  console.log("---")
  
  return (
    <div className="panel visualization-panel">
      <h2>Визуализация процесса</h2>
      
      <div className="electrolyzer-viz" style={{
        background: 'linear-gradient(to bottom, #34495e, #2c3e50)',
        borderRadius: '10px',
        padding: '1rem',
        margin: '1rem 0',
        minHeight: '200px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h3>Электролизер</h3>
        <div style={{ 
          background: getElectrolyzerColor(results.status),
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          margin: '0.5rem 0'
        }}>
          <div>Ток: {parameters.current} кА</div>
          <div>Темп.: {parameters.temperature}°C</div>
          <div>Выход: {results.currentEfficiency?.toFixed(1)}%</div>
        </div>
        <div>Статус: <strong>{results.status}</strong></div>
        {results.warnings && (
          <div className={`warning-message ${results.status.toLowerCase()}`}>             
            <ul style={{listStyleType: 'none'}}>
              {results.warnings.map(ptm => <li>{ptm}</li>)}
            </ul>
          </div>
        )}
      </div>

      <EfficiencyChart data={chartData} />
    </div>
  );
};

export default Visualization;