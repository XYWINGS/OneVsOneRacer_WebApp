// client/src/app/(game)/components/GameScene.tsx
"use client";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

class RaceScene extends Phaser.Scene {
  private cars: Phaser.Physics.Arcade.Sprite[] = [];

  preload() {
    this.load.image("track", "/assets/track.png");
    this.load.image("car", "/assets/car.png");
  }

  create() {
    // Add track
    this.add.image(400, 300, "track");

    // Create cars (position will be synced via socket)
    this.cars[0] = this.physics.add.sprite(100, 300, "car");
    this.cars[1] = this.physics.add.sprite(100, 400, "car");
  }
}

export function GameScene() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: { gravity: {
            y: 0,
            x: 0
        } },
      },
      scene: [RaceScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
}
