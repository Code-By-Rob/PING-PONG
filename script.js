// Global Varibales
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};
var rounds = [5, 5, 3, 3, 2];
// the ball object (the cube that bounces back and forth)
var Ball = {
    new: function (incrementedSpeed) {
        return {
            width: 18,
            height: 18,
            x:(this.canvas.width / 2)-9,
            y:(this.canvas.height /2)-9,
            moveX:DIRECTION.IDLE,
            moveY:DIRECTION.IDLE,
            speed:incrementedSpeed || 9

        };
    }
};

// The paddle object (The two lines that move up and down)
var Paddle = {
    new: function (side) {
        return {
            width: 18,
            height: 120,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y:(this.canvas.height / 2) -35,
            score: 0,
            moce: DIRECTION.IDLE,
            speed: 10
        };
    }
};

var Game = { 
    initialize: function() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 1800;
        this.canvas.height = 1200;

        this.canvas.style.width = (this.canvas.width/2) + 'px';
        this.canvas.style.height = (this.canvas.height/2) + 'px';
        
        this.player = Paddle.new.call(this, 'left');
        this.paddle = Paddle.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.paddle.speed = 8;
        this.running = this.over = false;
        this.turn = this.paddle;
        this.timer = this.round = 0;
        this.color = '#000000';

        Pong.menu();
        Pong.listen();
        Pong.draw();
    },
    endGameMenu: function (text) {
            // change the canvas font size and colour
            Pong.context.font = '50px Courier New';
            Pong.context.fillStyle = this.color;

            //Draw the rectangle behind the 'Press any key to begin' text
            Pong.context.fillRect(
                Pong.canvas.width / 2 -350,
                Pong.canvas.height / 2 -48,
                700,
                100
            );

            //change the canvas colour
            Pong.context.fillStyle = '#ffffff';

            // draw the end game menu text ('Game Over' and 'Winner')
            Pong.context.fillText(text,
                Pong.canvas.width / 2,
                Pong.canvas.height / 2 + 15
                );

            setTimeout(function() {
                Pong = Object.assign({}, Game);
                Pong.initialize();
            }, 3000);
        },
    menu: function() {
        Pong.draw();

        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;

        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );
        this.context.fillStyle - '#ffffff';
        this.context.fillText('Press any key to begin!',
        this.canvas.width / 2,
        this.canvas.height / 2 + 15
        );
    },
    update: function () {
        if (!this.over) {
                if (this.ball.x <= 0) Pong._resetTurn.call(this, this.paddle, this.player);
                if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.paddle);
                if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
                if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
                // move player if they player.move value was updated by the keyboard event
                if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
                else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

                // On new serve (start of each turn) move the ball to the correct side
                // and randomise the direction to add some challenge
                if (Pong._turnDelayIsOver.call(this) && this.turn) {
                    this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                    this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                    this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                    this.turn= null;
                }
                // if the player collides with the bound limits, update the x and y
                if (this.player.y <= 0) this.player.y = 0;
                else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

                // Move the ball in the intended direction based on moveY and moveX values
                if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
                else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
                if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
                else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

                // Handle the paddle (AI) UP and DOWN movement
                if (this.paddle.y > this.ball.y - (this.paddle.height / 2)) {
                    if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y -= this.paddle.speed / 1.5;
                    else this.paddle.y -= this.paddle.speed / 4;
                }
                if (this.paddle.y < this.ball.y - (this.paddle.height / 2)) {
                    if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y += this.paddle.speed / 1.5;
                    else this.paddle.y += this.paddle.speed / 4;
                }
                // handle paddle (AI) wall collision
                if (this.paddle.y >= this.canvas.height - this.paddle.height) this. paddle.y = this.canvas.height - this.paddle.height;
                else if (this.paddle.y <= 0) this.paddle.y = 0;

                // handle the player and ball collision
                if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
                    if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
                        this.ball.x = (this.player.x + this.ball.width);
                        this.ball.moveX = DIRECTION.RIGHT;
                        // beep1.play();
                    }
                }
                // handle the paddle and ball collision
                if (this.ball.x - this.ball.width <= this.paddle.x && this.ball.x >= this.paddle.x - this.paddle.width) {
                    if (this.ball.y <= this.paddle.y + this.paddle.height && this.ball.y + this.ball.height >= this.paddle.y) {
                        this.ball.x = (this.paddle.x - this.ball.width);
                        this.ball.moveX = DIRECTION.LEFT;
                        // beep1.play();
                    }
                }
            }
            // handle the end of the round transition
            // check to see if the player won the round
            if (this.player.score === rounds[this.round]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Winner'); }, 1000);

                    // check to see if there are any more rounds/levels left and display the victory screen if there are not
                    if (!rounds[this.round + 1]) {
                        this.over = true;
                        setTimeout(function () { Pong.endGameMenu('Winner'); }, 1000);
                    } else {
                        // if there is another round, reset all of the values and increment the round number
                        this.color = this._generatorRoundColor();
                        this.player.score = this.paddle.score = 0;
                        this.player.speed += 0.5;
                        this.paddle.speed += 1;
                        this.ball.speed += 1;
                        this.round += 1;
                        
                        // beep3.play();
                    }
            }
            else if (this.paddle.score === rounds[this.round]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
            }
    },
    draw: function () {

        // clear the canvas
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        //set the fill style to black
        this.context.fillStyle = this.color;
        //draw the background
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        //Set the fill style to white
        this.context.fillStyle = '#ffffff';
        //Draw the player
        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );
        //Set the fill style to white (For the paddles and the ball)
        this.context.fillStyle = '#ffffff';
        //Draw the paddle
        this.context.fillRect(
            this.paddle.x,
            this.paddle.y,
            this.paddle.width,
            this.paddle.height
        );
        // Draw the ball
        this.context.fillRect(
            this.ball.x,
            this.ball.y,
            this.ball.width,
            this.ball.height
        );
        // Set the default canvas font and align it to the center
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';
        // Draw the players score (left)
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width/2)-300,
            200
        );
        // draw the paddles score (right)
        this.context.fillText(
            this.paddle.score.toString(),
            (this.canvas.width/2)+300,
            200
        );
    },
    loop: function () {
        Pong.update();
        Pong.draw();

        if (!Pong.over) requestAnimationFrame(Pong.loop);
    },
    listen: function () {
            document.addEventListener('keydown', function (key) {
                // handle the 'Press any key to begin' function and start the game
                if (Pong.running === false) {
                    Pong.running = true;
                    window.requestAnimationFrame(Pong.loop);
                }
                // handle up arrow and w key events
                if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECTION.UP;

                // handle down arrow and s key events
                if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;
            });
            // stop the player from moving when there are no keys being pressed
            document.addEventListener('keyup', function (key) {Pong.player.move = DIRECTION.IDLE; });
        },
        // reset the ball location, the player turns and set a delay before the next round begins
        _resetTurn: function(victor, loser) {
            this.ball = Ball.new.call(this, this.ball.speed);
            this.turn = loser;
            this.timer = (new Date()).getTime();

            victor.score++;
            // beep2.play();
        },
        // wait for a delay to have passed after each turn
        _turnDelayIsOver: function() {
            return ((new Date()).getTime() - this.timer >= 1000);
        },
        //Select a random color as the background of each level/round
        _generateRoundColor: function () {
            var newColor = colors[Math.floor(Math.random() * colors.length)];
            if (newColor === this.color) return Pong._generateRoundColor();
            return newColor;
         }
}

var Pong = Object.assign({}, Game);
Pong.initialize();