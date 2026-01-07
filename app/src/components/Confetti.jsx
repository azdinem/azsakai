import { useEffect, useState } from 'react';

const COLORS = [
  '#8b5cf6', // violet
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // green
  '#f59e0b', // orange
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
];

const SHAPES = ['square', 'circle', 'triangle'];

function ConfettiPiece({ delay, x }) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const size = 8 + Math.random() * 8;
  const rotation = Math.random() * 360;
  const duration = 2 + Math.random() * 2;

  const shapeStyles = {
    square: {
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '2px',
    },
    circle: {
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '50%',
    },
    triangle: {
      width: 0,
      height: 0,
      borderLeft: `${size / 2}px solid transparent`,
      borderRight: `${size / 2}px solid transparent`,
      borderBottom: `${size}px solid ${color}`,
      backgroundColor: 'transparent',
    },
  };

  return (
    <div
      className="confetti"
      style={{
        left: `${x}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        transform: `rotate(${rotation}deg)`,
        ...shapeStyles[shape],
      }}
    />
  );
}

export default function Confetti({ active, onComplete }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} x={piece.x} delay={piece.delay} />
      ))}
    </div>
  );
}
