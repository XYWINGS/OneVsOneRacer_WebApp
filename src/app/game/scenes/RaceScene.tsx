import { Scene, Game, AUTO, Physics, Types } from "phaser";

// Track configuration
const TRACK_CONFIG = {
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
  trackColor: 0x444444,
  borderColor: 0xffffff,
};

// Car configuration
const CAR_CONFIG = {
  width: 30,
  height: 50,
  acceleration: 0.2,
  deceleration: 0.1,
  maxSpeed: 300,
  turnSpeed: 0.05,
};

export default class RaceScene extends Scene {
  private car!: Physics.Arcade.Sprite;
  private cursors!: Types.Input.Keyboard.CursorKeys;
  private velocity = 0;

  constructor() {
    super("RaceScene");
  }

  preload() {
    // Load minimal assets
    this.load.image("car", "../../assets/car.png");
  }

  create() {
    // 1. Create Track (Simple Rectangle)
    this.add.rectangle(
      TRACK_CONFIG.width / 2,
      TRACK_CONFIG.height / 2,
      TRACK_CONFIG.width - 100,
      TRACK_CONFIG.height - 100,
      TRACK_CONFIG.trackColor
    );

    // 2. Create Car
    this.car = this.physics.add.sprite(TRACK_CONFIG.width / 2, TRACK_CONFIG.height / 2, "car");
    this.car.setCollideWorldBounds(true);
    this.car.setDrag(0.98);

    // 3. Input Setup
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    // Handle Car Physics
    this.handleCarMovement();
  }

  private handleCarMovement() {
    // Acceleration/Deceleration
    if (this.cursors.up.isDown) {
      this.velocity = Math.min(this.velocity + CAR_CONFIG.acceleration, CAR_CONFIG.maxSpeed);
    } else if (this.cursors.down.isDown) {
      this.velocity = Math.max(this.velocity - CAR_CONFIG.deceleration, -CAR_CONFIG.maxSpeed / 2);
    } else {
      // Natural deceleration
      this.velocity *= 0.95;
    }

    // Steering
    if (this.velocity !== 0) {
      const turnDirection = this.cursors.left.isDown ? -1 : this.cursors.right.isDown ? 1 : 0;
      this.car.angle += turnDirection * CAR_CONFIG.turnSpeed * this.velocity;
    }

    // Apply movement
    const angleRad = Phaser.Math.DegToRad(this.car.angle);
    this.car.setVelocity(Math.cos(angleRad) * this.velocity, Math.sin(angleRad) * this.velocity);
  }
}
