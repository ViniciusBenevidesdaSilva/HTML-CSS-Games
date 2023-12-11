
//#region Variables

//board
var blockSize = 30, cols = 20, rows = 20;
var board, context, scoreTxt;

//snake head
var snakeX =  blockSize * Math.floor(cols / 2);
var snakeY = blockSize * Math.floor(rows / 2);
var snakeBody = [];
var velocityX = 0, velocityY = 0;

//food
var foodX = blockSize, foodY = blockSize;

//game
var gameOver = false;
var score = 0, maxScore = 0;

//AI
var aiDirection = "right";

//#endregion Variables

//#region Main
document.addEventListener("DOMContentLoaded", function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    scoreTxt = document.getElementById("score");

    placeFood();
    document.addEventListener("keyup", startGame);

    setInterval(update, 1000/10);  // 100ms
});

function startGame() {

    if(!gameOver){
        return;
    }

    initializeGame();
}

function initializeGame() {
    score = 0;
    snakeX = blockSize * Math.floor(cols / 2);
    snakeY = blockSize * Math.floor(rows / 2);
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    placeFood();
    gameOver = false;
}

function update() {
    if(gameOver){
        return;
    }

    drawBackground();
    drawFood();
    verifyEat();

    moveAI();
    changeDirectionAI();

    moveSnake();
    drawSnake();
    drawScore();

    verifyGameOver();
}

//#endregion Main

//#region Utils

function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize);
}

function calcularCoresIntermediarias(corInicial, corFinal, quantidade) {
    const coresIntermediarias = [];
    
    for (let i = 0; i <= quantidade; i++) {
      const r = Math.round(corInicial.r + (corFinal.r - corInicial.r) * (i / quantidade));
      const g = Math.round(corInicial.g + (corFinal.g - corInicial.g) * (i / quantidade));
      const b = Math.round(corInicial.b + (corFinal.b - corInicial.b) * (i / quantidade));
  
      coresIntermediarias.push(`rgb(${r}, ${g}, ${b})`);
    }
    
    return coresIntermediarias;
}

function drawBackground() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
}

function drawFood() {
    drawBlock(foodX, foodY, "red");
}

function drawSnake() {
    const corInicial = { r: 0, g: 255, b: 0 }; // #00FF00
    const corFinal = { r: 0, g: 238, b: 255 }; // #00EEFF

    let cores = calcularCoresIntermediarias(corInicial, corFinal, 1 + snakeBody.length);

    drawBlock(snakeX, snakeY, cores[0]);

    for (let i = 0; i < snakeBody.length; i++) {
        drawBlock(snakeBody[i][0], snakeBody[i][1], cores[i + 1]);
    }
}

function drawScore() {
    if(score > maxScore){
        maxScore = score;
    }

    scoreTxt.innerHTML = `Score: ${score}    Max Score: ${maxScore}`;
}

//#endregion Utils

//#region Actions

function placeFood() {
    do {
        foodX = blockSize * Math.floor(Math.random() * cols);
        foodY = blockSize * Math.floor(Math.random() * rows);
    } while (
        (foodX === snakeX && foodY === snakeY) ||
        snakeBody.some(segment => segment[0] === foodX && segment[1] === foodY)
    );
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

    if (snakeBody.length === 0) 
        aiDirection = velocityX === 1 ? "right" : 
                        velocityX === -1 ? "left" : 
                            velocityY === 1 ? "down" : "up";
}

function verifyEat() {
    if(foodX === snakeX && foodY === snakeY){
        snakeBody.push([foodX, foodY]);
        score++;
        placeFood();
    }
}

function verifyGameOver() {
    //gameOver conditions
    if(
        snakeX < 0 || 
        snakeX >= cols * blockSize || 
        snakeY < 0 || 
        snakeY >= rows * blockSize
    ){
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

//#endregion Actions

//#region AI

function moveAI() {
    // Calcula a diferença entre as posições da cabeça da cobra e da comida
    const dx = foodX - snakeX;
    const dy = foodY - snakeY;

    // Determina a direção preferencial com base na diferença
    let preferredDirection;

    if (Math.abs(dx) > Math.abs(dy)) {
        preferredDirection = dx > 0 ? "right" : "left";
    } else {
        preferredDirection = dy > 0 ? "down" : "up";
    }

    // Verifica se a direção preferencial está livre, senão, tenta outras direções
    const directionsToTry = [preferredDirection, "up", "down", "left", "right"];
    
    for (const direction of directionsToTry) {
        let nextX = snakeX + (direction === "left" ? -blockSize : direction === "right" ? blockSize : 0);
        let nextY = snakeY + (direction === "up" ? -blockSize : direction === "down" ? blockSize : 0);

        // Verifica se a próxima posição está dentro das bordas do mapa
        if (nextX < 0 || nextX >= cols * blockSize || nextY < 0 || nextY >= rows * blockSize) {
            continue;
        }

        let collision = false;

        // Verifica se a próxima posição colide com o corpo da cobra
        for (let i = 0; i < snakeBody.length; i++) {
            if (nextX === snakeBody[i][0] && nextY === snakeBody[i][1]) {
                collision = true;
                break;
            }
        }

        // Se não houver colisão, atualiza a direção da IA
        if (!collision) {
            aiDirection = direction;
            break;
        }
    }
}

function changeDirectionAI() {
    if (gameOver) return;

    switch (aiDirection) {
        case "up":
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "down":
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case "left":
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "right":
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

//#endregion AI
