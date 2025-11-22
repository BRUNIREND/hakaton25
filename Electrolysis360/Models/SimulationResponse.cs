namespace Electrolysis360.Models
{
    public class SimulationResponse
    {
        

        public double CurrentEfficiency { get; set; } // Eta, %
        public double EnergyConsumption { get; set; } // E_уд, кВт·ч/т
        public double AnodeConsumption { get; set; } // Расход_Анода, кг/т
        public string Status { get; set; } = "Normal";
        public List<string> Warnings { get; set; } = new();
        public ProcessState ProcessState { get; set; } = new();
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