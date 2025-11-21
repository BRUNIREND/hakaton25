import { SimulationRequest, SimulationResponse, ExperimentRecord } from '../types/models';

const API_BASE_URL = 'http://localhost:5000/api';

export class ElectrolysisApiService {
  static async calculateProcess(request: any): Promise<any> {
    // Временный мок вместо API вызова
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentFactor = Math.max(0.7, 1.0 - Math.abs(request.current - 200) / 500);
        const tempFactor = Math.max(0.6, 1.0 - Math.abs(request.temperature - 960) / 100);
        const concentrationFactor = Math.max(0.5, request.concentration / 5.0);
        
        const currentEfficiency = 85 * currentFactor * tempFactor * concentrationFactor;
        const energyConsumption = 13.5 + (100 - currentEfficiency) * 0.1;

        let status: 'Normal' | 'Warning' | 'Critical' = 'Normal';
        let warning: string | undefined;

        if (request.temperature < 900 || request.temperature > 1000) {
          status = 'Critical';
          warning = 'Критическая температура!';
        } else if (request.current > 350) {
          status = 'Warning';
          warning = 'Превышение силы тока!';
        }

        resolve({
          currentEfficiency,
          energyConsumption,
          status,
          warning,
          timestamp: new Date().toISOString(),
        });
      }, 300);
    });
  }
}

// export class ElectrolysisApiService {
//   static async calculateProcess(request: SimulationRequest): Promise<SimulationResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/simulation/calculate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(request),
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('API call failed, using mock data:', error);
//       // Return mock data if API is not available
//       return this.getMockResponse(request);
//     }
//   }

//   static async calculateAlloyProperties(composition: Record<string, number>): Promise<Record<string, number>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/simulation/alloy-properties`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(composition),
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('API call failed, using mock data:', error);
//       // Return mock data if API is not available
//       return this.getMockAlloyProperties(composition);
//     }
//   }

//   static async getExperimentHistory(): Promise<ExperimentRecord[]> {
//     // Mock data for now
//     return [];
//   }

//   private static getMockResponse(request: SimulationRequest): SimulationResponse {
//     // Mock calculations based on request parameters
//     const currentFactor = Math.max(0.7, 1.0 - Math.abs(request.current - 200) / 500);
//     const tempFactor = Math.max(0.6, 1.0 - Math.abs(request.temperature - 960) / 100);
//     const concentrationFactor = Math.max(0.5, request.concentration / 5.0);
    
//     const currentEfficiency = 85 * currentFactor * tempFactor * concentrationFactor;
//     const energyConsumption = 13.5 + (100 - currentEfficiency) * 0.1;

//     let status: 'Normal' | 'Warning' | 'Critical' = 'Normal';
//     let warning: string | undefined;

//     if (request.temperature < 900 || request.temperature > 1000) {
//       status = 'Critical';
//       warning = 'Критическая температура! Возможно затвердевание электролита.';
//     } else if (request.current > 350) {
//       status = 'Warning';
//       warning = 'Превышение силы тока! Увеличивается износ оборудования.';
//     }

//     return {
//       currentEfficiency,
//       energyConsumption,
//       status,
//       warning,
//       timestamp: new Date().toISOString(),
//     };
//   }

//   private static getMockAlloyProperties(composition: Record<string, number>): Record<string, number> {
//     let strength = 100;
//     let density = 2.7;
//     let conductivity = 60;

//     if (composition.Mg) {
//       strength += composition.Mg * 10;
//       density += composition.Mg * 0.05;
//       conductivity -= composition.Mg * 3;
//     }
//     if (composition.Si) {
//       strength += composition.Si * 8;
//       density += composition.Si * 0.03;
//       conductivity -= composition.Si * 2;
//     }
//     if (composition.Cu) {
//       strength += composition.Cu * 12;
//       density += composition.Cu * 0.08;
//       conductivity -= composition.Cu * 4;
//     }

//     return {
//       Strength: strength,
//       Density: density,
//       Conductivity: conductivity,
//     };
//   }
// }