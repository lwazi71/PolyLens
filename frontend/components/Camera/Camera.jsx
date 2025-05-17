import React, { useRef, useEffect } from 'react';
import { initializeOpenCV, processFrame } from '../../services/opencv';
import './Camera.css';

const Camera = ({ onFrameProcessed }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      const videoElement = videoRef.current;
      videoElement.play();

      initializeOpenCV(videoElement, onFrameProcessed);
    };

    startCamera();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, [onFrameProcessed]);

  return (
    <div className="camera-container">
      <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
    </div>
  );
};

export default Camera;