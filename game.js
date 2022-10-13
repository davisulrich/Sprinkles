import Paddle from "/paddle.js";
import InputHandler from "/input.js";
import Ball from "/ball.js";
import {
  buildLevel,
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
} from "/levels.js";

const GAME_STATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  GAMEWON: 5,
};

const despacitoAudio = new Audio("/audio/sprinkles-despacito.mp3");
despacitoAudio.volume = 0.2;
const levelUpAudio = new Audio("/audio/sprinkles-levelup.wav");
levelUpAudio.volume = 0.4;
const gameOverAudio = new Audio("/audio/sprinkles-gameover.wav");
gameOverAudio.volume = 0.4;
const pauseAudio = new Audio("/audio/sprinkles-horse.wav");
pauseAudio.volume = 0.4;

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAME_STATE.MENU;
    this.ball = new Ball(this);
    this.paddle = new Paddle(this);
    this.gameObjects = [];
    this.lives = 3;
    this.bricks = [];
    this.levels = [
      level1,
      level2,
      level3,
      level4,
      level5,
      level6,
      level7,
      level8,
    ];
    this.currentLevel = 0;

    this.reverseDirectionTimer = 0;

    new InputHandler(this.paddle, this);
  }

  start() {
    if (
      this.gamestate === GAME_STATE.MENU ||
      this.gamestate === GAME_STATE.NEWLEVEL ||
      this.gamestate === GAME_STATE.GAMEOVER
    ) {
      if (this.gamestate === GAME_STATE.GAMEOVER) {
        this.lives = 3;
        this.paddle = new Paddle(this);
        despacitoAudio.currentTime = 0;
        despacitoAudio.play();
      }

      if (this.gamestate === GAME_STATE.MENU && this.lives === 3) {
        despacitoAudio.pause();
        despacitoAudio.currentTime = 0;
        despacitoAudio.play();
      }

      this.bricks = buildLevel(this, this.levels[this.currentLevel]);
      this.ball.reset();
      this.gameObjects = [this.ball, this.paddle];
      this.gamestate = GAME_STATE.RUNNING;
    }
  }

  update() {
    if (this.lives === 0 && this.gamestate === GAME_STATE.RUNNING) {
      this.gamestate = GAME_STATE.GAMEOVER;
      despacitoAudio.pause();
      gameOverAudio.currentTime = 0;
      gameOverAudio.play();
    }
    if (
      this.gamestate === GAME_STATE.PAUSED ||
      this.gamestate === GAME_STATE.MENU ||
      this.gamestate === GAME_STATE.GAMEOVER ||
      this.gamestate === GAME_STATE.GAMEWON
    )
      return;

    [...this.gameObjects].forEach((object) => object.update());

    if (this.reverseDirectionTimer > 0) this.reverseDirectionTimer--;
    [...this.bricks].forEach((object) => object.update(this));
    this.bricks = this.bricks.filter((brick) => !brick.markedForDeletion);

    if (this.bricks.length === 0) {
      if (this.currentLevel === this.levels.length - 1) {
        this.gamestate = GAME_STATE.GAMEWON;
        despacitoAudio.pause();
        levelUpAudio.currentTime = 0;
        levelUpAudio.play();
        return;
      } else {
        this.gamestate = GAME_STATE.NEWLEVEL;
        this.currentLevel++;
        levelUpAudio.currentTime = 0;
        levelUpAudio.play();
        this.start();
      }
    }
  }

  draw(context) {
    if (this.gamestate === GAME_STATE.RUNNING) {
      context.fillStyle = "#ffffff";
      context.rect(0, 0, this.gameWidth, this.gameHeight);
      context.fill();

      context.font = "46px 'Press Start 2P'";
      context.fillStyle = "black";
      context.fillText("Level " + (this.currentLevel + 1), 300, 250);

      context.font = "12px 'Press Start 2P'";
      context.fillText("# Lives: " + this.lives, this.gameWidth - 68, 20);

      [...this.gameObjects, ...this.bricks].forEach((object) =>
        object.draw(context)
      );
    } else if (this.gamestate === GAME_STATE.MENU) {
      context.fillStyle = "#FFFFFF";
      context.rect(0, 0, this.gameWidth, this.gameHeight);
      context.fill();

      context.font = "44px 'Press Start 2P'";
      context.fillStyle = "#000000";
      context.textAlign = "center";
      context.fillText(
        "SPRINKLES",
        this.gameWidth / 2,
        this.gameHeight / 2 + 60
      );
      context.font = "18px 'Press Start 2P'";
      context.fillText(
        "by Davis Ulrich",
        this.gameWidth / 2,
        this.gameHeight / 2 + 110
      );
      context.font = "24px 'Press Start 2P'";
      context.fillStyle = "#000000";
      context.fillText(
        "press SPACE to start",
        this.gameWidth / 2,
        this.gameHeight / 2 + 170
      );
      context.drawImage(
        document.getElementById("img_icecream"),
        this.gameWidth / 2 - 62.5,
        this.gameHeight / 2 - 175,
        125,
        160
      );
    } else if (this.gamestate === GAME_STATE.PAUSED) {
      context.drawImage(
        document.getElementById("img_unicorn"),
        -300,
        -75,
        1200,
        630
      );

      context.font = "46px 'Press Start 2P'";
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    } else if (this.gamestate === GAME_STATE.GAMEOVER) {
      context.fillStyle = "#880015";
      context.rect(0, 0, this.gameWidth, this.gameHeight);
      context.fill();

      context.font = "46px 'Press Start 2P'";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText("BUMMER", this.gameWidth / 2, this.gameHeight / 2);
    } else if (this.gamestate === GAME_STATE.GAMEWON) {
      context.drawImage(
        document.getElementById("img_sprinkles"),
        0,
        0,
        1350,
        450
      );
      // context.drawImage(
      //   document.getElementById("img_mittens"),
      //   this.gameWidth / 2 - 100,
      //   this.gameHeight / 2 - 2000,
      //   200,
      //   250
      // );
      context.font = "46px 'Press Start 2P'";
      context.fillStyle = "#000000";
      context.textAlign = "center";
      context.fillText("You Win!", this.gameWidth / 2, this.gameHeight / 2);
    }
  }

  //pause game
  togglePause() {
    if (this.gamestate === GAME_STATE.PAUSED) {
      this.gamestate = GAME_STATE.RUNNING;
      despacitoAudio.play();
    } else {
      this.gamestate = GAME_STATE.PAUSED;
      despacitoAudio.pause();
      pauseAudio.currentTime = 0;
      pauseAudio.play();
    }
  }
}
