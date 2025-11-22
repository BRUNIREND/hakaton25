export interface SimulationRequest {
  voltage: number; // Напряжение (В)
  current: number; // Сила тока (кА)
  temperature: number; // Температура (°C)
  concentration: number; // Концентрация Al2O3
  alloyComposition?: Record<string, number>; // Состав сплава
}

export interface SimulationResponse {
  currentEfficiency: number; // Выход по току (%)
  energyConsumption: number; // Расход энергии (кВт·ч/кг)
  status: 'Normal' | 'Warning' | 'Critical';
  warning?: string;
  alloyProperties?: Record<string, number>;
  timestamp: string;
}

export interface ExperimentRecord {
  id: string;
  request: SimulationRequest;
  response: SimulationResponse;
  timestamp: string;
}

export interface ChartDataPoint {
  timestamp: string;
  efficiency: number;
  energyConsumption: number;
}