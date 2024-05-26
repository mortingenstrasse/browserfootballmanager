import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MatchResultsProvider } from './MatchResultsContext';

ReactDOM.render(
  <React.StrictMode>
    <MatchResultsProvider>
      <App />
    </MatchResultsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
