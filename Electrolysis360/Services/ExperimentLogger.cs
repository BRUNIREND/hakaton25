using Electrolysis360.Data;
using Electrolysis360.Models;
using Microsoft.EntityFrameworkCore;

namespace Electrolysis360.Services
{
    public interface IExperimentLogger
    {
        Task SaveExperimentAsync(SimulationRequest request, SimulationResponse response);
        Task<List<Experiment>> GetLastExperimentsAsync(int count = 10);

        //void LogExperiment(SimulationRequest request, SimulationResponse response);
        //List<ExperimentRecord> GetHistory();
    }
    
    public class ExperimentLogger : IExperimentLogger
    {
        private readonly AppDbContext db;
        //private readonly List<ExperimentRecord> _experiments = new();
        //private readonly string _logFilePath = "experiments.json";

        public ExperimentLogger(AppDbContext db)
        {
            this.db = db;
        }

        public async Task SaveExperimentAsync(SimulationRequest request, SimulationResponse response)
        {
            var experiment = new Experiment
            {
                Current = request.Current,
                Voltage = request.Voltage,
                Temperature = request.Temperature,
                CurrentEfficiency = response.CurrentEfficiency,
                CreatedAt = DateTime.UtcNow,
            };

            db.Experiments.Add(experiment);
            await db.SaveChangesAsync();
        }
        
        public async Task<List<Experiment>> GetLastExperimentsAsync(int count = 10)
        {
            return await db.Experiments
                .OrderByDescending(x => x.Current)
                .Take(count)
                .ToListAsync();
        }

        //    public void LogExperiment(SimulationRequest request, SimulationResponse response)
        //    {
        //        var record = new ExperimentRecord
        //        {
        //            Id = Guid.NewGuid(),
        //            Request = request,
        //            Response = response,
        //            Timestamp = DateTime.UtcNow
        //        };

        //        _experiments.Add(record);

        //        // Сохранение в файл (в реальном проекте - база данных)
        //        SaveToFile();
        //    }

        //    public List<ExperimentRecord> GetHistory()
        //    {
        //        return _experiments.OrderByDescending(x => x.Timestamp).ToList();
        //    }

        //    private void SaveToFile()
        //    {
        //        var json = System.Text.Json.JsonSerializer.Serialize(_experiments);
        //        System.IO.File.WriteAllText(_logFilePath, json);
        //    }
    }

    //public class ExperimentRecord
    //{
    //    public Guid Id { get; set; }
    //    public SimulationRequest Request { get; set; } = new();
    //    public SimulationResponse Response { get; set; } = new();
    //    public DateTime Timestamp { get; set; }
    //}
}