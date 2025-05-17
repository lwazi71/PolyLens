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
    // 스크롤 시 애니메이션을 위한 IntersectionObserver 설정
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 요소가 화면에 들어올 때
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            console.log('Section visible:', entry.target); // 디버깅용
          } 
          // 요소가 화면에서 벗어날 때
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

    // animate-section 클래스를 가진 모든 요소 관찰
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
        <h1>Chinese Sign Language Translator</h1>
        <p className="note-text">Note: Please make motion slowly!</p>
        
        <div className="translator-layout">
          <div className="camera-section">
            <CSLTranslator />
          </div>
          
          <div className="text-box">
            <h2>Translated Text (English)</h2>
            <div className="text-output">
              Hello! (or translation result here)
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-sections">
        <div className="animate-section">
          <InfoSection />
        </div>
      </div>
      
      <button className="history-button" onClick={() => navigate('/history')}>
        History
      </button>
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