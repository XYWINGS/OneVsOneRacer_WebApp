import { Scene } from "phaser";
import { getSocket } from "../lib/socket";

// Track configuration
const TRACK_CONFIG = {
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
  trackColor: 0x444444,
  borderColor: 0xffffff,
};

export default class RaceScene extends Scene {
  private players: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
  private socket: any = null;

  constructor() {
    super("RaceScene");
  }

  preload() {
    this.load.image("redCar", "./redCar.png");
    this.load.image("blueCar", "./blueCar.png");
  }

  create() {
    //Center the camera
    this.cameras.main.setBounds(0, 0, TRACK_CONFIG.width, TRACK_CONFIG.height);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(TRACK_CONFIG.width / 2, TRACK_CONFIG.height / 2);

    // 1. Create Track Background
    this.add.rectangle(
      TRACK_CONFIG.width / 2,
      TRACK_CONFIG.height / 2,
      TRACK_CONFIG.width,
      TRACK_CONFIG.height,
      TRACK_CONFIG.backgroundColor
    );

    // 2. Create Track (Simple Rectangle)
    this.add
      .rectangle(
        TRACK_CONFIG.width / 2,
        TRACK_CONFIG.height / 2,
        TRACK_CONFIG.width - 100,
        TRACK_CONFIG.height - 100,
        TRACK_CONFIG.trackColor
      )
      .setStrokeStyle(4, TRACK_CONFIG.borderColor);

    // 3. Setup Socket Connection
    try {
      this.socket = getSocket();
      this.setupSocketListeners();
    } catch (error) {
      console.error("Could not get socket in RaceScene:", error);
    }

    // // 4. Add debug text
    // this.add.text(10, 10, "Racing Game", {
    //   fontSize: "24px",
    //   color: "#ffffff",
    // });
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    // Listen for game state updates from server
    this.socket.on("gameStateUpdate", (gameState: any) => {
      this.updateGameState(gameState);
    });

    // Listen for player joined events
    this.socket.on("playerJoined", (data: any) => {
      console.log("Player joined:", data);
    });

    // Listen for countdown
    this.socket.on("countdownUpdate", (count: number) => {
      console.log("Countdown:", count);
    });

    // Listen for race start
    this.socket.on("raceStart", () => {
      console.log("Race started!");
    });
  }

  // private updateGameState(gameState: any) {
  //   if (!gameState || !gameState.players) return;

  //   // console.log("Updating game state:", gameState);

  //   // Update each player's car position
  //   Object.entries(gameState.players).forEach(([playerId, playerData]: [string, any], index) => {
  //     let car = this.players.get(playerId);

  //     if (!car) {
  //       // Create new car sprite for this player
  //       const carColor = index === 0 ? "redCar" : "blueCar";
  //       car = this.physics.add.sprite(playerData.position.x, playerData.position.y, carColor);
  //       car.setCollideWorldBounds(true);
  //       this.players.set(playerId, car);

  //       console.log(`Created car for player ${playerId} at:`, playerData.position);
  //     }

  //     // Update car position and rotation
  //     if (car && playerData.position) {
  //       car.setPosition(playerData.position.x, playerData.position.y);
  //       car.setRotation(playerData.rotation || 0);
  //     }
  //   });

  //   // Remove cars for disconnected players
  //   this.players.forEach((car, playerId) => {
  //     if (!gameState.players[playerId]) {
  //       car.destroy();
  //       this.players.delete(playerId);
  //     }
  //   });
  // }
  private updateGameState(gameState: any) {
    if (!gameState || !gameState.players) return;

    // Update each player's car position
    Object.entries(gameState.players).forEach(([playerId, playerData]: [string, any], index) => {
      let car = this.players.get(playerId);

      if (!car || !car.active) {
        // Create new car sprite for this player if it doesn't exist or was destroyed
        const carColor = index === 0 ? "redCar" : "blueCar";
        car = this.physics.add.sprite(
          playerData.position.x || TRACK_CONFIG.width / 2,
          playerData.position.y || TRACK_CONFIG.height / 2,
          carColor
        );
        car.setCollideWorldBounds(true);
        this.players.set(playerId, car);
      }

      // Update position if car exists and is active
      if (car?.active) {
        car.setPosition(playerData.position.x ?? car.x, playerData.position.y ?? car.y);
        car.setRotation(playerData.rotation ?? car.rotation);
      }
    });

    // Remove cars for disconnected players
    const activePlayerIds = new Set(Object.keys(gameState.players));
    this.players.forEach((car, playerId) => {
      if (!activePlayerIds.has(playerId)) {
        if (car?.active) {
          car.destroy();
        }
        this.players.delete(playerId);
      }
    });
  }

  update() {
    // No manual updates needed - everything comes from server
  }
}
