// Utility to dynamically load MediaPipe Hands JS library
export function loadMediaPipeHandsScript() {
  return new Promise((resolve, reject) => {
    if (window.Hands) return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
