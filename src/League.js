import React, { useContext, useState, useEffect } from 'react';
import './League.css';
import { MatchResultsContext } from './MatchResultsContext';
import teams from './data/teams.json'; // Takım verilerini import edin

const LeagueTable = ({ standings }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>MP</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>PTS</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team, index) => (
          <tr key={index}>
            <td>{team.name}</td>
            <td>{team.played}</td>
            <td>{team.wins}</td>
            <td>{team.draws}</td>
            <td>{team.losses}</td>
            <td>{team.goalsFor}</td>
            <td>{team.goalsAgainst}</td>
            <td>{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function League() {
  const { matchResults } = useContext(MatchResultsContext);
  const [userCountry, setUserCountry] = useState(null); // Kullanıcının ülkesini tutmak için state
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    if (matchResults.length > 0) {
      const firstResult = matchResults[0];
      const matchParts = firstResult.match(/(.+?) \d+ - \d+ (.+)/);

      // Maç sonucu formatını kontrol edelim
      if (matchParts && matchParts.length >= 3) {
        const homeTeam = matchParts[1].trim();
        const awayTeam = matchParts[2].trim();

        const homeTeamData = teams.find(team => team.name === homeTeam);
        const awayTeamData = teams.find(team => team.name === awayTeam);

        if (homeTeamData && awayTeamData && homeTeamData.country === awayTeamData.country) {
          setUserCountry(homeTeamData.country);
        }
      }
    }
  }, [matchResults]);

  useEffect(() => {
    if (userCountry) {
      const initialStandings = teams
        .filter(team => team.country === userCountry)
        .map(team => ({
          name: team.name,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        }));

      const allResults = [];

      matchResults.forEach(result => {
        allResults.push(result);
      });

      const leagueTeams = teams.filter(team => team.country === userCountry);

      matchResults.forEach(result => {
        const matchParts = result.match(/(.+?) \d+ - \d+ (.+)/);
        if (matchParts && matchParts.length >= 3) {
          const homeTeam = matchParts[1].trim();
          const awayTeam = matchParts[2].trim();
          const excludeTeams = new Set([homeTeam, awayTeam]);
          const randomResults = generateRandomResults(Array.from(excludeTeams), leagueTeams);
          randomResults.forEach(randomResult => {
            allResults.push(randomResult);
          });
        }
      });

      const updatedStandings = [...initialStandings];

      allResults.forEach(result => {
        processMatchResult(result, updatedStandings);
      });

      updatedStandings.forEach(team => {
        team.points = team.wins * 3 + team.draws;
      });

      updatedStandings.sort((a, b) => b.points - a.points || b.wins - a.wins || b.played - a.played);
      setStandings(updatedStandings);
    }
  }, [matchResults, userCountry]);

  const getRandomScore = () => Math.floor(Math.random() * 5);

  const generateRandomResults = (excludeTeams, leagueTeams) => {
    const otherTeams = leagueTeams.filter(team => !excludeTeams.includes(team.name));
    const randomResults = [];
    const teamPairs = [];

    // Takımları çiftler halinde ayarlıyoruz
    for (let i = 0; i < otherTeams.length; i += 2) {
      if (otherTeams[i + 1]) {
        teamPairs.push([otherTeams[i], otherTeams[i + 1]]);
      }
    }

    // Her çift için random sonuçlar oluşturuyoruz
    teamPairs.forEach(pair => {
      const [homeTeam, awayTeam] = pair;
      const result = `${homeTeam.name} ${getRandomScore()} - ${getRandomScore()} ${awayTeam.name}`;
      randomResults.push(result);
    });

    return randomResults;
  };

  const processMatchResult = (result, standings) => {
    const [homeTeamName, homeScore, awayScore, awayTeamName] = result.match(/(.+?) (\d+) - (\d+) (.+)/).slice(1, 5);
    const homeTeam = standings.find(team => team.name === homeTeamName);
    const awayTeam = standings.find(team => team.name === awayTeamName);

    if (homeTeam && awayTeam) {
      homeTeam.played += 1;
      awayTeam.played += 1;

      homeTeam.goalsFor += parseInt(homeScore);
      awayTeam.goalsFor += parseInt(awayScore);

      homeTeam.goalsAgainst += parseInt(awayScore);
      awayTeam.goalsAgainst += parseInt(homeScore);

      if (homeScore > awayScore) {
        homeTeam.wins += 1;
        awayTeam.losses += 1;
      } else if (homeScore < awayScore) {
        awayTeam.wins += 1;
        homeTeam.losses += 1;
      } else {
        homeTeam.draws += 1;
        awayTeam.draws += 1;
      }
    }
  };

  return (
    <div className="league">
      {matchResults.length > 0 && userCountry && (
        <>
          <h2>{userCountry} League Standings</h2>
          <LeagueTable standings={standings} />
          <ul className="match-results">
            {matchResults.map((result, index) => {
              const matchParts = result.match(/(.+?) \d+ - \d+ (.+)/);
              if (!matchParts) {
                return null;
              }
              const homeTeam = matchParts[1].trim();
              const awayTeam = matchParts[2].trim();

              const excludeTeams = new Set([homeTeam, awayTeam]);
              const leagueTeams = teams.filter(team => team.country === userCountry);
              const randomResults = generateRandomResults(Array.from(excludeTeams), leagueTeams);
              const displayedTeams = new Set();

              return (
                <div key={index}>
                  <h3>{`${index + 1}. Match Day`}</h3>
                  <ul>
                    <li className="highlighted-result">{result}</li>
                    {randomResults.map((randomResult, i) => {
                      const resultParts = randomResult.match(/(.+?) \d+ - \d+ (.+)/);
                      if (!resultParts) {
                        return null;
                      }
                      const randomHomeTeam = resultParts[1].trim();
                      const randomAwayTeam = resultParts[2].trim();

                      if (displayedTeams.has(randomHomeTeam) || displayedTeams.has(randomAwayTeam)) {
                        return null;
                      }
                      displayedTeams.add(randomHomeTeam);
                      displayedTeams.add(randomAwayTeam);
                      return <li key={`${index}-${i}`}>{randomResult}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default League;
