export function detectCollision(ball, gameObject) {
    if (
      ball.position.x + ball.size.width > gameObject.position.x &&
      ball.position.x < gameObject.position.x + gameObject.width &&
      ball.position.y + ball.size.height > gameObject.position.y &&
      ball.position.y < gameObject.position.y + gameObject.height
    ) {
      return true;
    } else {
      return false;
    }
}