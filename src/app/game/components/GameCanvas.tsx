'use client';
import { Scene, Game, AUTO } from 'phaser';
import { useEffect, useRef } from 'react';
import { useGameControls } from '../hooks/useGameControls';
import RaceScene from '../scenes/RaceScene';

export function GameCanvas({ roomId }: { roomId: string }) {
  const gameRef = useRef<Phaser.Game | null>(null);
  useGameControls(roomId); // Hook for keyboard controls

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      parent: 'game-container',
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: { debug: true }
      },
      scene: [RaceScene]
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [roomId]);

  return <div id="game-container" className="w-full h-full" />;
}