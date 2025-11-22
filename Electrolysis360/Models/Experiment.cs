using System.ComponentModel.DataAnnotations;

namespace Electrolysis360.Models
{
    public class Experiment
    {
        public int Id { get; set; }

        [Required]
        public double Current { get; set; }                  // Ток (А)

        [Required]
        public double Voltage { get; set; }                  // Напряжение (В)

        [Required]
        public double Temperature { get; set; }              // Температура (°C)

        [Required]
        public double CurrentEfficiency { get; set; }        // Токовая эффективность (%)

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Дата создания
    }
}
