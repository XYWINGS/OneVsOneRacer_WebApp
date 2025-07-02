"use client";
import { Scene, Game, AUTO } from "phaser";
import { useEffect, useRef } from "react";
import { useGameControls } from "../hooks/useGameControls";
import RaceScene from "../scenes/RaceScene";

export function GameCanvas({ roomId }: { roomId: string }) {
  const gameRef = useRef<Phaser.Game | null>(null);

  // Always call useGameControls to maintain hook consistency
  // It will handle empty roomId internally
  useGameControls(roomId);

  useEffect(() => {
    // Don't initialize game if no roomId
    if (!roomId) {
      return;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      parent: "game-container",
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: { debug: false }, // Set to true for debugging
      },
      scene: [RaceScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [roomId]);

  // Always render the container div, but only show game when roomId exists
  return (
    <div id="game-container" className="w-full h-full">
      {!roomId && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No room selected</p>
        </div>
      )}
    </div>
  );
}
