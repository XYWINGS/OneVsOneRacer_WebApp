'use client';

import { useEffect, useRef } from 'react';
import { initializeSocket } from '../lib/socket';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Simple game state
    const gameState = {
      player: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 30,
        color: '#FF0000',
      },
    };

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.fillStyle = gameState.player.color;
      ctx.fillRect(
        gameState.player.x - gameState.player.size / 2,
        gameState.player.y - gameState.player.size / 2,
        gameState.player.size,
        gameState.player.size
      );

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Handle keyboard input
    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Simple input handling
    const inputLoop = setInterval(() => {
      const speed = 5;
      if (keys['ArrowUp'] || keys['w']) gameState.player.y -= speed;
      if (keys['ArrowDown'] || keys['s']) gameState.player.y += speed;
      if (keys['ArrowLeft'] || keys['a']) gameState.player.x -= speed;
      if (keys['ArrowRight'] || keys['d']) gameState.player.x += speed;
    }, 16);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      clearInterval(inputLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-gray-900"
      />
    </div>
  );
}