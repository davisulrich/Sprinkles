export default class InputHandler {
  constructor(paddle, game) {
    document.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowLeft":
          if (game.gamestate === 1) {
            paddle.moveLeft();
          }
          break;

        case "ArrowRight":
          if (game.gamestate === 1) {
            paddle.moveRight();
          }
          break;
        // escape key
        case "Escape":
          if (game.gamestate === 1) {
            game.togglePause();
          }
          break;
        // Spacebar
        case "Space":
          if (game.gamestate === 2 || game.gamestate === 3) {
            game.start();
          }
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "ArrowLeft":
          if (paddle.speed < 0) paddle.stop();
          break;

        case "ArrowRight":
          if (paddle.speed > 0) paddle.stop();
          break;
      }
    });
  }
}
