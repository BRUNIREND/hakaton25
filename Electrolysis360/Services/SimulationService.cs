using Electrolysis360.Models;

namespace Electrolysis360.Services
{
    public interface ISimulationService
    {
        SimulationResponse SimulateProcess(SimulationRequest request);
        SimulationResponse SimulateWithScenario(string scenarioName);
    }

    public class SimulationService : ISimulationService
    {
        private readonly IElectrolysisService _physicsService;
        private readonly IAdvancedElectrolysisService _advancedService;
        
        public SimulationService(IElectrolysisService physicsService, 
                               IAdvancedElectrolysisService advancedService)
        {
            _physicsService = physicsService;
            _advancedService = advancedService;
        }

        public SimulationResponse SimulateProcess(SimulationRequest request)
        {
            // Основная симуляция процесса
            return _physicsService.CalculateProcess(request);
        }

        public SimulationResponse SimulateWithScenario(string scenarioName)
        {
            // Предопределенные сценарии для обучения
            var request = scenarioName.ToLower() switch
            {
                "optimal" => new SimulationRequest 
                { 
                    Current = 250, 
                    Voltage = 4.2, 
                    Temperature = 960, 
                    AluminaConcentration = 4.0 
                },
                "anode_effect" => new SimulationRequest 
                { 
                    Current = 300, 
                    Voltage = 4.3, 
                    Temperature = 965, 
                    AluminaConcentration = 2.5 
                },
                "overheat" => new SimulationRequest 
                { 
                    Current = 350, 
                    Voltage = 4.4, 
                    Temperature = 980, 
                    AluminaConcentration = 3.8 
                },
                "freezing" => new SimulationRequest 
                { 
                    Current = 200, 
                    Voltage = 4.1, 
                    Temperature = 940, 
                    AluminaConcentration = 3.5 
                },
                _ => new SimulationRequest 
                { 
                    Current = 250, 
                    Voltage = 4.2, 
                    Temperature = 960, 
                    AluminaConcentration = 4.0 
                }
            };
            
            return SimulateProcess(request);
        }
    }
}