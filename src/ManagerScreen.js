import React, { useState, useEffect, useContext } from 'react';
import './ManagerScreen.css';
import Tactics from './Tactics';
import News from './News';
import MatchScreen from './MatchScreen';
import League from './League';
import Squad from './Squad'; // Squad bileşenini import edelim
import generateFixtures from './fixtures';
import { MatchResultsProvider, MatchResultsContext } from './MatchResultsContext';

function ManagerScreen({ teamName, directorName, surname, tactics, onTacticsChange, teamPlayers }) {
  const { setMatchResults } = useContext(MatchResultsContext);
  const [tab, setTab] = useState('News');
  const [date, setDate] = useState(new Date('2024-08-01'));
  const [fixtures, setFixtures] = useState([]);
  const [currentDate, setCurrentDate] = useState(date);
  const [season, setSeason] = useState(2024);
  const [showMatchScreen, setShowMatchScreen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);

  useEffect(() => {
    const fixtures = generateFixtures(teamName, season);
    setFixtures(fixtures);
  }, [teamName, season]);

  const handleContinue = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 2);
    setDate(newDate);
    setCurrentDate(newDate);
  };

  const handleNextSeason = () => {
    setSeason(season + 1);
    setDate(new Date(`${season + 1}-08-01`));
    setCurrentDate(new Date(`${season + 1}-08-01`));
    setMatchResults([]); // Yeni sezona geçerken matchResults'u temizle
  };

  const handleGoToMatch = (match) => {
    setCurrentMatch(match);
    setShowMatchScreen(true);
  };

  const handleMatchEnd = (result) => {
    console.log("Maç sonucu managerScreen.js'e geldi:", result);
    setShowMatchScreen(false);
    handleContinue();
  };

  const handleTabChange = (newTab) => {
    if (newTab === 'League') {
      console.log("League tabına geçildi");
    }
    setTab(newTab);
  };

  const endOfSeason = new Date(`${season + 1}-06-30`);

  return (
    <MatchResultsProvider>
      <div className="manager-screen">
        <header>
          <span>{date.toLocaleDateString()}</span>
          <span>MANAGER SCREEN</span>
          <span className="team-name">{teamName}</span>
        </header>
        <div className="content">
          <div className="user-info">
            <span>{directorName} {surname}</span>
          </div>
          <nav>
            <button onClick={() => handleTabChange('News')}>News</button>
            <button onClick={() => handleTabChange('Tactics')}>Tactics</button>
            <button onClick={() => handleTabChange('Squad')}>Squad</button> {/* Squad tab'ı ekleyelim */}
            <button onClick={() => handleTabChange('Fixtures')}>Fixtures</button>
            <button onClick={() => handleTabChange('Transfers')}>Transfers</button>
            <button onClick={() => handleTabChange('League')}>League</button>
          </nav>
          <main>
            {tab === 'News' && (
              <News
                currentDate={currentDate}
                fixtures={fixtures}
                onContinue={handleContinue}
                onNextSeason={handleNextSeason}
                endOfSeason={endOfSeason}
                onGoToMatch={handleGoToMatch}
                userTeam={teamName}
              />
            )}
            {tab === 'Tactics' && (
              <Tactics tactics={tactics} onTacticsChange={onTacticsChange} />
            )}
            {tab === 'Squad' && (
              <Squad teamPlayers={teamPlayers} /> // Squad bileşenini kullanarak kadroyu gösterelim
            )}
            {tab === 'Fixtures' && (
              <div className="fixtures">
                <h2>Fixtures</h2>
                <ul>
                  {fixtures.map((fixture, index) => (
                    <li key={index}>
                      {fixture.date.toLocaleDateString()} - {fixture.holiday ? 'Holiday' : fixture.training ? 'Training' : `${fixture.matchDay}. Match Day (${fixture.opponent} ${fixture.location === 'Home' ? 'H' : 'A'})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'Transfers' && (
              <div className="transfers">
                {/* Transfers content */}
              </div>
            )}
            {tab === 'League' && (
              <League userTeam={teamName} />
            )}
            {showMatchScreen && (
              <MatchScreen match={currentMatch} onClose={handleMatchEnd} userTeam={teamName} />
            )}
          </main>
        </div>
      </div>
    </MatchResultsProvider>
  );
}

export default ManagerScreen;
