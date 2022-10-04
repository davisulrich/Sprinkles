const geniusOfLove = new Audio("/audio/genius_of_love.mp3");
geniusOfLove.volume = 0.5;

export default class InputHandler {
  constructor(paddle, game) {
    document.addEventListener("keydown", (event) => {
      switch (event.keyCode) {
        case 37:
          paddle.moveLeft();
          break;

        case 39:
          paddle.moveRight();
          break;
        // escape key
        case 27:
          game.togglePause();
          break;
        // Spacebar
        case 32:
          game.start();
          geniusOfLove.currentTime = 0;
          geniusOfLove.play();
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.keyCode) {
        case 37:
          if (paddle.speed < 0) paddle.stop();
          break;

        case 39:
          if (paddle.speed > 0) paddle.stop();
          break;
      }
    });
  }
}
