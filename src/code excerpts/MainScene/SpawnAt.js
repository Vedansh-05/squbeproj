// spawnSpikeAt
    let spike = this.spikes.create(x, y, "spike");
    spike.body.allowGravity = false;
    spike.setImmovable(true);

//   spawnSpotlightAt
    // Set a fixed height for all spotlights
    const spotlightY = 200; // Adjust this value to set the desired height
  
    // Create the spotlight (black cube)
    const spotlight = this.add.rectangle(x, spotlightY, 50, 50, 0x000000); // Black cube
    this.physics.add.existing(spotlight); // Add physics to the rectangle
    spotlight.body.setAllowGravity(false); // Disable gravity for the spotlight
    spotlight.body.setVelocityX(-200); // Move left at a constant speed
    this.spotlights.add(spotlight); // Add to the spotlights group
  
    // Create the diverging beam of light (triangle)
    const beam = this.add.graphics();
    beam.fillStyle(0xffff00, 0.2); // Yellow light with 20% opacity
    beam.beginPath();
    beam.moveTo(x, spotlightY + 25); // Bottom center of the cube
    beam.lineTo(x - 350, spotlightY + 400); // Bottom-left of the beam
    beam.lineTo(x + 150, spotlightY + 400); // Bottom-right of the beam
    beam.closePath();
    beam.fill();
  
    // Define the beam's triangular collision area
    const beamTriangle = new Phaser.Geom.Triangle(
      x,
      spotlightY + 25, // Top of the triangle
      x - 350,
      spotlightY + 400, // Bottom-left of the triangle
      x + 150,
      spotlightY + 400 // Bottom-right of the triangle
    );
  
    // Add the beam and triangle to the spotlight for cleanup
    spotlight.beam = beam;
    spotlight.beamTriangle = beamTriangle;
  
    // Check for overlap between the player and the beam in the update loop
    this.time.addEvent({
      delay: 16, // Check every frame (60 FPS)
      callback: () => {
        if (
          Phaser.Geom.Triangle.ContainsPoint(
            beamTriangle,
            new Phaser.Geom.Point(this.player.x, this.player.y)
          )
        ) {
          if (!this.isHiding) {
            console.log("Player hit by spotlight beam!");
            this.gameOver();
          }
        }
      },
      loop: true,
    });
  
    // Destroy the spotlight and beam when they move off-screen
    this.time.addEvent({
      delay: 10000, // Adjust based on how long it takes to move off-screen
      callback: () => {
        spotlight.destroy();
        beam.destroy();
        beamTriangle.destroy();
      },
    });