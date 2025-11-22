import React, { useState } from 'react';
import EfficiencyChart from './Charts/EfficiencyChart';
import { SimulationRequest, SimulationResponse } from "../types/models";
import "../styles/App.css"

interface VisualizationProps {
  parameters: SimulationRequest;
  results: SimulationResponse;
  chartData: Array<{ timestamp: string; efficiency: number }>;
}

const Visualization: React.FC<VisualizationProps> = ({
                                                       parameters,
                                                       results,
                                                       chartData,
                                                     }) => {
  const [tooltip, setTooltip] = useState({
    show: false,
    title: '',
    description: '',
    x: 0,
    y: 0
  });

  const getElectrolyzerColor = (status: string) => {
    switch (status) {
      case 'Normal': return '#27ae60';
      case 'Warning': return '#f39c12';
      case 'Critical': return '#e74c3c';
      default: return '#27ae60';
    }
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case 'anode': return '#8B4513';
      case 'electrolyte': return parameters.temperature > 970 ? '#e74c3c' : '#3498db';
      case 'aluminum': return '#bdc3c7';
      case 'cathode': return '#ed806a';
      default: return '#7f8c8d';
    }
  };

  const handleElementHover = (e: React.MouseEvent, title: string, description: string) => {
    setTooltip({
      show: true,
      title,
      description,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleElementLeave = () => {
    setTooltip({ show: false, title: '', description: '', x: 0, y: 0 });
  };

  return (
      <div className="panel visualization-panel">
        <h2>Визуализация процесса</h2>

        <div className="electrolyzer-viz" style={{
          background: 'linear-gradient(to bottom, #34495e, #2c3e50)',
          borderRadius: '10px',
          padding: '1.5rem',
          margin: '1rem 0',
          color: 'white',
          position: 'relative'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Электролизер алюминия</h3>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* 2D схема электролизера */}
            <div style={{ position: 'relative', width: '150px', height: '180px' }}>
              {/* Аноды */}
              <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '12px',
                    background: getElementColor('anode'),
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => handleElementHover(e, 'Аноды', 'Угольные электроды. Потребляются с выделением CO₂')}
                  onMouseLeave={handleElementLeave}
              />

              {/* Электролит */}
              <div
                  style={{
                    position: 'absolute',
                    top: '32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '130px',
                    height: '80px',
                    background: getElementColor('electrolyte'),
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => handleElementHover(e, 'Электролит', `Криолитовый расплав + Al₂O₃ ${parameters.AluminaConcentration}%. Температура: ${parameters.temperature}°C`)}
                  onMouseLeave={handleElementLeave}
              />

              {/* Алюминий */}
              <div
                  style={{
                    position: 'absolute',
                    top: '122px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '10px',
                    background: getElementColor('aluminum'),
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => handleElementHover(e, 'Алюминий', `Накапливается на катоде в процессе электролиза`)}
                  onMouseLeave={handleElementLeave}
              />

              {/* Катод */}
              <div
                  style={{
                    position: 'absolute',
                    top: '142px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '130px',
                    height: '15px',
                    background: getElementColor('cathode'),
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => handleElementHover(e, 'Катодная подина', 'Угольный блок, служащий катодом')}
                  onMouseLeave={handleElementLeave}
              />

              {/* Линия тока */}
              <div style={{
                position: 'absolute',
                top: '22px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '100px',
                background: 'linear-gradient(to bottom, #f39c12, #e74c3c)',
                opacity: 0.6
              }} />
            </div>

            {/* Панель информации */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '14px' }}>
                  <div>Ток: <strong>{parameters.current} кА</strong></div>
                  <div>Температура: <strong>{parameters.temperature}°C</strong></div>
                  <div>Концентрация: <strong>{parameters.AluminaConcentration}%</strong></div>
                  <div>Выход по току: <strong>{results.currentEfficiency?.toFixed(1)}%</strong></div>
                  <div>Энергия: <strong>{results.energyConsumption?.toFixed(1)} кВт·ч</strong></div>
                </div>
              </div>

              <div style={{
                background: getElectrolyzerColor(results.status),
                padding: '0.5rem',
                borderRadius: '5px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Статус: {results.status}

              </div>
                {results.warnings && (
                    <div className={`warning-message ${results.status.toLowerCase()}`}>
                        <ul style={{listStyleType: 'none'}}>
                            {results.warnings.map(ptm => <li>{ptm}</li>)}
                        </ul>
                    </div>
                )}

            </div>
          </div>


        </div>
          {/* Всплывающая подсказка */}
          {tooltip.show && (
              <div style={{
                  left: tooltip.x + 10,
                  top: tooltip.y + 10,
                  background: 'rgba(0, 0, 0, 0.9)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  maxWidth: '200px',
                  fontSize: '12px',
                  border: '1px solid #34495e'
              }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{tooltip.title}</div>
                  <div style={{ opacity: 0.9 }}>{tooltip.description}</div>
              </div>
          )}
        <EfficiencyChart data={chartData} />
      </div>
  );
};

export default Visualization;