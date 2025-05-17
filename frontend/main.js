import { saveTranslation } from './firebase.js';

if (counts >= 4 && confidence >= 0.8) {
  setStatus(`Valid: ${label} (${Math.round(confidence * 100)}%)`);
  saveTranslation({
    detectedLabel: label,
    confidence: confidence
  });