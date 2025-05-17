const LearnSection = () => {
  return (
    <section className="info-section reverse animate-section">
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
      </div>
    </section>
  );
};

export default LearnSection;