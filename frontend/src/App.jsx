import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CSLTranslator from './components/CSLTranslator';
import History from './components/History';
import Loading from './components/Loading';
import InfoSection from './components/InfoSection';
import './App.css';

const BENCHMARK_SAMPLE_SIZE = 50;

const isValidLandmarks = (value) => (
  Array.isArray(value)
  && value.length === 21
  && value.every((pt) => Array.isArray(pt) && pt.length === 3 && pt.every(Number.isFinite))
);

const getP95 = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
  return sorted[index];
};

const BenchmarkButton = ({ onRun, disabled, isRunning, sampleSize }) => (
  <button
    onClick={onRun}
    disabled={disabled}
    style={{ marginTop: 10, padding: '8px 16px', fontSize: 16 }}
  >
    {isRunning ? 'Running Benchmark...' : `Run Benchmark Test (${sampleSize})`}
  </button>
);

const MainContent = () => {
  const navigate = useNavigate();
  const [landmarks, setLandmarks] = useState(null);  // 벡터값 상태 추가
  const [prediction, setPrediction] = useState(null); // Prediction result
  const [isSending, setIsSending] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [perfStats, setPerfStats] = useState({
    avgLatencyMs: 0,
    p95LatencyMs: 0,
    fps: 0,
    sampleCount: 0,
  });
  const debounceRef = useRef(null);
  const roundTripLatenciesRef = useRef([]);
  const totalLatencyMsRef = useRef(0);
  const testStartTimeRef = useRef(null);

  const handleLandmarksUpdate = (newLandmarks) => {
    setLandmarks(newLandmarks);
  };

  const updatePerfStats = (roundTripMs) => {
    roundTripLatenciesRef.current.push(roundTripMs);
    totalLatencyMsRef.current += roundTripMs;

    const sampleCount = roundTripLatenciesRef.current.length;
    const avgLatencyMs = totalLatencyMsRef.current / sampleCount;
    const p95LatencyMs = getP95(roundTripLatenciesRef.current);
    const elapsedSeconds = testStartTimeRef.current
      ? (performance.now() - testStartTimeRef.current) / 1000
      : 0;
    const fps = elapsedSeconds > 0 ? sampleCount / elapsedSeconds : 0;

    setPerfStats({ avgLatencyMs, p95LatencyMs, fps, sampleCount });
  };

  const sendPredictionRequest = async (landmarkPayload) => {
    if (testStartTimeRef.current === null) {
      testStartTimeRef.current = performance.now();
    }

    const requestStart = performance.now();
    let backendInferenceMs = null;

    try {
      const res = await fetch('http://localhost:8000/predict-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarks: landmarkPayload })
      });

      const data = await res.json();
      if (typeof data?.backend_inference_ms === 'number') {
        backendInferenceMs = data.backend_inference_ms;
      }

      if (!res.ok) {
        setPrediction({
          label: data.detail || 'Error',
          confidence: 0,
          backend_inference_ms: backendInferenceMs,
        });
      } else {
        setPrediction(data);
      }

      return data;
    } catch (err) {
      setPrediction({ label: 'Error', confidence: 0, backend_inference_ms: null });
      return null;
    } finally {
      const roundTripMs = performance.now() - requestStart;
      updatePerfStats(roundTripMs);

      const backendPart = backendInferenceMs === null ? 'N/A' : backendInferenceMs.toFixed(2);
      console.log(`[FRONTEND] round_trip_ms=${roundTripMs.toFixed(2)}, backend_inference_ms=${backendPart}`);
    }
  };

  const handleSend = async () => {
    if (!isValidLandmarks(landmarks)) {
      setPrediction({ label: 'No valid hand detected', confidence: 0, backend_inference_ms: null });
      return;
    }

    setIsSending(true);
    await sendPredictionRequest(landmarks);
    setIsSending(false);
  };

  const handleRunBenchmark = async () => {
    if (!isValidLandmarks(landmarks)) {
      setPrediction({ label: 'No valid hand detected', confidence: 0, backend_inference_ms: null });
      return;
    }

    roundTripLatenciesRef.current = [];
    totalLatencyMsRef.current = 0;
    testStartTimeRef.current = performance.now();
    setPerfStats({
      avgLatencyMs: 0,
      p95LatencyMs: 0,
      fps: 0,
      sampleCount: 0,
    });

    const fixedLandmarks = landmarks.map((pt) => [...pt]);

    setIsBenchmarking(true);
    for (let i = 0; i < BENCHMARK_SAMPLE_SIZE; i += 1) {
      await sendPredictionRequest(fixedLandmarks);
    }
    setIsBenchmarking(false);

    const benchmarkLatencies = roundTripLatenciesRef.current;
    if (!benchmarkLatencies.length) return;

    const benchmarkTotalMs = benchmarkLatencies.reduce((sum, value) => sum + value, 0);
    const benchmarkAvgMs = benchmarkTotalMs / benchmarkLatencies.length;
    const benchmarkP95Ms = getP95(benchmarkLatencies);
    const benchmarkElapsedSeconds = testStartTimeRef.current
      ? (performance.now() - testStartTimeRef.current) / 1000
      : 0;
    const benchmarkFps = benchmarkElapsedSeconds > 0
      ? benchmarkLatencies.length / benchmarkElapsedSeconds
      : 0;

    console.log('----- FINAL RESULTS -----');
    console.log(`Avg latency: ${benchmarkAvgMs.toFixed(2)} ms`);
    console.log(`P95 latency: ${benchmarkP95Ms.toFixed(2)} ms`);
    console.log(`FPS: ${benchmarkFps.toFixed(2)}`);
  };

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
            <BenchmarkButton
              onRun={handleRunBenchmark}
              disabled={isSending || isBenchmarking}
              isRunning={isBenchmarking}
              sampleSize={BENCHMARK_SAMPLE_SIZE}
            />
            <div style={{ marginTop: 16 }}>
              <h2>Prediction</h2>
              {prediction ? (
                <div style={{ color: '#222', fontWeight: 'bold', fontSize: 22, background: '#fff', padding: 8, borderRadius: 6, boxShadow: '0 1px 6px #0001', display: 'inline-block' }}>
                  <b>Label:</b> {prediction.label} <br />
                  <b>Confidence:</b> {prediction.confidence} <br />
                  <b>Backend inference:</b> {typeof prediction.backend_inference_ms === 'number' ? prediction.backend_inference_ms.toFixed(2) : 'N/A'} ms
                </div>
              ) : (
                <span style={{ color: '#444' }}>No prediction</span>
              )}
            </div>
            <div style={{ marginTop: 16, color: '#222', fontSize: 14, textAlign: 'left' }}>
              <h2>Performance Metrics</h2>
              <div>Avg latency: {perfStats.avgLatencyMs.toFixed(2)} ms</div>
              <div>P95 latency: {perfStats.p95LatencyMs.toFixed(2)} ms</div>
              <div>FPS: {perfStats.fps.toFixed(2)}</div>
              <div>Sample count: {perfStats.sampleCount}</div>
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