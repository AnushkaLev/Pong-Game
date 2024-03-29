let board;
let boardWidth = 500;
let boardHeight = window.innerHeight - 30;
let context;

let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 10;

let ballWidth = 10;
let ballHeight = 10;

let player1Score = 0;
let player2Score = 0;


let player1 = {
    x : 10,
    y : boardHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocityY : 0

}

let player2 = {
    x : boardWidth - 10 - playerWidth,
    y : boardHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocityY : 0
}

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : 3,
    velocityY : 4
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    context.fillStyle = "skyblue";
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    requestAnimationFrame(update)
    document.addEventListener("keyup", movePlayer);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "skyblue";
    let nextPlayer1Y = player1.y + player1.velocityY;   
    if(!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    let nextPlayer2Y = player2.y + player2.velocityY;   
    if(!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }    
    
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

    if (ball.x - ball.width <= player1.x + player1.width && ball.y >= player1.y && ball.y <= player1.y + player1.height) {
      ball.velocityX = Math.floor(Math.random() * 5) + 4; // Random speed between 2 and 5
  }
  
  if (ball.x + ball.width >= player2.x && ball.y >= player2.y && ball.y <= player2.y + player2.height) {
      ball.velocityX = -(Math.floor(Math.random() * 5) + 4); // Random speed between 2 and 5
  }

    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

    //ball.y is top left corner silly --> to reverse direction if ball hits bounds
    if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
        ball.velocityY *= -1;
    }

    if(detectCollision(ball, player1)) {
        if (ball.x < player1.x + player1.width) {
            ball.velocityX *= -1;
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) {
            ball.velocityX *= -1;
        }
    }

    if (ball.x < 0) {
        player2Score++;
        resetGame(1);
    }
    else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        resetGame(-1);
    }

    context.font = "45px Georgia";
    context.fillText(player1Score, boardWidth/5, 45);
    context.fillText(player2Score, boardWidth*4/5 - 45, 45);

    context.fillRect(board.width / 2 - 1, 0, 2, board.height);

    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);
}

function outOfBounds(yPostion) {
    if ((yPostion + playerHeight) > boardHeight || yPostion < 0) {
        return true;
    }
    return false;

}

function movePlayer(e) {
  if (e.code == "KeyW") {
      player1.velocityY = -10;
  }
  else if (e.code == "KeyS") {
      player1.velocityY = 10;
  }
  

  if (e.code == "ArrowUp") {
      player2.velocityY = -10;
  }
  else if (e.code == "ArrowDown") {
      player2.velocityY = 10;
  }
}

function stopPlayer(e) {
  if (e.code == "KeyW" || e.code == "KeyS") {
      player1.velocityY = 0;
  }

  if (e.code == "ArrowUp" || e.code == "ArrowDown") {
      player2.velocityY = 0;
  }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && //a top-left corner doesn't exceed b top-right corner 
           a.x + a.width > b.x && //a top-right corner does exceed b top-top corner 
           a.y < b.y + b.height && //a top-left corner doesn't exceed b bottom-left corner 
           a.y + a.height > b.y; //a bottom-left corner does exceed b top-left corner 
}

function resetGame(direction) {
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : direction * 4,
        velocityY : 5
    }
}