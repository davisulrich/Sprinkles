import { detectCollision } from "/collisionDetection.js";
const paddleBounceAudio = new Audio("/audio/sprinkles-paddlebounce.wav");
paddleBounceAudio.volume = 0.4;
const loseLifeAudio = new Audio("/audio/sprinkles-loselife.wav");
loseLifeAudio.volume = 0.4;
const hitWallsAudio = new Audio("/audio/sprinkles-hitwall.wav");
hitWallsAudio.volume = 0.4;

export default class Ball {
  constructor(game) {
    this.image = document.getElementById("img_icecream");

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.game = game;
    this.size = { width: 47, height: 60 };
    this.reset();
  }

  reset() {
    this.position = { x: 80, y: 300 };
    this.speed = { x: 3, y: -7 };
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }

  update() {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    //hitting the wall on left or right (x axis)
    if (
      this.position.x + this.size.width > this.gameWidth ||
      this.position.x < 0
    ) {
      this.speed.x = -this.speed.x;
      hitWallsAudio.currentTime = 0;
      hitWallsAudio.play();
    }

    //hitting the wall on top (y axis))
    if (this.position.y <= 0) {
      this.speed.y = -this.speed.y;
      hitWallsAudio.currentTime = 0;
      hitWallsAudio.play();
    }

    // hitting the bottom of the screen (game over)
    if (this.position.y + this.size.height > this.gameHeight) {
      this.game.lives--;
      loseLifeAudio.currentTime = 0;
      loseLifeAudio.play();
      this.reset();
    }

    // collision with paddle
    if (detectCollision(this, this.game.paddle)) {
      this.speed.y = -this.speed.y;
      paddleBounceAudio.currentTime = 0;
      paddleBounceAudio.play();
      this.position.y = this.game.paddle.position.y - this.size.height;
    }
  }
}
