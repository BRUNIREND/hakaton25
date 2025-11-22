// using Electrolysis360.Models;

// namespace Electrolysis360.Services
// {
//     interface IPhysics
//     {
//         public SimulationResponse CalculateProcess(SimulationRequest request); // Рассчитывание физических процессов на основе входных данных и констант
//         public ProcessState AnalyzeProcessState(SimulationRequest request); // Анализ рассчитанных данных на критические ситуации
//     }

//     public class Physics : IPhysics
//     {
        
//         public SimulationResponse CalculateProcess(SimulationRequest request)
//         {
//             var processState = AnalyzeProcessState(request);

//             // Расчет выхода по току с учетом всех поправок
//             double currentEfficiency = CalculateCurrentEfficiency(request, processState);
//             // Расчет удельного расхода энергии
//             double energyConsumption = CalculateEnergyConsumption(request.Voltage, currentEfficiency);
            
//             // Расчет расхода анодного материала
//             double anodeConsumption = CalculateAnodeConsumption(currentEfficiency);
//             return new SimulationResponse{
//                 CurrentEfficiency = currentEfficiency,
//                 EnergyConsumption = energyConsumption,
//                 AnodeConsumption = anodeConsumption,
//                 Status = GetOverallStatus(processState),
//                 Warnings = GenerateWarnings(processState),
//                 ProcessState = processState,
//                 Timestamp = DateTime.UtcNow
//             };
//         }
//         public ProcessState AnalyzeProcessState(SimulationRequest request)
//         {
//             var state = new ProcessState();
            
//             // Анализ температурного влияния
//             state.TemperatureEffect = CalculateTemperatureEffect(request.Temperature);
//             state.IsElectrolyteFreezing = request.Temperature < PhysicsConstant.OptimalTemperatureMin;
            
//             // Анализ влияния концентрации глинозема
//             state.ConcentrationEffect = CalculateConcentrationEffect(request.AluminaConcentration);
//             state.IsAnodeEffect = request.AluminaConcentration < PhysicsConstant.CriticalConcentration;
            
//             // Анализ риска короткого замыкания
//             state.IsShortCircuitRisk = request.Voltage < PhysicsConstant.CriticalVoltage;
            
//             return state;
//         }

//         private double CalculateCurrentEfficiency(SimulationRequest request, ProcessState state)
//         {
//             double baseEfficiency = PhysicsConstant.TheoreticalCurrentEfficiency;
            
//             // Применяем поправки
//             double efficiency = baseEfficiency + state.TemperatureEffect + state.ConcentrationEffect;
            
//             // Критические сбои резко снижают эффективность
//             if (state.IsAnodeEffect)
//             {
//                 efficiency = 60.0; // Резкое падение при анодном эффекте
//             }
            
//             if (state.IsElectrolyteFreezing)
//             {
//                 efficiency = 70.0; // Резкое падение при застывании
//             }
            
//             // Ограничиваем диапазон
//             return Math.Max(0, Math.Min(100, efficiency));
//         }

//         private double CalculateTemperatureEffect(double temperature)
//         {
//             if (temperature == PhysicsConstant.OptimalTemperature)
//                 return 0;
            
//             if (temperature > PhysicsConstant.OptimalTemperature)
//             {
//                 // Перегрев: -0.5% за каждый градус выше оптимума
//                 double degreesAbove = temperature - PhysicsConstant.OptimalTemperature;
//                 return -degreesAbove * PhysicsConstant.TemperatureOverheatPenalty;
//             }
//             else
//             {
//                 // Охлаждение: -0.3% за каждый градус ниже оптимума
//                 double degreesBelow = PhysicsConstant.OptimalTemperature - temperature;
//                 return -degreesBelow * PhysicsConstant.TemperatureCoolingPenalty;
//             }
//         }

//         private double CalculateConcentrationEffect(double concentration)
//         {
//             if (concentration >= PhysicsConstant.OptimalConcentrationMin && 
//                 concentration <= PhysicsConstant.OptimalConcentrationMax)
//                 return 0;
            
//             if (concentration < PhysicsConstant.OptimalConcentrationMin)
//             {
//                 // Недостаток глинозема: -0.5% за каждый процент ниже оптимума
//                 double deficit = PhysicsConstant.OptimalConcentrationMin - concentration;
//                 return -deficit * PhysicsConstant.ConcentrationPenalty;
//             }
            
//             return 0; // Превышение концентрации не штрафуется в базовой модели
//         }

//         private double CalculateEnergyConsumption(double voltage, double currentEfficiency)
//         {
//             // Формула: E_уд = (U * 1000) / (g_Al * (Eta / 100))
//             if (currentEfficiency <= 0) return double.MaxValue;
            
//             double numerator = voltage * 1000;
//             double denominator = PhysicsConstant.AluminumOutputConstant * (currentEfficiency / 100);
            
//             return numerator / denominator;
//         }

//         private double CalculateAnodeConsumption(double currentEfficiency)
//         {
//             // Формула: Расход_Анода = 334 / (Eta / 100)
//             if (currentEfficiency <= 0) return double.MaxValue;
            
//             return PhysicsConstant.TheoreticalAnodeConsumption / (currentEfficiency / 100);
//         }

//         private string GetOverallStatus(ProcessState state)
//         {
//             if (state.IsAnodeEffect || state.IsElectrolyteFreezing || state.IsShortCircuitRisk)
//                 return "Critical";
            
//             if (state.TemperatureEffect < -5 || state.ConcentrationEffect < -5)
//                 return "Warning";
            
//             return "Normal";
//         }

//         private List<string> GenerateWarnings(ProcessState state)
//         {
//             var warnings = new List<string>();
            
//             if (state.IsAnodeEffect)
//                 warnings.Add("⚡ Анодный эффект! Срочно подать глинозём!");
            
//             if (state.IsElectrolyteFreezing)
//                 warnings.Add("❄️ Опасность застывания электролита!");
            
//             if (state.IsShortCircuitRisk)
//                 warnings.Add("🔥 Опасность короткого замыкания!");
            
//             if (state.TemperatureEffect < -10)
//                 warnings.Add("🌡️ Сильное отклонение температуры от оптимума");
            
//             if (state.ConcentrationEffect < -5)
//                 warnings.Add("📊 Низкая концентрация глинозёма");
            
//             return warnings;
//         }

//     }
// }