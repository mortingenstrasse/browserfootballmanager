import React, { useState, useEffect } from 'react';
import './Squad.css';

const goalkeeperNumbers = ["1", "12", "54", "72"];
const defenderNumbers = ["2", "3", "4", "5", "13", "14", "24", "25", "41", "42", "51", "52", "61", "62", "87", "86"];
const midfielderNumbers = ["6", "8", "16", "10", "20", "26", "30", "31", "33", "34", "35", "37", "40", "55", "60", "70", "80"];
const forwardNumbers = ["7", "9", "11", "17", "18", "19", "21", "27", "77", "88", "91", "99"];

function getRandomNumber(position) {
  let numbers;
  switch (position) {
    case 'Goalkeeper':
      numbers = goalkeeperNumbers;
      break;
    case 'Defender':
      numbers = defenderNumbers;
      break;
    case 'Midfielder':
      numbers = midfielderNumbers;
      break;
    case 'Forward':
      numbers = forwardNumbers;
      break;
    default:
      numbers = [];
  }
  return numbers[Math.floor(Math.random() * numbers.length)];
}

function Squad({ teamPlayers }) {
  const [selectedPlayers, setSelectedPlayers] = useState(() => {
    const saved = localStorage.getItem('selectedPlayers');
    return saved ? JSON.parse(saved) : [];
  });

  const [playerNumbers, setPlayerNumbers] = useState(() => {
    const saved = localStorage.getItem('playerNumbers');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (Object.keys(playerNumbers).length === 0) {
      const newPlayerNumbers = {};
      teamPlayers.forEach(player => {
        newPlayerNumbers[player.id] = getRandomNumber(player.position);
      });
      setPlayerNumbers(newPlayerNumbers);
      localStorage.setItem('playerNumbers', JSON.stringify(newPlayerNumbers));
    }
  }, [teamPlayers, playerNumbers]);

  useEffect(() => {
    localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers));
  }, [selectedPlayers]);

  const togglePlayerSelection = (player) => {
    setSelectedPlayers(prevSelected => {
      if (prevSelected.includes(player.id)) {
        return prevSelected.filter(p => p !== player.id);
      } else if (prevSelected.length < 11) {
        return [...prevSelected, player.id];
      }
      return prevSelected;
    });
  };

  const sortedPlayers = [...teamPlayers].sort((a, b) => {
    if (selectedPlayers.includes(a.id) && !selectedPlayers.includes(b.id)) {
      return -1;
    } else if (!selectedPlayers.includes(a.id) && selectedPlayers.includes(b.id)) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <div className="squad">
      <h2>Squad</h2>
      <div className="starting-lineup">
        <h3>Starting Line-up:</h3>
        <div className="lineup-numbers">
          {selectedPlayers.map(playerId => playerNumbers[playerId]).join(' - ')}
        </div>
      </div>
      <div className="player-list">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`player-card ${selectedPlayers.includes(player.id) ? 'selected' : ''}`}
            onClick={() => togglePlayerSelection(player)}
          >
            <div className="player-info">
              <div className="player-number">{playerNumbers[player.id]}</div>
              <div className="player-details">
                <span className="player-name">{player.name}</span>
                <span className="player-position">{player.position}</span>
              </div>
            </div>
            <div className="player-skills">
              <span>Height: {player.height} cm</span>
              <span>Strength: {player.strength}</span>
              <span>Tackling: {player.tackling}</span>
              <span>Technique: {player.technique}</span>
              <span>Dribbling: {player.dribbling}</span>
              <span>Long Shot: {player.longShot}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Squad;
