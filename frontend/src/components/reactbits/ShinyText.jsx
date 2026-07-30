import React from 'react';

export default function ShinyText({ text, disabled = false, speed = 5, className = '' }) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-300 to-emerald-400 bg-[length:200%_auto] ${
        disabled ? '' : 'animate-shine'
      } ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, #4f46e5 0%, #c084fc 25%, #ffffff 50%, #c084fc 75%, #10b981 100%)',
        backgroundSize: '200% auto',
        animation: disabled ? 'none' : `shine ${animationDuration} linear infinite`,
      }}
    >
      {text}
    </span>
  );
}
