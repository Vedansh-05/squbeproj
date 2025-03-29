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
    this.cameras.main.setBackgroundColor('#808080');
    
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
    
    // Set up camera and world bounds
    this.setupCameraAndWorld();
    
    // Set up a floor collision detector at the bottom of the screen
    this.setupFloorDetector();
  }
  
  createUIElements() {
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    this.controlsText = this.add.text(400, 10, 'Controls: WASD or Arrow Keys', { 
      fontSize: '16px', 
      fill: '#fff' 
    }).setOrigin(0.5, 0);
    
    // Add distance counter in top right
    this.distanceText = this.add.text(770, 50, 'DISTANCE\n0.0m', { 
      fontSize: '20px', 
      fill: '#fff',
      align: 'right'
    }).setOrigin(1, 0);
  }
  
  createPlayer() {
    // Get the first platform to position the player
    let firstPlatform = this.platforms.getChildren()[0];
    
    // Create the player cube with proper physics body
    this.player = this.physics.add.sprite(
      400, // Position player in the middle of the screen
      firstPlatform.y - (this.PLATFORM_HEIGHT/2) - (this.CUBE_SIZE/2), 
      'playerCube'
    );
    
    // Set up player physics
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(GAME_CONSTANTS.GRAVITY);
    this.player.body.setSize(this.CUBE_SIZE, this.CUBE_SIZE);
    this.player.body.setOffset(0, 0);
    
    // Collide the player with platforms to reset jump count.
    this.physics.add.collider(this.player, this.platforms, () => {
      this.jumpCount = 0;
      this.player.angle = 0;  // Reset roll when landed.
    }, null, this);
  }
  
  setupControls() {
    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    // Set up jump variables.
    this.jumpCount = 0;
    this.maxJumps = 2;
    
    // Input for jump: UP, W, or SPACE
    this.input.keyboard.on('keydown-SPACE', this.handleJump, this);
  }
  
  setupObstacles() {
    // Create groups for obstacles.
    this.spikes = this.physics.add.group();
    this.spotlights = this.physics.add.group();
    
    // Collision: player vs spikes.
    this.physics.add.overlap(this.player, this.spikes, this.gameOver, null, this);
    
    // Collision: player vs spotlights (only game over if not hiding).
    this.physics.add.overlap(this.player, this.spotlights, (player, spotlight) => {
      if (!this.isHiding) { this.gameOver(); }
    }, null, this);
    
    // Spawn obstacles periodically
    this.time.addEvent({
      delay: 5000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });
  }
  
  setupCameraAndWorld() {
    // Create a camera that follows the player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setFollowOffset(-200, 0); // Offset to see more ahead of the player
    
    // Set world bounds for a larger play area
    this.physics.world.setBounds(0, 0, 4000, 600);
    this.cameras.main.setBounds(0, 0, 4000, 600);
  }
  
  setupFloorDetector() {
    this.floorDetector = this.add.zone(0, 590, 4000, 10);
    this.physics.world.enable(this.floorDetector, Phaser.Physics.Arcade.STATIC_BODY);
    this.physics.add.overlap(this.player, this.floorDetector, this.gameOver, null, this);
  }
  
  update(time, delta) {
    // Increase score over time.
    this.score += delta * 0.01;
    this.scoreText.setText('Score: ' + Math.floor(this.score));
    
    // Update distance (converted to meters)
    const distanceInMeters = (this.player.x / 100).toFixed(1);
    this.distanceText.setText(`DISTANCE\n${distanceInMeters}m`);
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
  
  handlePlayerControls() {
    // Handle player movement with WASD or arrow keys
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.setVelocityX(-this.movementSpeed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.setVelocityX(this.movementSpeed);
    } else {
      this.player.setVelocityX(0);
    }
    
    // Jump with up arrow or W key
    if ((this.cursors.up.isDown || this.wasd.up.isDown) && this.jumpCount < this.maxJumps) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up)) {
        this.handleJump();
      }
    }
  }
  
  cleanupOffscreenObjects() {
    // Remove off-screen obstacles.
    this.spikes.getChildren().forEach(spike => {
      if (spike.x < this.player.x - 800) spike.destroy();
    });
    this.spotlights.getChildren().forEach(light => {
      if (light.x < this.player.x - 800) light.destroy();
    });
    
    // Clean up off-screen platform extensions
    this.platformExtensions.getChildren().forEach(extension => {
      if (extension.x < this.player.x - 800) extension.destroy();
    });
  }
  
  checkPlayerHiding() {
    this.isHiding = false;
    this.physics.overlap(this.player, this.platforms, () => {
      this.isHiding = true;
    });
  }
  
  applyPlayerRoll(delta) {
    if (!this.player.body.touching.down && !this.player.body.blocked.down) {
      this.player.angle += 5 * delta / 16; // Adjust roll speed as needed.
    }
  }
  
  handleJump() {
    if (this.jumpCount < this.maxJumps) {
      this.player.setVelocityY(GAME_CONSTANTS.JUMP_VELOCITY);
      this.jumpCount++;
    }
  }
  
  getNextPlatformY(prevY) {
    // Calculate height difference (at most one cube height up or down)
    let heightDiff = Phaser.Math.Between(-this.CUBE_SIZE, this.CUBE_SIZE);
    
    // Make sure platforms don't vary too wildly
    if (heightDiff > 0) heightDiff = this.CUBE_SIZE;
    if (heightDiff < 0) heightDiff = -this.CUBE_SIZE;
    
    // Make sure the new platform is within acceptable bounds
    let minY = this.BASE_PLATFORM_Y - (this.CUBE_SIZE * 4); // Allow up to 4 cubes height from base
    let maxY = this.BASE_PLATFORM_Y;
    
    return Phaser.Math.Clamp(prevY + heightDiff, minY, maxY);
  }
  
  createPlatformExtension(x, y) {
    // Calculate the Y position for the extension (from platform bottom to screen bottom)
    const extensionHeight = 600 - y - (this.PLATFORM_HEIGHT / 2);
    const extensionY = y + (this.PLATFORM_HEIGHT / 2) + (extensionHeight / 2);
    
    // Create an extension sprite with the correct height
    const extension = this.platformExtensions.create(x, extensionY, 'platformExtension');
    
    // Scale the extension to the correct height
    extension.setDisplaySize(this.PLATFORM_WIDTH, extensionHeight);
    
    // Set the depth to be behind the platforms but visible
    extension.setDepth(-1);
    
    return extension;
  }
  
  generateMorePlatforms() {
    // Find the rightmost platform
    let rightmostX = -Infinity;
    let rightmostPlatform = null;
    
    this.platforms.getChildren().forEach(platform => {
      if (platform.x > rightmostX) {
        rightmostX = platform.x;
        rightmostPlatform = platform;
      }
    });
    
    // If the player is getting close to the rightmost platform, generate more
    if (this.player.x > rightmostX - 800) {
      // Generate 5 more platforms
      let currentX = rightmostX + this.PLATFORM_WIDTH;
      let currentY = rightmostPlatform ? rightmostPlatform.y : this.BASE_PLATFORM_Y;
      
      for (let i = 0; i < 5; i++) {
        currentY = this.getNextPlatformY(currentY);
        
        let platform = this.platforms.create(
          currentX + (this.PLATFORM_WIDTH/2),
          currentY + (this.PLATFORM_HEIGHT/2),
          'platform'
        );
        
        platform.body.setSize(this.PLATFORM_WIDTH, this.PLATFORM_HEIGHT);
        platform.body.setOffset(0, 0);
        platform.refreshBody();
        
        // Create a visual extension beneath this platform
        this.createPlatformExtension(currentX + (this.PLATFORM_WIDTH/2), currentY + (this.PLATFORM_HEIGHT/2));
        
        currentX += this.PLATFORM_WIDTH;
        
        // Maybe add a spike on this platform
        if (Phaser.Math.Between(0, 10) === 0) {
          this.spawnSpikeAt(platform.x, platform.y - (this.PLATFORM_HEIGHT/2) - (this.CUBE_SIZE/2));
        }
      }
    }
  }
  
  spawnPlatforms() {
    // Create enough platform segments to cover the screen width plus extras
    let numSegments = Math.ceil(800 / this.PLATFORM_WIDTH) + 10; // +10 for initial gameplay
    let currentX = 0;
    let currentY = this.BASE_PLATFORM_Y; // Start with ground level
    
    for (let i = 0; i < numSegments; i++) {
      // Create platform with the center at the calculated position
      let platform = this.platforms.create(
        currentX + (this.PLATFORM_WIDTH/2), 
        currentY + (this.PLATFORM_HEIGHT/2), 
        'platform'
      );
      
      // Set the platform physics body to match the sprite exactly
      platform.body.setSize(this.PLATFORM_WIDTH, this.PLATFORM_HEIGHT);
      platform.body.setOffset(0, 0);
      platform.refreshBody();
      
      // Create a visual extension beneath this platform
      this.createPlatformExtension(currentX + (this.PLATFORM_WIDTH/2), currentY + (this.PLATFORM_HEIGHT/2));
      
      // Position the next platform
      currentX += this.PLATFORM_WIDTH;
      
      // After the first few flat platforms, start varying the heights
      if (i > 3) {
        currentY = this.getNextPlatformY(currentY);
      }
    }
  }
  
  spawnObstacle() {
    // Spawn obstacles ahead of the player
    const aheadX = this.player.x + 800;
    
    // Randomly decide whether to spawn a spike or spotlight
    if (Phaser.Math.Between(0, 1) === 0) {
      // Find a platform in the area ahead to place a spike on
      let targetPlatform = null;
      this.platforms.getChildren().forEach(platform => {
        if (Math.abs(platform.x - aheadX) < 200) {
          targetPlatform = platform;
        }
      });
      
      if (targetPlatform) {
        this.spawnSpikeAt(
          targetPlatform.x, 
          targetPlatform.y - (this.PLATFORM_HEIGHT/2) - (this.CUBE_SIZE/2)
        );
      }
    } else {
      this.spawnSpotlightAt(aheadX, Phaser.Math.Between(100, 500));
    }
  }
  
  spawnSpikeAt(x, y) {
    let spike = this.spikes.create(x, y, 'spike');
    spike.body.allowGravity = false;
    spike.setImmovable(true);
  }
  
  spawnSpotlightAt(x, y) {
    let light = this.spotlights.create(x, y, 'spotlight');
    light.body.allowGravity = false;
    light.setImmovable(true);
    this.tweens.add({
      targets: light,
      alpha: 0,
      duration: 2000,
      ease: 'Linear',
      onComplete: () => { light.destroy(); }
    });
  }
  
  gameOver() {
    // Display a game over message
    let gameOverText = this.add.text(this.cameras.main.scrollX + 400, 300, 'GAME OVER', { 
      fontSize: '64px', 
      fill: '#ff0000',
      fontStyle: 'bold' 
    }).setOrigin(0.5);
    
    // Show final score
    this.add.text(this.cameras.main.scrollX + 400, 375, `Final Score: ${Math.floor(this.score)}`, { 
      fontSize: '32px', 
      fill: '#ffffff' 
    }).setOrigin(0.5);
    
    // Add a restart button
    let restartButton = this.add.text(this.cameras.main.scrollX + 400, 450, 'RESTART', { 
      fontSize: '32px', 
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.scene.restart();
    });
    
    // Pause the game
    this.physics.pause();
    this.tweens.pauseAll();
  }
}