using Electrolysis360.Models;

namespace Electrolysis360.Services
{
    public interface IExperimentLogger
    {
        void LogExperiment(SimulationRequest request, SimulationResponse response);
        List<ExperimentRecord> GetHistory();
    }
    
    public class ExperimentLogger : IExperimentLogger
    {
        private readonly List<ExperimentRecord> _experiments = new();
        private readonly string _logFilePath = "experiments.json";
        
        public void LogExperiment(SimulationRequest request, SimulationResponse response)
        {
            var record = new ExperimentRecord
            {
                Id = Guid.NewGuid(),
                Request = request,
                Response = response,
                Timestamp = DateTime.UtcNow
            };
            
            _experiments.Add(record);
            
            // Сохранение в файл (в реальном проекте - база данных)
            SaveToFile();
        }
        
        public List<ExperimentRecord> GetHistory()
        {
            return _experiments.OrderByDescending(x => x.Timestamp).ToList();
        }
        
        private void SaveToFile()
        {
            var json = System.Text.Json.JsonSerializer.Serialize(_experiments);
            System.IO.File.WriteAllText(_logFilePath, json);
        }
    }
    
    public class ExperimentRecord
    {
        public Guid Id { get; set; }
        public SimulationRequest Request { get; set; } = new();
        public SimulationResponse Response { get; set; } = new();
        public DateTime Timestamp { get; set; }
    }
}