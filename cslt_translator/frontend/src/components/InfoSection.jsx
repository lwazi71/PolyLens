import React, { useEffect, useState } from 'react';
import './InfoSection.css';

const InfoSection = () => {
  const [isGradientVisible, setIsGradientVisible] = useState(true);

  useEffect(() => {
    // IntersectionObserver 설정
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // 첫 번째 섹션은 즉시 보이도록 설정
    const sections = document.querySelectorAll('.info-section');
    sections[0]?.classList.add('visible');

    // 나머지 섹션들에 대해 observer 적용
    sections.forEach((section, index) => {
      if (index > 0) {
        observer.observe(section);
      }
    });

    // 스크롤 이벤트 처리
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsGradientVisible(scrollPosition < 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`color-transition ${!isGradientVisible ? 'hidden' : ''}`} />
      <div className="info-sections">
        <section className="info-section">
          <div className="section-content">
            <h2>Communicate Without Boundaries</h2>
            <p>Experience real-time sign language translation powered by advanced AI technology.</p>
          </div>
          <img src="/images/section1.jpg" alt="Sign language demonstration" />
        </section>

        <section className="info-section reverse">
          <div className="section-content">
            <h2>Learn Common Signs</h2>
            <p>Discover the most frequently used Chinese Sign Language expressions for daily communication.</p>
          </div>
          <div className="sign-grid">
            <div className="sign-item">
              <img src="/images/hello.jpg" alt="Hello sign" />
              <p>Hello</p>
            </div>
            <div className="sign-item">
              <img src="/images/thankyou.jpg" alt="Thank you sign" />
              <p>Thank You</p>
            </div>
            {/* Add more signs */}
          </div>
        </section>

        <section className="info-section">
          <div className="section-content">
            <h2>Real-time Translation</h2>
            <p>Our advanced AI model detects and translates sign language gestures instantly.</p>
          </div>
          <img src="/images/section3.jpg" alt="Translation demonstration" />
        </section>
      </div>
    </>
  );
};

export default InfoSection;