// youtube video: https://www.youtube.com/watch?v=3EMxBkqC4z0

import Game from "/game.js";

let canvas = document.getElementById("gameScreen");

let context = canvas.getContext("2d");

const GAME_WIDTH = 600;
const GAME_HEIGHT = 450;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);

function gameLoop() {
  context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update();
  game.draw(context);
}

setInterval(gameLoop, 1000 / 40);
