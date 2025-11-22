namespace Electrolysis360.Models
{
    public class SimulationRequest
    {
        public double Current { get; set; } // Сила тока (кА)
        public double Voltage {get; set;} // Напряжение (U)
        public double Temperature { get; set; } // Температура (°C)
        public double AluminaConcentration { get; set; } // C_Al2O3, %
    }
}