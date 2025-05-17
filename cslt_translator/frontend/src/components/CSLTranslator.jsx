import React, { useEffect, useRef } from 'react';
import { loadMediaPipeHandsScript } from '../utils/mediapipeLoader';

// Draw landmarks and connections on canvas (like mp_drawing in Python)
function drawHand(ctx, landmarks, connections) {
  // Draw connections
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 2;
  connections.forEach(([start, end]) => {
    const a = landmarks[start];
    const b = landmarks[end];
    if (a && b) {
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
  });
  // Draw landmarks
  ctx.fillStyle = '#f00';
  landmarks.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
}

// MediaPipe Hands connections (21 points, 20 connections)
const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],      // Thumb
  [0,5],[5,6],[6,7],[7,8],     // Index
  [5,9],[9,10],[10,11],[11,12],// Middle
  [9,13],[13,14],[14,15],[15,16],// Ring
  [13,17],[0,17],[17,18],[18,19],[19,20] // Pinky & Palm
];

const CSLTranslator = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const isModelReady = useRef(false);
  const isVideoReady = useRef(false);
  const animationIdRef = useRef(null);

  useEffect(() => {
    let stream;

    async function setup() {
      try {
        await loadMediaPipeHandsScript();
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready before playing
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            isVideoReady.current = true;
            initHands();
          };
        }
      } catch (err) {
        console.error('Error setting up video or MediaPipe:', err);
      }
    }

    function initHands() {
      try {
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7
        });
        hands.onResults(onResults);
        handsRef.current = hands;
        isModelReady.current = true;
        requestAnimationFrame(processFrame);
      } catch (err) {
        console.error('Error initializing MediaPipe Hands:', err);
      }
    }

    async function processFrame() {
      if (
        videoRef.current &&
        handsRef.current &&
        isModelReady.current &&
        isVideoReady.current
      ) {
        try {
          await handsRef.current.send({ image: videoRef.current });
        } catch (err) {
          console.error('Error during hands.send:', err);
        }
      }
      animationIdRef.current = requestAnimationFrame(processFrame);
    }

    function onResults(results) {
      const ctx = canvasRef.current?.getContext('2d');
      ctx && ctx.clearRect(0, 0, 480, 360);
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0].map(pt => [pt.x * 480, pt.y * 360]);
        // Draw hand landmarks and connections
        if (ctx) drawHand(ctx, landmarks, HAND_CONNECTIONS);
        // Log the normalized landmark vectors (x, y, z)
        const normLandmarks = results.multiHandLandmarks[0].map(pt => [pt.x, pt.y, pt.z]);
        console.log('Hand landmarks:', normLandmarks);
      }
    }

    setup();
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (handsRef.current) handsRef.current.close();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: 480, height: 360 }}>
      <video ref={videoRef} width={480} height={360} style={{ display: 'block' }} />
      <canvas ref={canvasRef} width={480} height={360} style={{ position: 'absolute', left: 0, top: 0 }} />
      <div style={{ position: 'absolute', left: 10, top: 10, color: '#888', background: '#fff8', padding: 4, borderRadius: 4 }}>
        Detecting...
      </div>
    </div>
  );
};

export default CSLTranslator;
