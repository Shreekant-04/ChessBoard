import React from 'react';

const Timer = ({ label, time }) => {
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="mb-4">
      <h2 className="font-bold">{label}</h2>
      <div className="text-2xl">{formatTime(time)}</div>
    </div>
  );
};

export default Timer;
