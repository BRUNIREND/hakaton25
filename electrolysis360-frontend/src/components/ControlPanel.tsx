import React from 'react';
import { SimulationRequest, SimulationResponse } from '../types/models';

interface ControlPanelProps {
  parameters: SimulationRequest;
  onParametersChange: (params: SimulationRequest) => void;
  results: SimulationResponse
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  parameters,
  onParametersChange,
  results,
}) => {
  const handleSliderChange = (param: keyof SimulationRequest, value: number) => {
    onParametersChange({
      ...parameters,
      [param]: value,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return '#27ae60';
      case 'Warning': return '#f39c12';
      case 'Critical': return '#e74c3c';
      default: return '#27ae60';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Normal': return 'Нормальный режим';
      case 'Warning': return 'Предупреждение';
      case 'Critical': return 'Критический режим';
      default: return status;
    }
  };

  return (
    <div className="panel control-panel">
      <h2>Панель управления</h2>
      
      <div className="slider-container">
        <label>
          Сила тока: <span className="slider-value">{parameters.current}</span> кА
        </label>
        <input
          type="range"
          min="200"
          max="400"
          value={parameters.current}
          step="1"
          onChange={(e) => handleSliderChange('current', parseFloat(e.target.value))}
          className="slider"
        />
        <div className="slider-labels">
          <span>200 кА</span>
          <span>400 кА</span>
        </div>
      </div>

      <div className="slider-container">
        <label>
          Напряжение на Ванне: <span className="slider-value">{parameters.voltage}</span> В
        </label>
        <input
          type="range"
          min="0.0"
          max="10.0"
          value={parameters.voltage}
          step="0.1"
          onChange={(e) => handleSliderChange('voltage', parseFloat(e.target.value))}
          className="slider"
        />
        <div className="slider-labels">
          <span>0 В</span>
          <span>10 В</span>
        </div>
      </div>

      <div className="slider-container">
        <label>
          Температура Электролита: <span className="slider-value">{parameters.temperature}</span> °C
        </label>
        <input
          type="range"
          min="700"
          max="1100"
          value={parameters.temperature}
          step="1"
          onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
          className="slider"
        />
        <div className="slider-labels">
          <span>700°C</span>
          <span>1100°C</span>
        </div>
      </div>

      <div className="slider-container">
        <label>
          Концентрация Глинозёма: <span className="slider-value">{parameters.AluminaConcentration}</span> %
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={parameters.AluminaConcentration}
          step="0.1"
          onChange={(e) => handleSliderChange('AluminaConcentration', parseFloat(e.target.value))}
          className="slider"
        />
        <div className="slider-labels">
          <span>0%</span>
          <span>10%</span>
        </div>
      </div>

      <div className="status-panel">
        <h3>
          Статус: 
          <span style={{ color: getStatusColor(results.status) }}>
            {getStatusText(results.status)}
          </span>
        </h3>
        {results.warnings && (
          <div className={`warning-message ${results.status.toLowerCase()}`}>             
            <ul style={{listStyleType: 'none'}}>
              {results.warnings.map(ptm => <li>{ptm}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="results">
        <h3>Результаты:</h3>
        <div className="result-item">
          <span>Выход по току:</span>
          <strong>{results.currentEfficiency.toFixed(1)}%</strong>
        </div>
        <div className="result-item">
          <span>Расход энергии:</span>
          <strong>{results.energyConsumption.toFixed(2)} кВт·ч/кг</strong>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;