import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CSLTranslator from './components/CSLTranslator';
import History from './components/History';
import Loading from './components/Loading';
import InfoSection from './components/InfoSection';
import './App.css';

const MainContent = () => {
  const navigate = useNavigate();
  const [landmarks, setLandmarks] = useState(null);  // 벡터값 상태 추가
  const [prediction, setPrediction] = useState(null); // Prediction result
  const [isSending, setIsSending] = useState(false);
  const debounceRef = useRef(null);

  const handleLandmarksUpdate = (newLandmarks) => {
    setLandmarks(newLandmarks);
  };

  const handleSend = async () => {
    if (!landmarks ||
      !Array.isArray(landmarks) ||
      landmarks.length !== 21 ||
      !landmarks.every(pt => Array.isArray(pt) && pt.length === 3 && pt.every(Number.isFinite))
    ) {
      setPrediction({ label: 'No valid hand detected', confidence: 0 });
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch('http://localhost:8000/predict-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarks })
      });
      const data = await res.json();
      if (!res.ok) {
        setPrediction({ label: data.detail || 'Error', confidence: 0 });
      } else {
        setPrediction(data);
      }
    } catch (err) {
      setPrediction({ label: 'Error', confidence: 0 });
    }
    setIsSending(false);
  };

  // 벡터값을 보기 좋게 포맷팅하는 함수
  const formatLandmarks = (landmarks) => {
    if (!landmarks) return "No hand detected";
    return landmarks.map((point, idx) => 
      `Point ${idx}: (${point.map(v => v.toFixed(4)).join(', ')})`
    ).join('\n');
  };

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
            <CSLTranslator onLandmarksUpdate={handleLandmarksUpdate} />
          </div>
          <div className="text-box">
            <h2>Vectors of the landmarks (Console)</h2>
            <div className="text-output">
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {formatLandmarks(landmarks)}
              </pre>
            </div>
            <button onClick={handleSend} disabled={isSending} style={{ marginTop: 16, padding: '8px 16px', fontSize: 16 }}>
              {isSending ? 'Sending...' : 'Capture & Predict'}
            </button>
            <div style={{ marginTop: 16 }}>
              <h2>Prediction</h2>
              {prediction ? (
                <div style={{ color: '#222', fontWeight: 'bold', fontSize: 22, background: '#fff', padding: 8, borderRadius: 6, boxShadow: '0 1px 6px #0001', display: 'inline-block' }}>
                  <b>Label:</b> {prediction.label} <br />
                  <b>Confidence:</b> {prediction.confidence}
                </div>
              ) : (
                <span style={{ color: '#444' }}>No prediction</span>
              )}
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