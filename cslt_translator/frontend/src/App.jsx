import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CSLTranslator from './components/CSLTranslator';
import History from './components/History';
import './App.css';

const MainContent = () => {
  const navigate = useNavigate();
  
  return (
    <div className="app-wrapper">
      <h1>Chinese Sign Language Translator</h1>
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
      
      <button className="history-button" onClick={() => navigate('/history')}>
        History
      </button>
    </div>
  );
};

function App() {
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