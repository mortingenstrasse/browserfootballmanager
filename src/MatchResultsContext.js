import React, { createContext, useState } from 'react';

export const MatchResultsContext = createContext();

export const MatchResultsProvider = ({ children }) => {
  const [matchResults, setMatchResults] = useState([]);

  const addMatchResult = (result) => {
    setMatchResults(prevResults => [...prevResults, result]);
  };

  return (
    <MatchResultsContext.Provider value={{ matchResults, addMatchResult }}>
      {children}
    </MatchResultsContext.Provider>
  );
};
