import { detectCollision } from "/collisionDetection.js";
const hitBrickAudio = new Audio("/audio/sprinkles-hitbrick.wav");
hitBrickAudio.volume = 0.5;

export default class Brick {
  constructor(game, position) {
    this.image = document.getElementById("img_sprinkles");
    this.position = position;

    this.width = 75;
    this.height = 25;

    this.game = game;

    this.markedForDeletion = false;
  }

  update(game) {
    if (detectCollision(this.game.ball, this)) {
      if (game.reverseDirectionTimer === 0) {
        this.game.ball.speed.y = -this.game.ball.speed.y;
        hitBrickAudio.currentTime = 0;
        hitBrickAudio.play();
      }
      game.reverseDirectionTimer = 2;
      this.markedForDeletion = true;
    }
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
