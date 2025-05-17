import React from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  
  // Sample data - replace with actual data from backend
  const historyData = [
    { id: 1, landmark: "Hand position A", timestamp: "2025-05-17 10:30:45" },
    { id: 2, landmark: "Hand position B", timestamp: "2025-05-17 10:31:22" },
  ];

  return (
    <div className="history-container">
      <h1>History</h1>
      
      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Previous landmarks</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item) => (
              <tr key={item.id}>
                <td>{item.landmark}</td>
                <td>{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate('/')} className="back-button">
        ← Back
      </button>
    </div>
  );
};

export default History;