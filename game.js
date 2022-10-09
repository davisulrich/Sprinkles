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

    new InputHandler(this.paddle, this);
  }

  start() {
    if (
      this.gamestate !== GAME_STATE.MENU &&
      this.gamestate !== GAME_STATE.NEWLEVEL &&
      this.gamestate !== GAME_STATE.GAMEOVER
    )
      return;
    if (this.gamestate == GAME_STATE.GAMEOVER) {
      this.lives = 3;
      this.paddle = new Paddle(this);
    }
    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.ball.reset();
    this.gameObjects = [this.ball, this.paddle];
    this.gamestate = GAME_STATE.RUNNING;
  }

  update(deltaTime) {
    if (this.lives === 0) this.gamestate = GAME_STATE.GAMEOVER;
    if (
      this.gamestate === GAME_STATE.PAUSED ||
      this.gamestate === GAME_STATE.MENU ||
      this.gamestate === GAME_STATE.GAMEOVER ||
      this.gamestate === GAME_STATE.GAMEWON
    )
      return;

    [...this.gameObjects, ...this.bricks].forEach((object) =>
      object.update(deltaTime)
    );
    this.bricks = this.bricks.filter((brick) => !brick.markedForDeletion);

    if (this.bricks.length === 0) {
      if (this.currentLevel === this.levels.length - 1) {
        this.gamestate = GAME_STATE.GAMEWON;
        return;
      }
      this.gamestate = GAME_STATE.NEWLEVEL;
      this.currentLevel++;
      this.start();
    }
  }

  draw(context) {
    if (this.gamestate === GAME_STATE.RUNNING) {
      context.fillStyle = "#ffffff";
      context.rect(0, 0, this.gameWidth, this.gameHeight);
      context.fill();
      context.font = "20px Silkscreen";
      context.fillStyle = "black";
      context.fillText("Level " + (this.currentLevel + 1), 52, 20);
      context.fillStyle = "black";
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
      // console.log(context.font);
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
      context.rect(0, 0, this.gameWidth, this.gameHeight);
      context.fillStyle = "rgba(100, 100, 0, 0.5)";
      context.fill();

      context.font = "40px Silkscreen";
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    } else if (this.gamestate === GAME_STATE.GAMEOVER) {
      context.fillStyle = "#880015";
      context.rect(0, 0, this.gameWidth, this.gameHeight);
      context.fill();

      context.font = "40px Silkscreen";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText("BUMMER", this.gameWidth / 2, this.gameHeight / 2);
    } else if (this.gamestate === GAME_STATE.GAMEWON) {
      context.fillStyle = "#a0f76d";
      context.rect(0, 0, this.gameWidth, this.gameHeight);
      context.fill();
      context.drawImage(
        document.getElementById("img_mittens"),
        this.gameWidth / 2 - 100,
        this.gameHeight / 2 - 150,
        200,
        250
      );
      context.font = "30px Silkscreen";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(
        "You Win! High Five!",
        this.gameWidth / 2,
        this.gameHeight / 2 + 150
      );
    }
  }

  //pause game
  togglePause() {
    if (this.gamestate === GAME_STATE.PAUSED) {
      this.gamestate = GAME_STATE.RUNNING;
    } else {
      this.gamestate = GAME_STATE.PAUSED;
    }
  }
}
