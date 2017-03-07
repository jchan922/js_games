//////////////////
//  VARIABLES   //
//////////////////

var canvas = document.getElementById("myCanvas");
canvas.width = 480;
canvas.height = 320;
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3;
var dy = -3;
var ballRadius = 5;

// Paddle variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

// Brick variables
var brickRowCount = Math.floor(Math.random()*(7-4)+4);
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 15;
var brickOffsetTop = 30;
var brickOffsetLeft = 25;

var bricks = [];                            // for current bricks and collision detection
for(c=0; c<brickColumnCount; c++) {         // loops through the number of columns first
    bricks[c] = [];                         // selects a column of bricks
    for(r=0; r<brickRowCount; r++) {        // nested loop for number of rows at each column
        bricks[c][r] = { x: 0, y: 0, status: 1 };      // creates object for specific brick and it's coordinates
    }
}

// Current Score
var score = 0;
var lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//////////////////
//  FUNCTIONS   //
//////////////////

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);    // ctx.arc(240, 160, 20, 0, Math.PI*2, false); // x and y coordinates of the arc's center
                                                // arc radius
                                                // start angle and end angle (what angle to start and finish drawing the circle, in radians)
                                                // direction of drawing (false for clockwise, the default, or true for anti-clockwise.) This last parameter is optional.
    ctx.fillStyle = "#"+((1<<24)*Math.random()|0).toString(16);
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-2*paddleHeight, paddleWidth, paddleHeight); // the first two values specify the coordinates of the top left corner of the rectangle on the canvas
                                                                                // the second two specify the width and height of the rectangle.
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    // drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBricks();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();

    // Check ball position
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {  // if x hits the wall, switch the direction of ball
        dx = -dx;
    }
    if (y + dy < ballRadius) {                                      // if y hits the wall, switch the direction of ball
        dy = -dy;
    }

    if (y + dy > canvas.height - 2*paddleHeight - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {          // if ball position on x axis is inbetween the paddle width, ball hits the paddle
            dy = -dy-(Math.random() * (.1-.75) + .75);
        } else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                alert("YOU LOST A LIFE.");
                x = canvas.width/(Math.random() * (4-2)+2);
                y = canvas.height-(Math.random() * (100-75)+75);
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    // Check paddle position
    if(rightPressed && paddleX < canvas.width - paddleWidth) {    // if right key pressed and you haven't hit the right side of screen
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {                       // if left key pressed and you haven't hit the left side of screen
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;

    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection(){
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++){
            var b = bricks[c][r];
            if(b.status == 1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {   // if the ball's x,y is touching any current brick's x,y
                    dy = -dy;                                                           // we will change the direction of the ball
                    b.status = 0;                                                       // and update status to 0
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS! You Scored "+score+" Bricks!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Helvetica";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);       // 1st parameter is the text, 2nd & 3rd parameters are the x,y for placement.
}

function drawLives() {
    ctx.font = "16px Helvetica";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

// Begin Game
draw();





//////////////
//  NOTES   //
//////////////

// // Rectangle Drawing ======================================================================
// ctx.beginPath();            // begin rectangle creator
// ctx.rect(20, 20, 50, 50);   // the first two values specify the coordinates of the top left corner of the rectangle on the canvas
//                             // the second two specify the width and height of the rectangle.
// ctx.fillStyle = "#FF0000";  // style rectangle
// ctx.fill();                 // fill in rectangle
// ctx.closePath();            // done creating rectangle
//
// // Circle Drawing ===========================================================================
// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false); // x and y coordinates of the arc's center
//                                             // arc radius
//                                             // start angle and end angle (what angle to start and finish drawing the circle, in radians)
//                                             // direction of drawing (false for clockwise, the default, or true for anti-clockwise.) This last parameter is optional.
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();
//
// // Rectangle w/ Outer Color Drawing =======================================================
// ctx.beginPath();
// ctx.rect(190, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"; // color of border
// ctx.stroke();
// ctx.closePath();
