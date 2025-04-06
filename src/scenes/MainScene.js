import { Scene } from "phaser";
import GAME_CONSTANTS from "../assets";
import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");

    // Initialize class properties
    this.player = null;
    this.platforms = null;
    this.platformExtensions = null;
    this.spikes = null;
    this.spotlights = null;
    this.cursors = null;
    this.wasd = null;
    this.scoreText = null;
    this.distanceText = null;
    this.controlsText = null;
    this.floorDetector = null;

    // Game state variables
    this.score = 0;
    this.jumpCount = 0;
    this.maxJumps = 2;
    this.isHiding = false;
  }

  create() {
    // Set the background color (grey).
    this.cameras.main.setBackgroundColor("#808080");

    // Initialize game variables

    this.score = 0;
    this.movementSpeed = GAME_CONSTANTS.PLAYER_MOVEMENT_SPEED;

    // Set up UI elements
    this.createUIElements();

    // Define constants for sizing and positioning
    this.CUBE_SIZE = GAME_CONSTANTS.CUBE_SIZE;
    this.PLATFORM_WIDTH = GAME_CONSTANTS.PLATFORM_WIDTH;
    this.PLATFORM_HEIGHT = GAME_CONSTANTS.PLATFORM_HEIGHT;
    this.BASE_PLATFORM_Y = GAME_CONSTANTS.BASE_PLATFORM_Y;
    
    // Set up camera and world bounds
    this.setupCameraAndWorld();
    
    // Create a container for the platform extensions (visual only, no physics)
    this.platformExtensions = this.add.group();

    // Create the platforms as a static group.
    this.platforms = this.physics.add.staticGroup();

    // Call our spawn method to create initial platforms
    this.spawnPlatforms();

    // Create the player and set up physics
    this.createPlayer();

    // Set up controls
    this.setupControls();

    // Create groups for obstacles.
    this.setupObstacles();

    // Set up a floor collision detector at the bottom of the screen
    this.setupFloorDetector();
}

createUIElements() {
    //Add UI elements here
}

setupCameraAndWorld() {
    // Add the camera and world bounds logic here
}

spawnPlatforms() {
  // Add the spawning platforms part here
}

createPlayer() {
    // Create the player cube
    

    // Set up player physics
    

    // Add the player collision with platforms to reset jump count.
    
}


setupControls() {
    //Add the controls logic here
}

handlePlayerControls() {
    // Add the logic for handling player controls here
}

//Uncomment this if you want to use the jump logic
// handleJump() {
//   if (this.jumpCount < this.maxJumps) {
//     this.player.setVelocityY(GAME_CONSTANTS.JUMP_VELOCITY);
//     this.jumpCount++;
//   }
// }


  setupObstacles() {
    //Add the logic for obstacle setup here
  }


  spawnObstacle() {
    // Add the logic for spawning obstacles ahead of the player here
  }

  spawnSpikeAt(x, y) {
    // Add the logic for spawning spikes here
  }

  spawnSpotlightAt(x, y) {
    // Add the logic for spawning spotlights here
  }


  setupFloorDetector() {
      // Add the floor detector logic here
    }
    
    // Add the code to generate more platforms here

  update(time, delta) {
    // Calculate distance in meters
    const displacementInMeters = (this.player.x / 100).toFixed(1);

    // Increase score based on displacement
    this.score = Math.floor(displacementInMeters * 2);

    // Update UI elements (change "DISTANCE" to "DISPLACEMENT" for clarity)
    this.scoreText.setText("Score: " + this.score);
    this.distanceText.setText(`DISPLACEMENT\n${displacementInMeters}m`);
    this.distanceText.x = this.cameras.main.scrollX + 770;

    // Handle player controls
    this.handlePlayerControls();
    
    // Remove off-screen objects
    this.cleanupOffscreenObjects();
    
    // Check if the player is "hiding" on a platform.
    this.checkPlayerHiding();

    // If the player is in the air, roll the cube.
    this.applyPlayerRoll(delta);

    // Keep the controls text with the camera
    this.controlsText.x = this.cameras.main.scrollX + 400;

    // Generate more platforms as the player moves right
    this.generateMorePlatforms();

    // Update floor detector position to follow camera
    this.floorDetector.x = this.cameras.main.scrollX;
  }


  cleanupOffscreenObjects() {
    // Add the logic for cleaning up off-screen objects here
  }

  checkPlayerHiding() {
    this.isHiding = false;
    this.physics.overlap(this.player, this.platforms, () => {
      this.isHiding = true;
    });
  }

  applyPlayerRoll(delta) {
    if (!this.player.body.touching.down && !this.player.body.blocked.down) {
      this.player.angle += (2.5 * delta) / 16; // Adjust roll speed as needed.
    }
  }


  gameOver() {
    // Add the logic for game over here
}




  // gameOver() {
  //   console.log("Game Over! Transitioning to GameOverScene...");

  //   // Stop player movement
  //   this.player.setVelocity(0);
  //   this.player.setTint(0xff0000); // Optional: Flash red to indicate death

  //   // Short delay before switching scenes
  //   this.time.delayedCall(1000, () => {
  //     this.scene.start("GameOverScene", { score: Math.floor(this.score) });
  //   });
  // }

  // gameOver() {
  //   // Display a game over message
  //   let gameOverText = this.add.text(this.cameras.main.scrollX + 400, 300, 'GAME OVER', {
  //     fontSize: '64px',
  //     fill: '#ff0000',
  //     fontStyle: 'bold'
  //   }).setOrigin(0.5);

  //   // Show final score
  //   this.add.text(this.cameras.main.scrollX + 400, 375, `Final Score: ${Math.floor(this.score)}`, {
  //     fontSize: '32px',
  //     fill: '#ffffff'
  //   }).setOrigin(0.5);

  //   // Add a restart button
  //   let restartButton = this.add.text(this.cameras.main.scrollX + 400, 450, 'RESTART', {
  //     fontSize: '32px',
  //     fill: '#ffffff',
  //     backgroundColor: '#000000',
  //     padding: { x: 20, y: 10 }
  //   }).setOrigin(0.5)
  //   .setInteractive({ useHandCursor: true })
  //   .on('pointerdown', () => {
  //     this.scene.restart();
  //   });

  //   // Pause the game
  //   this.physics.pause();
  //   this.tweens.pauseAll();
  // }
}

export default MainScene;

