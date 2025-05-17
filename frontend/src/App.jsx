// filepath: /sign-language-translator/sign-language-translator/src/App.jsx

import React, { useState } from 'react';
import Camera from './components/Camera/Camera';
import TranslationBox from './components/TranslationBox/TranslationBox';
import './App.css';

export default function App() {
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslationUpdate = (text) => {
    setTranslatedText(text);
  };

  return (
    <div className="app-container">
      <Camera onTranslationUpdate={handleTranslationUpdate} />
      <TranslationBox translatedText={translatedText} />
    </div>
  );
}