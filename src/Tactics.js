import React, { useState, useEffect } from 'react';
import './Tactics.css';

function Tactics() {
  const [formation, setFormation] = useState(() => {
    const savedFormation = localStorage.getItem('formation');
    return savedFormation ? savedFormation : '4-4-2';
  });
  const [attack, setAttack] = useState(() => {
    const savedAttack = localStorage.getItem('attack');
    return savedAttack ? savedAttack : 'ShortPassing';
  });
  const [defense, setDefense] = useState(() => {
    const savedDefense = localStorage.getItem('defense');
    return savedDefense ? savedDefense : 'Stay';
  });

  useEffect(() => {
    localStorage.setItem('formation', formation);
  }, [formation]);

  useEffect(() => {
    localStorage.setItem('attack', attack);
  }, [attack]);

  useEffect(() => {
    localStorage.setItem('defense', defense);
  }, [defense]);

  const formations = [
    '4-4-2', '4-4-1-1', '4-3-3', '4-2-4', '4-2-3-1',
    '3-5-2', '3-4-3', '3-4-2-1', '3-1-2-4', '5-3-2', '5-4-1'
  ];

  const attacks = ['ShortPassing', 'Long', 'Give the ball'];

  const defenses = ['Stay', 'Widen', 'Close', 'GegenPress'];

  return (
    <div className="tactics">
      <h2>Formation:</h2>
      <div className="options">
        {formations.map((f) => (
          <button
            key={f}
            className={formation === f ? 'selected' : ''}
            onClick={() => setFormation(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <h2>Attack:</h2>
      <div className="options">
        {attacks.map((a) => (
          <button
            key={a}
            className={attack === a ? 'selected' : ''}
            onClick={() => setAttack(a)}
          >
            {a}
          </button>
        ))}
      </div>

      <h2>Defense:</h2>
      <div className="options">
        {defenses.map((d) => (
          <button
            key={d}
            className={defense === d ? 'selected' : ''}
            onClick={() => setDefense(d)}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tactics;
