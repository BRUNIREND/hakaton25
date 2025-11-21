using Electrolysis360.Models;

namespace Electrolysis360.Services
{
    public interface IElectrolysisService
    {
        SimulationResponse CalculateProcess(SimulationRequest request);
        Dictionary<string, double> CalculateAlloyProperties(Dictionary<string, double> composition);
    }

    public class ElectrolysisService : IElectrolysisService
    {
        public SimulationResponse CalculateProcess(SimulationRequest request)
        {
            var response = new SimulationResponse();
            
            // Закон Фарадея + эмпирические поправки
            double theoreticalEfficiency = 100; // Теоретический выход по току
            
            // Влияние силы тока (оптимальный диапазон 150-300 кА)
            double currentFactor = Math.Max(0.7, 1.0 - Math.Abs(request.Current - 200) / 500);
            
            // Влияние температуры (оптимальный диапазон 950-970°C)
            double tempFactor = Math.Max(0.6, 1.0 - Math.Abs(request.Temperature - 960) / 100);
            
            // Влияние концентрации
            double concentrationFactor = Math.Max(0.5, request.Concentration / 5.0);
            
            // Расчет выхода по току
            response.CurrentEfficiency = theoreticalEfficiency * currentFactor * tempFactor * concentrationFactor;
            
            // Расчет расхода энергии (обратно пропорционален выходу по току)
            response.EnergyConsumption = 6.5 + (100 - response.CurrentEfficiency) * 0.1;
            
            // Проверка на нештатные ситуации
            if (request.Temperature < 900 || request.Temperature > 1000)
            {
                response.Status = "Critical";
                response.Warning = "Критическая температура! Возможно затвердевание электролита.";
                response.CurrentEfficiency *= 0.3;
                response.EnergyConsumption *= 2;
            }
            else if (request.Current > 350)
            {
                response.Status = "Warning";
                response.Warning = "Превышение силы тока! Увеличивается износ оборудования.";
                response.CurrentEfficiency *= 0.8;
            }
            
            // Расчет свойств сплава если указан состав
            if (request.AlloyComposition != null)
            {
                response.AlloyProperties = CalculateAlloyProperties(request.AlloyComposition);
            }
            
            response.Timestamp = DateTime.UtcNow;
            
            return response;
        }
        
        public Dictionary<string, double> CalculateAlloyProperties(Dictionary<string, double> composition)
        {
            var properties = new Dictionary<string, double>();
            
            // Простая модель расчета свойств сплава
            double strength = 100; // Базовая прочность
            
            if (composition.ContainsKey("Mg")) strength += composition["Mg"] * 10;
            if (composition.ContainsKey("Si")) strength += composition["Si"] * 8;
            if (composition.ContainsKey("Cu")) strength += composition["Cu"] * 12;
            
            properties["Strength"] = strength;
            properties["Density"] = 2.7 + (composition.Values.Sum() * 0.1);
            properties["Conductivity"] = 60 - (composition.Values.Sum() * 2);
            
            return properties;
        }
    }
}