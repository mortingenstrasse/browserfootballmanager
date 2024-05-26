import React, { useState, useContext, useEffect } from 'react';
import './MatchScreen.css';
import { MatchResultsContext } from './MatchResultsContext'; // Context'i import edin

function MatchScreen({ match, onClose, userTeam }) {
  const { addMatchResult } = useContext(MatchResultsContext); // Context'i kullanın
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchTime, setMatchTime] = useState(0);
  const [currentEvent, setCurrentEvent] = useState("Teams are ready");
  const [matchEnded, setMatchEnded] = useState(false);

  const isHomeMatch = match.location === 'Home';
  const homeTeam = isHomeMatch ? userTeam : match.opponent;
  const awayTeam = isHomeMatch ? match.opponent : userTeam;

  const getRandomEvent = () => {
    const events = [
      "Promising move! The away team is showing some good attacking intent.",
      "Quick transition! The home team wins the ball back and launches a swift counterattack.",
      "Patient buildup! The away team is patiently passing the ball around, waiting for an opening.",
      "Direct play! The home team is sending long balls forward, hoping to catch the away defense off guard.",
      "Skillful dribbling! The away team winger is weaving his way through the home team defense.",
      "Dangerous cross! The away team fullback whips in a dangerous ball into the box.",
      "Powerful header! The home team striker gets a good head on the ball, but it goes just wide.",
      "Acrobatic save! The away team goalkeeper makes a spectacular save to keep his team in the game."
    ];
    return events[Math.floor(Math.random() * events.length)];
  };

  const getRandomGoalEvent = (scoringTeam) => {
    const goalEvents = [
      "GOAL! GOAL! GOAL!",
      `Goal! ${scoringTeam} takes the lead with a powerful strike from outside the box.`
    ];
    return goalEvents[Math.floor(Math.random() * goalEvents.length)];
  };

  const startMatch = () => {
    setMatchStarted(true);
    const home = Math.floor(Math.random() * 5);
    const away = Math.floor(Math.random() * 5);
    const totalGoals = home + away;

    const goalTimes = [];
    for (let i = 0; i < totalGoals; i++) {
      goalTimes.push(Math.floor(Math.random() * 90));
    }
    goalTimes.sort((a, b) => a - b);

    let homeGoalsScored = 0;
    let awayGoalsScored = 0;

    goalTimes.forEach(time => {
      setTimeout(() => {
        if (homeGoalsScored < home) {
          setCurrentEvent(`${time}' ${getRandomGoalEvent(homeTeam)}`);
          setHomeScore(prevScore => prevScore + 1);
          homeGoalsScored++;
        } else if (awayGoalsScored < away) {
          setCurrentEvent(`${time}' ${getRandomGoalEvent(awayTeam)}`);
          setAwayScore(prevScore => prevScore + 1);
          awayGoalsScored++;
        }
      }, time * 450); // Convert match minute to milliseconds
    });

    const interval = setInterval(() => {
      setMatchTime(prevMinute => {
        if (prevMinute < 90) {
          return prevMinute + 1;
        } else {
          clearInterval(interval);
          setMatchEnded(true);
          return prevMinute;
        }
      });

      if (matchTime < 90) {
        setCurrentEvent(getRandomEvent());
      }
    }, 450); // 450ms = 40 seconds to reach 90 minutes
  };

  const handleMatchEnd = () => {
    const result = `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`;
    console.log("Maç sonucu matchScreen.js'den alındı:", result);
    addMatchResult(result); // Maç sonucunu context'e ekleyin
    onClose(result);
  };

  const buttonAction = matchStarted && matchEnded ? handleMatchEnd : startMatch;
  const buttonText = matchStarted && matchEnded ? 'Continue' : 'Start Match';

  return (
    <div className="match-screen">
      <div className="match-overlay">
        <div className="match-header">
          <span className="match-time">{matchTime}'</span>
        </div>
        <div className="scoreboard">
          <span className="team-name">{homeTeam}</span>
          <span className="match-time score-time">{homeScore}</span>
          <span className="separator">-</span>
          <span className="match-time score-time">{awayScore}</span>
          <span className="team-name">{awayTeam}</span>
        </div>
        <div className="match-body">
          <div className="event-box">{currentEvent}</div>
        </div>
        <button className="continue-button" onClick={buttonAction}>{buttonText}</button>
      </div>
    </div>
  );
}

export default MatchScreen;
