using Electrolysis360.Services;
using Microsoft.AspNetCore.Mvc;

namespace Electrolysis360.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExperimentsController: ControllerBase
    {
        private readonly IExperimentLogger logger;

        public ExperimentsController(IExperimentLogger logger)
        {
            this.logger = logger;
        }

        // Получить историю экспериментов
        [HttpGet]
        public async Task<IActionResult> GetHistory()
        {
            var experiments = await logger.GetLastExperimentsAsync(20);
            return Ok(experiments);
        }

        // Получить статистику
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var experiments = await logger.GetLastExperimentsAsync(100);

            var stats = new
            {
                TotalExperiments = experiments.Count,
                AvgEfficiency = experiments.Average(e => e.CurrentEfficiency),
                MaxCurrent = experiments.Max(e => e.Current),
                RecentActivity = experiments.Take(5).Select(e => new {
                    e.Id,
                    e.CurrentEfficiency,
                    e.CreatedAt
                })
            };

            return Ok(stats);
        }
    }
}
