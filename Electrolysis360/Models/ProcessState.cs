namespace Electrolysis360.Models
{
    public class ProcessState()
    {
        public double TemperatureEffect { get; set; } // Delta_Eta_T
        public double ConcentrationEffect { get; set; } // Delta_Eta_C
        public bool IsAnodeEffect { get; set; }
        public bool IsElectrolyteFreezing { get; set; }
        public bool IsShortCircuitRisk { get; set; }
    }
}