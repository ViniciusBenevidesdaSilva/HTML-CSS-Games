
//board
var blockSize = 30;
var cols = 20;
var rows = 20;
var board;
var context;
var scoreTxt;

var score = 0;
var maxScore = 0;

//snake head
var snakeX =  blockSize * Math.floor(cols / 2);
var snakeY = blockSize * Math.floor(rows / 2);

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX =  blockSize;
var foodY = blockSize;

var gameOver = false;


window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    scoreTxt = document.getElementById("score");


    placeFood();
    document.addEventListener("keyup", startGame);
    document.addEventListener("keyup", changeDirection);
    
    setInterval(update, 1000/10);  // 100ms
}

function startGame() {
    if(!gameOver){
        return;
    }
    score = 0;
    
    snakeX =  blockSize * Math.floor(cols / 2);
    snakeY = blockSize * Math.floor(rows / 2);

    velocityX = 0;
    velocityY = 0;

    snakeBody = [];

    placeFood();

    gameOver = false;
}

function update() {
    exibeScore();

    if(gameOver){
        return;
    }

    //background
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    //food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    verifyEat();

    moveSnake();

    verifyGameOver();
}

function exibeScore(){

    if(score > maxScore){
        maxScore = score;
    }

    scoreTxt.innerHTML = `Score: ${score}    Max Score: ${maxScore}`;
}


function placeFood() {
    do {
        foodX =  blockSize * Math.floor(Math.random() * cols);
        foodY = blockSize * Math.floor(Math.random() * rows);
    } while(foodX == snakeX && foodY == snakeY);
}

function changeDirection(e) {
    if(e.code == "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.code == "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }    
    else if(e.code == "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }    
    else if(e.code == "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}

function verifyEat() {
    if(foodX == snakeX && foodY == snakeY){
        snakeBody.push([foodX, foodY]);
        score++;
        placeFood();
    }
}

function moveSnake() {
    //update body postions
    for(let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }

    if(snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    //update head postion
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    //set positions
    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    for(let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
}

function verifyGameOver() {
    //gameOver conditions
    if(snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize){
        gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++) {
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true;        
        }
    }

    if(gameOver) {
        alert("Game Over!");
    }
}

