import { initializeApp } from "firebase/app";
import { child, get, getDatabase, push, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCWpRsJAPU9iiXNaA6QrVXEfow1hQ7pfsw",
  authDomain: "polylens-f96fa.firebaseapp.com",
  databaseURL: "https://polylens-f96fa-default-rtdb.firebaseio.com",
  projectId: "polylens-f96fa",
  storageBucket: "polylens-f96fa.appspot.com",
  messagingSenderId: "789592514229",
  appId: "1:789592514229:web:80b827541655037e8328fc",
  measurementId: "G-TMT4Z0M7T8",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function saveTranslation({
  detectedLabel,
  confidence,
  language = "Chinese Sign Language",
  bufferSize = 5,
}) {
  const refPath = ref(db, "csl_translations/");
  push(refPath, {
    label: detectedLabel,
    confidence: Math.round(confidence * 100),
    language,
    bufferSize,
    timestamp: Date.now(),
  });
}

export async function getRecentTranslations(limit = 10) {
  const snapshot = await get(child(ref(db), "csl_translations/"));
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.values(data)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export default db;
