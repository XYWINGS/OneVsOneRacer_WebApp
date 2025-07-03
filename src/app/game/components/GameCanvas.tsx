"use client";
import { Scene, Game, AUTO } from "phaser";
import { useEffect, useRef } from "react";
import { useGameControls } from "../hooks/useGameControls";
import RaceScene from "../scenes/RaceScene";

export function GameCanvas({ roomId }: { roomId: string }) {
  const gameRef = useRef<Phaser.Game | null>(null);
  useGameControls(roomId);

  useEffect(() => {
    if (!roomId) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      parent: "game-container",
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: { y: 0, x: 0 },
          fixedStep: true,
        },
      },
      scene: [RaceScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        resizeInterval: 100,
      },
      dom: {
        createContainer: true,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [roomId]);

  return (
    <div id="game-container" className="w-full h-full">
      {!roomId && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">No room selected</div>
      )}
    </div>
  );
}
