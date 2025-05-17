import React from 'react';
import './TranslationBox.css';

const TranslationBox = ({ translatedText }) => {
  return (
    <div className="translation-box">
      <h2 className="sub-title">Translated Text (English)</h2>
      <div className="text-box">
        {translatedText || 'Waiting for input...'}
      </div>
    </div>
  );
};

export default TranslationBox;