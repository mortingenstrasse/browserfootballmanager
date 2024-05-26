import React, { useState } from 'react';
import './TeamSelection.css';
import teams from './data/teams.json';

function TeamSelection({ onNext }) {
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
    setSelectedTeam('');
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleNext = () => {
    if (selectedTeam) {
      onNext(selectedTeam);
    }
  };

  const leagues = [...new Set(teams.map((team) => team.country))];

  const leagueTeams = teams.filter((team) => team.country === selectedLeague);

  return (
    <div className="team-selection">
      <div className="content">
        <h2>Select League</h2>
        <select value={selectedLeague} onChange={handleLeagueChange}>
          <option value="" disabled>Select your league</option>
          {leagues.map((league) => (
            <option key={league} value={league}>{league}</option>
          ))}
        </select>

        {selectedLeague && (
          <>
            <h2>Select Team</h2>
            <select value={selectedTeam} onChange={handleTeamChange}>
              <option value="" disabled>Select your team</option>
              {leagueTeams.map((team) => (
                <option key={team.name} value={team.name}>{team.name}</option>
              ))}
            </select>
          </>
        )}

        {selectedTeam && (
          <div className="contract">
            <p>Contract Offer: {Math.floor(Math.random() * 3) + 1} years, ${Math.floor(Math.random() * 86000) + 15000} per year</p>
            <button onClick={handleNext}>Accept & Start Career</button>
            <button onClick={() => onNext(null)}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamSelection;
