namespace Electrolysis360.Services
{
    public static class PhysicsConstant
    {

         // Теоретические константы
        public const double TheoreticalCurrentEfficiency = 90.0; // Eta_0, %
        public const double TheoreticalAnodeConsumption = 334.0; // кг/т (теоретический)
        public const double AluminumOutputConstant = 0.3356; // g_Al, г/А·ч
        
        // Оптимальные диапазоны
        public const double OptimalTemperatureMin = 950.0;
        public const double OptimalTemperatureMax = 970.0;
        public const double OptimalTemperature = 960.0;
        
        public const double OptimalConcentrationMin = 3.5;
        public const double OptimalConcentrationMax = 4.5;
        public const double CriticalConcentration = 3.0;
        
        public const double OptimalCurrentMin = 200.0;
        public const double OptimalCurrentMax = 400.0;
        
        public const double OptimalVoltageMin = 4.0;
        public const double OptimalVoltageMax = 4.5;
        public const double CriticalVoltage = 4.0;
        
        // Коэффициенты влияния
        public const double TemperatureOverheatPenalty = 0.5; // % за градус выше оптимума
        public const double TemperatureCoolingPenalty = 0.3; // % за градус ниже оптимума
        public const double ConcentrationPenalty = 0.5; // % за процент ниже оптимума

    }
}