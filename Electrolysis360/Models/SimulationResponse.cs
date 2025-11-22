namespace Electrolysis360.Models
{
    public class SimulationResponse
    {
        public double CurrentEfficiency { get; set; } // Выход по току (%)
        public double EnergyConsumption { get; set; } // Расход энергии (кВт·ч/кг)
        public string Status { get; set; } = "Normal";
        public string? Warning { get; set; }
        public Dictionary<string, double>? AlloyProperties { get; set; }
        public DateTime Timestamp { get; set; }

        public event Action<string, object>? PropertyChanged;

        public void UpdateProperty(string propertyName, object value)
        {
            var property = GetType().GetProperty(propertyName);
            if (property != null)
            {
                property.SetValue(this, value);
                PropertyChanged?.Invoke(propertyName, value);
            }
        }
    }
}