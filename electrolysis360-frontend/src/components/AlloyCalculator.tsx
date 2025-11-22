import React, { useState } from 'react';

interface AlloyComposition {
  Mg: number;
  Si: number;
  Cu: number;
}

const AlloyCalculator: React.FC = () => {
  const [composition, setComposition] = useState<AlloyComposition>({
    Mg: 0,
    Si: 0,
    Cu: 0,
  });

  const handleCompositionChange = (element: keyof AlloyComposition, value: number) => {
    setComposition(prev => ({
      ...prev,
      [element]: value,
    }));
  };

  const calculateProperties = () => {
    let strength = 100;
    let density = 2.7;
    let conductivity = 60;

    if (composition.Mg) {
      strength += composition.Mg * 10;
      density += composition.Mg * 0.05;
      conductivity -= composition.Mg * 3;
    }
    if (composition.Si) {
      strength += composition.Si * 8;
      density += composition.Si * 0.03;
      conductivity -= composition.Si * 2;
    }
    if (composition.Cu) {
      strength += composition.Cu * 12;
      density += composition.Cu * 0.08;
      conductivity -= composition.Cu * 4;
    }

    alert(`Свойства сплава:\nПрочность: ${strength.toFixed(1)} МПа\nПлотность: ${density.toFixed(2)} г/см³\nЭлектропроводность: ${conductivity.toFixed(1)}% IACS`);
  };

  return (
    <div className="panel alloy-calculator">
      <h2>Калькулятор сплавов</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ margin: '0.5rem 0' }}>
          <label>Магний (Mg): </label>
          <input
            type="number"
            value={composition.Mg}
            onChange={(e) => handleCompositionChange('Mg', parseFloat(e.target.value) || 0)}
            min="0"
            max="10"
            step="0.1"
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          />
          <span>%</span>
        </div>

        <div style={{ margin: '0.5rem 0' }}>
          <label>Кремний (Si): </label>
          <input
            type="number"
            value={composition.Si}
            onChange={(e) => handleCompositionChange('Si', parseFloat(e.target.value) || 0)}
            min="0"
            max="10"
            step="0.1"
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          />
          <span>%</span>
        </div>

        <div style={{ margin: '0.5rem 0' }}>
          <label>Медь (Cu): </label>
          <input
            type="number"
            value={composition.Cu}
            onChange={(e) => handleCompositionChange('Cu', parseFloat(e.target.value) || 0)}
            min="0"
            max="10"
            step="0.1"
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          />
          <span>%</span>
        </div>
      </div>

      <button onClick={calculateProperties}>
        Рассчитать свойства
      </button>
    </div>
  );
};

export default AlloyCalculator;