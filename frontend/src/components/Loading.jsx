import React, { useEffect, useState } from 'react';
import './Loading.css';

const Loading = ({ onLoadingComplete }) => {
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinishing(true);
      setTimeout(onLoadingComplete, 800);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`loading-container ${isFinishing ? 'fade-exit' : ''}`}>
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2>Loading Sign Language Translator...</h2>
      </div>
    </div>
  );
};

export default Loading;