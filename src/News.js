import React, { useState, useContext } from 'react';
import './News.css';
import MatchScreen from './MatchScreen'; // MatchScreen bileşenini import edelim
import { MatchResultsContext } from './MatchResultsContext';

function News({ currentDate, fixtures, onContinue, onNextSeason, endOfSeason, onGoToMatch, userTeam }) {
  const [loading, setLoading] = useState(false);
  const [showMatchScreen, setShowMatchScreen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const { setMatchResults } = useContext(MatchResultsContext); // matchResults'u sıfırlamak için kullanacağız

  const handleContinueClick = () => {
    setLoading(true);
    setTimeout(() => {
      onContinue();
      setLoading(false);
    }, 700);
  };

  const handleNextSeasonClick = () => {
    setLoading(true);
    setTimeout(() => {
      onNextSeason();
      setMatchResults([]); // matchResults'u sıfırla
      setLoading(false);
    }, 700);
  };

  const handleGoToMatch = (match) => {
    setCurrentMatch(match);
    setShowMatchScreen(true);
  };

  const handleCloseMatch = () => {
    setShowMatchScreen(false);
    onContinue();
  };

  const currentFixture = fixtures.find(fixture => new Date(fixture.date).toDateString() === currentDate.toDateString());

  let program = "No program for today";
  let buttonText = "Continue";
  let buttonAction = handleContinueClick;

  if (currentFixture) {
    if (currentFixture.training) {
      program = "Today's program: Training Day";
    } else if (!currentFixture.holiday) {
      program = `Today's program: Match Day (Match against: ${currentFixture.opponent})`;
      buttonText = "Go to Match";
      buttonAction = () => handleGoToMatch(currentFixture);
    }
  }

  return (
    <div className="news">
      <p>{program}</p>
      {currentDate < endOfSeason ? (
        <button className="continue-button" onClick={buttonAction}>{buttonText}</button>
      ) : (
        <button className="continue-button" onClick={handleNextSeasonClick}>Start Next Season</button>
      )}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}
      {showMatchScreen && (
        <MatchScreen match={currentMatch} onClose={handleCloseMatch} userTeam={userTeam} />
      )}
    </div>
  );
}

export default News;
