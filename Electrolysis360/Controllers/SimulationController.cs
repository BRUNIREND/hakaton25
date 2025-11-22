using Microsoft.AspNetCore.Mvc;
using Electrolysis360.Models;
using Electrolysis360.Services;

namespace Electrolysis360.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SimulationController : ControllerBase
    {
        private readonly IElectrolysisService _electrolysisService;
        
        public SimulationController(IElectrolysisService electrolysisService)
        {
            _electrolysisService = electrolysisService;
        }
        
        [HttpPost("calculate")]
        public IActionResult CalculateProcess([FromBody] SimulationRequest request)
        {
            try
            {
                SimulationResponse result = _electrolysisService.CalculateProcess(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        
        [HttpPost("alloy-properties")]
        public IActionResult CalculateAlloyProperties([FromBody] Dictionary<string, double> composition)
        {
            try
            {
                var properties = _electrolysisService.CalculateAlloyProperties(composition);
                return Ok(properties);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}