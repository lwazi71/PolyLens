import React, { useEffect, useState } from 'react';
import CommunicateSection from './sections/CommunicateSection';
import LearnSection from './sections/LearnSection';
import TranslationSection from './sections/TranslationSection';
import './InfoSection.css';

const InfoSection = () => {
  const [isGradientVisible, setIsGradientVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsGradientVisible(scrollPosition < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`color-transition ${!isGradientVisible ? 'hidden' : ''}`} />
      <div className="info-sections">
        <CommunicateSection />
        <TranslationSection />
        <LearnSection />
      </div>
    </>
  );
};

export default InfoSection;