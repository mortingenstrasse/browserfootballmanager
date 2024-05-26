import React, { useEffect } from 'react';
import './App.css'; // Ensure you have the styles from App.css

function LoadingScreen({ onLoaded }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoaded();
    }, 2000); // Simulate loading time
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className="loading-screen">
      <div className="content">
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
