import './TranslationSection.css';

const TranslationSection = () => {
  return (
    <section className="translation-section animate-section">
      <div className="blur-background"></div>
      <div className="section-content-wrapper">
        <div className="section-content">
          <h2>Real-time Translation</h2>
          <p>Our advanced AI model detects and translates sign language gestures instantly.</p>
        </div>
        <img
          src="https://sloanreview.mit.edu/wp-content/uploads/2020/04/GEN-Latinovic-AI-Communication-1290x860-1.jpg"
          alt="Translation demonstration"
        />
      </div>
    </section>
  );
};

export default TranslationSection;
