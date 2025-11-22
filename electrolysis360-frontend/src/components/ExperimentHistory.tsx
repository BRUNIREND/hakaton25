import React from 'react';

const ExperimentHistory: React.FC = () => {
  return (
    <div className="panel experiment-history">
      <h2>Журнал экспериментов</h2>
      <div className="history-content">
        <p>Функция журнала экспериментов будет реализована в следующей версии</p>
        <button onClick={() => alert('Журнал экспериментов в разработке')}>
          Показать историю
        </button>
      </div>
    </div>
  );
};

export default ExperimentHistory;