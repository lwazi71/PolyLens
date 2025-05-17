import React from 'react';
import { useNavigate } from 'react-router-dom';
import CSLTranslator from './components/CSLTranslator';

const MainContent = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      {/* Left side */}
      <div className="hero-left">
        <h1>
          Hello,<br />
          This is Chinese Sign Language Translator.
        </h1>
        <p>카메라 앞에서 수화를 해보세요!</p>
        <button className="history-button" onClick={() => navigate('/history')}>
          기록 보기
        </button>
      </div>

      {/* Right side  */}
      <div className="hero-right">
        <CSLTranslator />
      </div>
    </div>
  );
};

export default MainContent;
