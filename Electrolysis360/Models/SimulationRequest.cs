namespace Electrolysis360.Models
{
    public class SimulationRequest
    {
        public double Current { get; set; } // Сила тока (кА)
        public double Temperature { get; set; } // Температура (°C)
        public double Concentration { get; set; } // Концентрация Al2O3
        public Dictionary<string, double>? AlloyComposition { get; set; } // Состав сплава
    }
}