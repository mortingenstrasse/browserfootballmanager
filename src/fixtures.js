// src/fixtures.js
import teams from './data/teams.json';

const isHoliday = (date) => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  return (month === 7); // Sadece Temmuz tatil
};

const generateFixtures = (teamName, startYear = 2024) => {
  if (!teamName) {
    console.error('Team name is undefined.');
    return [];
  }

  const selectedTeam = teams.find(team => team.name === teamName);

  if (!selectedTeam) {
    console.error(`Team with name ${teamName} not found.`);
    return [];
  }

  const leagueTeams = teams.filter(team => team.country === selectedTeam.country && team.name !== selectedTeam.name);
  const matches = [];
  let matchDate = new Date(`${startYear}-08-01`); // Start from August
  const endDate = new Date(`${startYear + 1}-06-30`);
  let matchDayCounter = 1; // Maç günü sayacı

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  shuffleArray(leagueTeams);

  // İlk yarı maçları
  leagueTeams.forEach((team, index) => {
    const match = {
      date: new Date(matchDate),
      opponent: team.name,
      location: 'Home',
      matchDay: matchDayCounter++
    };
    matches.push(match);
    matchDate.setDate(matchDate.getDate() + 6);
  });

  // Lig Arası
  matches.push({
    date: new Date(matchDate),
    opponent: 'Lig Arası',
    location: '',
    matchDay: 'Break'
  });
  matchDate.setDate(matchDate.getDate() + 7); // Lig arasını 1 hafta yapıyoruz

  // İkinci yarı maçları (ters sırayla)
  leagueTeams.reverse().forEach((team, index) => {
    const match = {
      date: new Date(matchDate),
      opponent: team.name,
      location: 'Away',
      matchDay: matchDayCounter++
    };
    matches.push(match);
    matchDate.setDate(matchDate.getDate() + 6);
  });

  // Maç tarihlerini ayarlamak
  const adjustMatchDates = (matches) => {
    const adjustedMatches = [];
    let currentDate = new Date(`${startYear}-08-01`);
    matches.forEach((match, index) => {
      if (isHoliday(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 7);
      }
      match.date = new Date(currentDate);
      adjustedMatches.push(match);
      currentDate.setDate(currentDate.getDate() + (index >= matches.length - 6 ? 3 : 6)); // Son 6 maç 3 günde bir
    });
    return adjustedMatches;
  };

  const allDates = adjustMatchDates(matches);

  return allDates;
};

export default generateFixtures;
