class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    console.log("GameOverScene loaded!");

    // Grey background
    this.cameras.main.setBackgroundColor("#808080");

    // 3D Shadow Effect (Text Layers)
    const textX = this.scale.width / 2;
    const textY = this.scale.height / 2 - 50;

    // 1️⃣ Shadow Layer (Creates 3D depth effect)
    this.add.text(textX + 4, textY + 4, "GAME OVER", {
      fontSize: "64px",
      fill: "#444444", // Dark Gray shadow
      fontFamily: "Arial Black",
      stroke: "#222222",
      strokeThickness: 6
    }).setOrigin(0.5);

    // 2️⃣ Main Text (White) - This will blink
    let gameOverText = this.add.text(textX, textY, "GAME OVER", {
      fontSize: "64px",
      fill: "#ffffff", // White main text
      fontFamily: "Arial Black",
      stroke: "#ff0000", // Red stroke
      strokeThickness: 6,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: "#222222", // Dark shadow for 3D effect
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);

    //  Blinking effect using alpha variation
    this.tweens.add({
      targets: gameOverText,
      alpha: { from: 1, to: 0.5 }, // Fades in and out
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Display final score
    this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, `Score: ${this.finalScore}`, {
      fontSize: "40px",
      fill: "#ffff00",
      fontFamily: '"Miltonian", sans-serif',
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5);

    // Restart instruction
    this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, "Press SPACE to Restart", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Arial"
    }).setOrigin(0.5);

    // Listen for spacebar key to restart game
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("StartScene"); // Ensure it starts from StartScene
    });
  }
}

