import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  seconds: number;
  message?: string;
  onDone?: () => void;
  color?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, message, onDone, color }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onDone) onDone();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onDone]);

  return (
    <div style={{ textAlign: 'center', color: color || '#1976d2', fontWeight: 600, fontSize: '1.5rem', margin: '1.5rem 0' }}>
      {message && <div style={{ marginBottom: 8 }}>{message}</div>}
      <span>{timeLeft > 0 ? timeLeft : 0} s</span>
    </div>
  );
};

export default CountdownTimer;
