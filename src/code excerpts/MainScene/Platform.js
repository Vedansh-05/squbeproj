// Create enough platform segments to cover the screen width plus extras
    let numSegments = Math.ceil(800 / this.PLATFORM_WIDTH) + 10; // +10 for initial gameplay
    let currentX = 0;
    let currentY = this.BASE_PLATFORM_Y; // Start with ground level

    for (let i = 0; i < numSegments; i++) {
      // Create platform with the center at the calculated position
      let platform = this.platforms.create(
        currentX + this.PLATFORM_WIDTH / 2,
        currentY + this.PLATFORM_HEIGHT / 2,
        "platform"
      );

      // Set the platform physics body to match the sprite exactly
      platform.body.setSize(this.PLATFORM_WIDTH, this.PLATFORM_HEIGHT);
      platform.body.setOffset(0, 0);
      platform.refreshBody();

      // Create a visual extension beneath this platform
      this.createPlatformExtension(
        currentX + this.PLATFORM_WIDTH / 2,
        currentY + this.PLATFORM_HEIGHT / 2
      );

      // Position the next platform
      currentX += this.PLATFORM_WIDTH;

      // After the first few flat platforms, start varying the heights
      if (i > 3) {
        currentY = this.getNextPlatformY(currentY);
      }
    }