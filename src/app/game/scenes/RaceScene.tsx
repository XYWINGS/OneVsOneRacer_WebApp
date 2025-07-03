import { Scene } from "phaser";
import { getSocket } from "../lib/socket";
import { TrackGenerator } from "../hooks/trackGenerator";

// Track configuration
const TRACK_CONFIG = {
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
  trackColor: 0x444444,
  borderColor: 0xffffff,
};

// export default class RaceScene extends Scene {
//   private players: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
//   private socket: any = null;
export default class RaceScene extends Scene {
  private players: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
  private socket: any = null;
  private trackGraphics!: Phaser.GameObjects.Graphics;
  private checkpoints: any[] = [];

  constructor() {
    super("RaceScene");
  }

  preload() {
    this.load.image("redCar", "./redCar.png");
    this.load.image("blueCar", "./blueCar.png");
  }

  create() {
    const track = TrackGenerator.generate({
      width: 800,
      height: 600,
      complexity: 5,
      segments: 12,
    });
    // Set camera bounds
    this.cameras.main.setBounds(0, 0, 800, 600);
    this.cameras.main.centerOn(400, 300);

    // Create track graphics
    this.trackGraphics = this.add.graphics();

    // Draw background
    this.trackGraphics.fillStyle(0x222222);
    this.trackGraphics.fillRect(0, 0, 800, 600);

    // Draw outer track boundary
    this.trackGraphics.fillStyle(0x444444);
    this.trackGraphics.beginPath();
    this.trackGraphics.moveTo(track.outerPolygon[0].x, track.outerPolygon[0].y);
    track.outerPolygon.forEach((point) => {
      this.trackGraphics.lineTo(point.x, point.y);
    });
    this.trackGraphics.closePath();
    this.trackGraphics.fillPath();
    this.trackGraphics.strokePath();

    // Draw inner track boundary
    this.trackGraphics.fillStyle(0x222222);
    this.trackGraphics.beginPath();
    this.trackGraphics.moveTo(track.innerPolygon[0].x, track.innerPolygon[0].y);
    track.innerPolygon.forEach((point) => {
      this.trackGraphics.lineTo(point.x, point.y);
    });
    this.trackGraphics.closePath();
    this.trackGraphics.fillPath();
    this.trackGraphics.strokePath();

    // Store checkpoints
    this.checkpoints = track.checkpoints;

    // Setup physics boundaries (simplified collision)
    const trackBounds = this.add.graphics();
    trackBounds.lineStyle(4, 0xffffff, 1);
    trackBounds.beginPath();
    trackBounds.moveTo(track.outerPolygon[0].x, track.outerPolygon[0].y);
    track.outerPolygon.forEach((point) => {
      trackBounds.lineTo(point.x, point.y);
    });
    trackBounds.closePath();
    trackBounds.strokePath();

    //Center the camera
    this.cameras.main.setBounds(0, 0, TRACK_CONFIG.width, TRACK_CONFIG.height);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(TRACK_CONFIG.width / 2, TRACK_CONFIG.height / 2);

    // // 1. Create Track Background
    // this.add.rectangle(
    //   TRACK_CONFIG.width / 2,
    //   TRACK_CONFIG.height / 2,
    //   TRACK_CONFIG.width,
    //   TRACK_CONFIG.height,
    //   TRACK_CONFIG.backgroundColor
    // );

    // // 2. Create Track (Simple Rectangle)
    // this.add
    //   .rectangle(
    //     TRACK_CONFIG.width / 2,
    //     TRACK_CONFIG.height / 2,
    //     TRACK_CONFIG.width - 100,
    //     TRACK_CONFIG.height - 100,
    //     TRACK_CONFIG.trackColor
    //   )
    //   .setStrokeStyle(4, TRACK_CONFIG.borderColor);

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
