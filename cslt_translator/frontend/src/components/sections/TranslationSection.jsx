import './TranslationSection.css';

const TranslationSection = () => {
  return (
    <section className="info-section animate-section">
      <div className="section-content">
        <h2>Real-time Translation</h2>
        <p>Our advanced AI model detects and translates sign language gestures instantly.</p>
      </div>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJztVL4ZHI0utRNjL-qj2T07KqLgWl8rletg&s" alt="Translation demonstration" />
    </section>
  );
};

export default TranslationSection;