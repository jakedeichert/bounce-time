var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var balls; // amount of balls
var requestAnimFrame =  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {window.setTimeout(callback, 1000 / 60);};

function init() {
    window.addEventListener('resize', changeSize, false);
    changeSize();
    loop();
}

function changeSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateBalls();
}

function generateBalls() {
    balls = new Array(Math.floor(canvas.width * canvas.height / 40000));
    var speed;
    var size;
    var color = "#ffffff";
    for (var i = 0; i < balls.length; i++) {
        size = randomRange(10, 50);
        speed = randomRange(1, 3);
		balls[i] = new Ball(color, speed, size);
        balls[i].randomColor();
	}
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < balls.length; i++) {
        balls[i].draw(); // draws all the balls
	}

    // draw time
    var d = new Date();
    var hours = d.getHours();
    var meridian = hours >= 12 ? 'pm' : 'am';
    if (hours > 12) {
        hours -= 12;
    } else if (hours == 0) {
       hours = 12;
    }
    var mins = d.getMinutes();
    var time = hours + ":" + pad(mins) + " " + meridian;
    var fontSize = canvas.width / 10;
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = "hsla(0, 0%, 100%, 0.5)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(time, canvas.width / 2, canvas.height / 2);

    requestAnimFrame(loop);
}

function pad(number) {
    return (number < 10) ? '0' + number : number;
}


function randomRange(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function getRandomDirection() {
    var dir = randomRange(0, 1);
    if (dir == 0) dir = -1;
    return dir;
}


function Ball(c, s, r) {
    this.color = c;
    this.radius = r;
    this.speed = s;
    this.xSpeed = this.speed * getRandomDirection();
    this.ySpeed = this.speed * getRandomDirection();
    this.drawX = randomRange(this.radius, canvas.width - this.radius);
    this.drawY = randomRange(this.radius, canvas.height - this.radius);
}



Ball.prototype.draw = function() {
    this.drawX += this.xSpeed;
    this.drawY += this.ySpeed;
    this.checkWallCollision();
    this.checkBallCollision();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.drawX, this.drawY, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
};

Ball.prototype.randomColor = function() {
    this.color = "hsla(" + randomRange(0, 360) + "," + randomRange(50, 100) + "%," + randomRange(20, 50) + "%, 1)";
};

Ball.prototype.checkWallCollision = function() { // checks if the ball hits one of the canvas walls

    if (this.drawY - this.radius < 0) { // north wall
        this.drawY = this.radius;
        this.ySpeed *= -1;
        this.randomColor();
    } else if (this.drawY + this.radius > canvas.height) { // south wall
        this.drawY = canvas.height - this.radius;
        this.ySpeed *= -1;
        this.randomColor();
    }

    if (this.drawX - this.radius < 0) { // west wall
        this.drawX = this.radius;
        this.xSpeed *= -1;
        this.randomColor();
    } else if (this.drawX + this.radius > canvas.width) { // east wall
        this.drawX = canvas.width - this.radius;
        this.xSpeed *= -1;
        this.randomColor();
    }
};

Ball.prototype.checkBallCollision = function() { // checks if a ball collides with another ball
    var dx, dy, rad, xVel, yVel;
    for (var i = 0; i < balls.length; i++) {
        if (i !== balls.indexOf(this)) { // makes sure it doesn't check if it collides with itself
            dx = this.drawX - balls[i].drawX;
            dy = this.drawY - balls[i].drawY;
            if (dx * dx + dy * dy <= (balls[i].radius + this.radius) * (balls[i].radius + this.radius)) { // checks if this ball is touching another ball
                rad = Math.atan2(dy, dx);
                xVel = this.speed * Math.cos(rad);
                yVel = this.speed * Math.sin(rad);
                this.xSpeed = xVel;
                this.ySpeed = yVel;
                this.randomColor();
                balls[i].randomColor();
                break;
            }
        }
    }
};


window.onload = init;
