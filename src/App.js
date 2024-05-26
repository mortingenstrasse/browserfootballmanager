import React, { useState } from 'react';
import './App.css';
import countries from './data/countries.json';
import players from './data/players.json';
import teams from './data/teams.json';
import TeamSelection from './TeamSelection';
import LoadingScreen from './LoadingScreen';
import ManagerScreen from './ManagerScreen';

const questions = {
  question1: 5,
  question2: 12,
  question3: 8,
  question4: 14,
  question5: 6,
  question6: 10,
  question7: 15,
  question8: 9,
  question9: 11,
  question10: 7
};

function App() {
  const [directorName, setDirectorName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [teamData, setTeamData] = useState(teams);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [step, setStep] = useState('form');
  const [tactics, setTactics] = useState({
    formation: '4-4-2',
    attack: 'ShortPassing',
    defense: 'Stay'
  });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState(`question${Math.floor(Math.random() * 10) + 1}`);
  const [showAbout, setShowAbout] = useState(false);

  const handleNameChange = (event) => {
    setDirectorName(event.target.value);
  };

  const handleSurnameChange = (event) => {
    setSurname(event.target.value);
  };

  const handleAgeChange = (event) => {
    const { value } = event.target;
    if (!isNaN(value) && value >= 0) {
      setAge(value);
    }
  };

  const handleNationalityChange = (event) => {
    setNationality(event.target.value);
  };

  const handleCaptchaAnswerChange = (event) => {
    setCaptchaAnswer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!directorName) newErrors.directorName = true;
    if (!surname) newErrors.surname = true;
    if (!age) newErrors.age = true;
    if (!nationality) newErrors.nationality = true;
    if (parseInt(captchaAnswer) !== questions[captchaQuestion]) newErrors.captcha = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setStep('teamSelection');
    }
  };

  const handleTeamSelectionNext = (team) => {
    setSelectedTeam(team);
    setLoading(true);
  };

  const handleLoadingComplete = () => {
    const goalkeepers = players.filter((player) => player.position === 'Goalkeeper');
    const defenders = players.filter((player) => player.position === 'Defender');
    const midfielders = players.filter((player) => player.position === 'Midfielder');
    const forwards = players.filter((player) => player.position === 'Forward');

    const randomPlayers = (playerArray, count) => {
      const shuffled = playerArray.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const teamPlayers = [
      ...randomPlayers(goalkeepers, 3),
      ...randomPlayers(defenders, 8),
      ...randomPlayers(midfielders, 8),
      ...randomPlayers(forwards, 4)
    ];

    const updatedTeamData = teamData.map((team) => {
      if (team.name === selectedTeam) {
        return { ...team, players: teamPlayers };
      }
      return team;
    });

    setTeamData(updatedTeamData);
    setLoading(false);
    setStep('managerScreen');
  };

  const handleBack = () => {
    setStep('form');
  };

  const handleTacticsChange = (newTactics) => {
    setTactics(newTactics);
  };

  const handleShowAbout = () => {
    setShowAbout(true);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
  };

  if (loading) {
    return <LoadingScreen onLoaded={handleLoadingComplete} />;
  }

  if (step === 'managerScreen') {
    const currentTeam = teamData.find((team) => team.name === selectedTeam);
    return (
      <ManagerScreen
        teamName={selectedTeam}
        directorName={directorName}
        surname={surname}
        tactics={tactics}
        onTacticsChange={handleTacticsChange}
        teamPlayers={currentTeam ? currentTeam.players : []}
      />
    );
  }

  if (step === 'teamSelection') {
    return <TeamSelection onNext={handleTeamSelectionNext} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Browser Football Manager</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Technical Director Name:</label>
            <input
              type="text"
              value={directorName}
              onChange={handleNameChange}
              style={{ borderColor: errors.directorName ? 'red' : 'black' }}
            />
          </div>
          <div className="form-group">
            <label>Surname:</label>
            <input
              type="text"
              value={surname}
              onChange={handleSurnameChange}
              style={{ borderColor: errors.surname ? 'red' : 'black' }}
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="text"
              value={age}
              onChange={handleAgeChange}
              style={{ borderColor: errors.age ? 'red' : 'black' }}
            />
          </div>
          <div className="form-group">
            <label>Nationality:</label>
            <select
              value={nationality}
              onChange={handleNationalityChange}
              style={{ borderColor: errors.nationality ? 'red' : 'black' }}
            >
              <option value="" disabled>Select your nationality</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <img src={require(`./data/images/${captchaQuestion}.png`)} alt="captcha question" />
            <input
              type="text"
              value={captchaAnswer}
              onChange={handleCaptchaAnswerChange}
              style={{ borderColor: errors.captcha ? 'red' : 'black' }}
              placeholder="Enter the result"
            />
            {errors.captcha && <span className="error">Incorrect answer. Please try again.</span>}
          </div>
          <button type="submit" className="next-button">Next</button>
        </form>
        <button onClick={handleShowAbout} className="about-button">About Browser Football Manager</button>
      </header>

      {showAbout && (
        <div className="about-modal">
          <div className="about-content">
            <span className="close-button" onClick={handleCloseAbout}>&times;</span>
            <h2>About Browser Football Manager</h2>
            <p>Experience a fast, practical, and effortless gaming adventure with Browser Football Manager. With fictional names but real-life tactics and football strategies, achieve success through modern experiments. The strength of your squad and your chosen tactics will help you overcome rival teams. The Transfer Module will be available soon. Continuous improvements are on the way. Version: 1.0, Developed by: Kilisli. For feedback and suggestions, or if you're interested in developing similar projects, contact: masalacharas@gmail.com.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
