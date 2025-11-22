import React, { useState, useEffect, useCallback } from 'react';
import { SimulationRequest, SimulationResponse, ChartDataPoint } from './types/models';
import { ElectrolysisApiService } from './services/api';
import ControlPanel from './components/ControlPanel';
import Visualization from './components/Visualization';
import AlloyCalculator from './components/AlloyCalculator';
import ExperimentHistory from './components/ExperimentHistory';
import ElectrolGraf from './components/ElectrolGraf';
import './styles/App.css';

const App: React.FC = () => {
  const [parameters, setParameters] = useState<SimulationRequest>({
    current: 200,
    voltage: 4.2,
    temperature: 960,
    concentration: 3.0,
  });

  const [results, setResults] = useState<SimulationResponse>({
    currentEfficiency: 0,
    energyConsumption: 0,
    status: 'Normal',
    timestamp: new Date().toISOString(),
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateProcess = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ElectrolysisApiService.calculateProcess(parameters);
      setResults(response);

      // Обновляем данные графика
      const newDataPoint: ChartDataPoint = {
        timestamp: new Date().toLocaleTimeString(),
        efficiency: response.currentEfficiency,
        energyConsumption: response.energyConsumption,
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint];
        // Сохраняем только последние 10 точек
        return updated.slice(-10);
      });

    } catch (error) {
      console.error('Error calculating process:', error);
      // Fallback to mock data if API is not available
      const mockResponse: SimulationResponse = {
        currentEfficiency: 85 + Math.random() * 10,
        energyConsumption: 13 + Math.random() * 2,
        status: 'Normal',
        timestamp: new Date().toISOString(),
      };
      setResults(mockResponse);
    } finally {
      setLoading(false);
    }
  }, [parameters]);

  // Автоматический пересчет при изменении параметров
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateProcess();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [calculateProcess]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Электролиз 360</h1>
        <p>Интерактивный симулятор процесса электролиза алюминия</p>
      </header>

      <div className="app-container">
        <div className="main-content">
          <div className="content-row">
            <ControlPanel
              parameters={parameters}
              onParametersChange={setParameters}
              results={results}
            />
            <Visualization
              parameters={parameters}
              results={results}
              chartData={chartData}
            />
          </div>

          <div className="content-row">
            <AlloyCalculator />
            <ElectrolGraf />
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Расчет...</div>
        </div>
      )}
    </div>
  );
};

export default App;