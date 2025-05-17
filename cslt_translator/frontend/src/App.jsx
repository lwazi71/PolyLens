import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CSLTranslator from './components/CSLTranslator';
import History from './components/History';
import Loading from './components/Loading';
import InfoSection from './components/InfoSection';
import './App.css';

const MainContent = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            console.log('Section visible:', entry.target);
          } 
          else {
            entry.target.classList.remove('visible');
            console.log('Section hidden:', entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    const sections = document.querySelectorAll('.animate-section');
    sections.forEach((section) => {
      if (!section.classList.contains('initial-view')) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="app-wrapper">
      <div className="initial-view">
        <div>Polylens</div>
      </div>
      <div className="scroll-sections">
        <div className="animate-section">
          <InfoSection />
        </div>
      </div>
      
      <button className="history-button" onClick={() => navigate('/history')}>
        History
      </button>
      <h1>Let's try Polylens!</h1>
        <p className="note-text">Note: Please make motion slowly!</p>
        
        <div className="translator-layout">
          <div className="camera-section">
            <CSLTranslator />
          </div>
          
          <div className="text-box">
            <h2>Vectors of the landmarks (Console)</h2>
            <div className="text-output">
              Hello! (or translation result here)
            </div>
          </div>
        </div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;