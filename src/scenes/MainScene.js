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

    // Uncomment this after adding the spike spawning logic
    // this.physics.add.collider(this.player, this.spikes, (player, spike) => {
    //     if (spike.active) {  // Only if the spike is active (risen)
    //       this.gameOver();   // This will now include the blast effect
    //     }
    //   });
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
    // Add the logic for spawning obstacles(spikes) ahead of the player here
  }

  spawnSpotlight(){
    // Add the logic for spawning spotlights ahead of the player here
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


  
  checkPlayerHiding() {
      //Add the logic for hiding of the player from the spotlights here
    }

    cleanupOffscreenObjects() {
      // Add the logic for cleaning up off-screen objects here
    }

  applyPlayerRoll(delta) {
    if (!this.player.body.touching.down && !this.player.body.blocked.down) {
      this.player.angle += (2.5 * delta) / 16; // Adjust roll speed as needed.
    }
  }

  gameOver() {
    // Add the logic for game over here
}
  createBlastEffect(x, y, color = 0xffffff) {
    // Create a particle emitter for the blast effect
    const particles = this.add.particles('pixel'); // Use a simple pixel texture or create one
    
    const emitter = particles.createEmitter({
      x: x,
      y: y,
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 800,
      gravityY: 300,
      quantity: 1,
      frequency: 20,
      tint: color,
      maxParticles: 40
    });
  
    // Create small square fragments
    for (let i = 0; i < 12; i++) {
      const fragment = this.add.rectangle(
        x + Phaser.Math.Between(-5, 5),
        y + Phaser.Math.Between(-5, 5),
        Phaser.Math.Between(5, 10),
        Phaser.Math.Between(5, 10),
        color
      );
      
      // Add physics to the fragments
      this.physics.add.existing(fragment);
      fragment.body.setVelocity(
        Phaser.Math.Between(-200, 200),
        Phaser.Math.Between(-300, -100)
      );
      
      // Rotate the fragments
      this.tweens.add({
        targets: fragment,
        angle: Phaser.Math.Between(-360, 360),
        duration: Phaser.Math.Between(800, 1500),
        ease: 'Power1'
      });
      
      // Fade out and destroy the fragments
      this.tweens.add({
        targets: fragment,
        alpha: 0,
        delay: Phaser.Math.Between(300, 600),
        duration: 300,
        onComplete: () => {
          fragment.destroy();
        }
      });
    }
    
    // Stop the emitter after a short time
    this.time.delayedCall(200, () => {
      emitter.stop();
    });
    
    // Clean up the particles system after all particles are gone
    this.time.delayedCall(1000, () => {
      particles.destroy();
    });
  }
  
  // STEP 1: Add to your create() method
  setupTrailEffect() {
    // Create a group to hold all trail elements
    this.trailGroup = this.add.group();
    
    // Configure the trail parameters
    this.trailConfig = {
      enabled: true,
      frequency: 3,          // Create a trail element every X frames
      fadeTime: 300,         // How long it takes for trail elements to fade (ms)
      maxTrailLength: 10,    // Maximum number of trail elements
      alpha: 0.7,            // Starting alpha for trail elements
      tint: this.player.tintTopLeft || 0xffffff, // Match player color
      frameCounter: 0        // Counter to manage creation frequency
    };
    
    // Set up the trail update to run on each frame
    this.events.on('update', this.updateTrail, this);
  }
  
  // STEP 2: Add this method to your game class
  updateTrail() {
    // Only create trail when player is moving and in the air
    if (!this.trailConfig.enabled || 
        !this.player || 
        !this.player.visible || 
        this.player.body.velocity.y === 0) { // Only when in the air (jumping)
      return;
    }
    
    // Control creation frequency
    this.trailConfig.frameCounter++;
    if (this.trailConfig.frameCounter < this.trailConfig.frequency) {
      return;
    }
    this.trailConfig.frameCounter = 0;
    
    // Create a stylized trail element instead of a simple rectangle
    const trailElement = this.createStylizedTrailElement();
    
    // Add to the trail group
    this.trailGroup.add(trailElement);
    
    // Limit the trail length
    if (this.trailGroup.getChildren().length > this.trailConfig.maxTrailLength) {
      const oldestTrail = this.trailGroup.getFirstAlive();
      if (oldestTrail) {
        oldestTrail.destroy();
      }
    }
    
    // Fade out the trail element
    this.tweens.add({
      targets: trailElement,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: this.trailConfig.fadeTime,
      onComplete: () => {
        trailElement.destroy();
      }
    });
  }
  
  // STEP 3: Add this method for creating stylized trail elements
  createStylizedTrailElement() {
    // Get player properties
    const x = this.player.x;
    const y = this.player.y;
    const width = this.player.width;
    const height = this.player.height;
    
    // Create a gradient or patterned trail instead of a solid one
    const trailElement = this.add.graphics();
    
    // Choose between different styles
    const style = Phaser.Math.Between(1, 3);
    
    if (style === 1) {
      // Style 1: Glowing outline
      trailElement.lineStyle(2, this.trailConfig.tint, this.trailConfig.alpha);
      trailElement.strokeRect(-width/2, -height/2, width, height);
    } 
    else if (style === 2) {
      // Style 2: Fade from inside to outside
      trailElement.fillGradientStyle(
        this.trailConfig.tint, this.trailConfig.tint, 
        this.trailConfig.tint, this.trailConfig.tint, 
        this.trailConfig.alpha, this.trailConfig.alpha, 
        0, 0
      );
      trailElement.fillRect(-width/2, -height/2, width, height);
    }
    else {
      // Style 3: Simple filled rectangle (similar to original)
      trailElement.fillStyle(this.trailConfig.tint, this.trailConfig.alpha);
      trailElement.fillRect(-width/2, -height/2, width, height);
    }
    
    // Position the graphic
    trailElement.x = x;
    trailElement.y = y;
    trailElement.rotation = this.player.rotation;
    
    return trailElement;
  }
  
  // STEP 4: Add this method to toggle the trail effect
  toggleTrailEffect(enabled = true) {
    this.trailConfig.enabled = enabled;
    
    // Clear existing trail elements if disabled
    if (!enabled) {
      this.trailGroup.clear(true, true);
    }
  }

}

export default MainScene;

