(function() {
  var Ball, Brick, Cords, Dimensions, GameWorld, Paddle, Score, ball, brick_width, bricks, bricks_per_row, canvas, clearScreen, context, drawCircle, drawFilledRectangle, drawGameOver, drawMenuLine, drawStrokedRectangle, gw, paddle, score, x, y, _i, _j;

  canvas = $('#brick')[0];

  context = canvas.getContext('2d');

  drawFilledRectangle = function(d) {
    context.fillStyle = 'black';
    return context.fillRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height);
  };

  drawStrokedRectangle = function(d) {
    context.fillStyle = d.color;
    context.fillRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height);
    return context.strokeRect(d.cords.x + 1, d.cords.y + 1, d.dimensions.width - 2, d.dimensions.height - 2);
  };

  drawCircle = function(d) {
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(d.cords.x, d.cords.y, d.radius, 0, Math.PI * 2, true);
    return context.fill();
  };

  drawMenuLine = function(d) {
    context.fillStyle = 'grey';
    context.font = '20px Times New Roman';
    context.clearRect(0, canvas.height - 30, canvas.width, 30);
    return context.fillText("Score: " + d.score, 10, canvas.height - 5);
  };

  drawGameOver = function() {
    context.fillStyle = 'red';
    return context.fillText("Game Over!!!", canvas.width / 2 - 70, canvas.height / 2);
  };

  clearScreen = function() {
    return context.clearRect(0, 0, canvas.width, canvas.height);
  };

  Cords = (function() {

    function Cords(x, y) {
      this.x = x;
      this.y = y;
    }

    return Cords;

  })();

  Dimensions = (function() {

    function Dimensions(height, width) {
      this.height = height;
      this.width = width;
    }

    return Dimensions;

  })();

  Paddle = (function() {

    function Paddle() {
      this.cords = new Cords(100, 460);
      this.dimensions = new Dimensions(15, 100);
      this.delta = new Cords(0, 0);
    }

    Paddle.prototype.draw = function() {
      return drawFilledRectangle(this);
    };

    return Paddle;

  })();

  Ball = (function() {

    function Ball(game_world) {
      this.game_world = game_world;
      this.cords = new Cords(300, 300);
      this.radius = 10;
      this.delta = new Cords(-2, -4);
    }

    Ball.prototype.draw = function() {
      return drawCircle(this);
    };

    Ball.prototype.move = function() {
      if (this.cords.y + this.delta.y - this.radius < 0) {
        this.delta.y = this.delta.y * -1;
      }
      if (this.cords.y + this.delta.y + this.radius > canvas.height) {
        this.game_world.endGame();
      }
      return this.cords = new Cords(this.cords.x + this.delta.x, this.cords.y + this.delta.y);
    };

    return Ball;

  })();

  Brick = (function() {

    function Brick(base_cords, width, color) {
      this.base_cords = base_cords;
      this.width = width;
      this.color = color;
      this.dimensions = new Dimensions(20, this.width);
      this.cords = new Cords(this.base_cords.x * this.dimensions.width, this.base_cords.y * this.dimensions.height);
    }

    Brick.prototype.draw = function() {
      return drawStrokedRectangle(this);
    };

    return Brick;

  })();

  Score = (function() {

    function Score() {}

    Score.prototype.score = 0;

    Score.prototype.draw = function() {
      return drawMenuLine(this);
    };

    return Score;

  })();

  GameWorld = (function() {

    function GameWorld() {}

    GameWorld.prototype.startGame = function() {
      return this.gameLoop = setInterval(this.animate, 20);
    };

    GameWorld.prototype.endGame = function() {
      clearInterval(this.gameLoop);
      return drawGameOver();
    };

    GameWorld.prototype.animate = function() {
      var brick, _i, _len, _results;
      clearScreen();
      ball.move();
      paddle.draw();
      ball.draw();
      score.draw();
      _results = [];
      for (_i = 0, _len = bricks.length; _i < _len; _i++) {
        brick = bricks[_i];
        _results.push(brick.draw());
      }
      return _results;
    };

    return GameWorld;

  })();

  gw = new GameWorld;

  bricks_per_row = 8;

  brick_width = canvas.width / bricks_per_row;

  paddle = new Paddle;

  ball = new Ball(gw);

  score = new Score;

  bricks = [];

  for (x = _i = 0; 0 <= bricks_per_row ? _i < bricks_per_row : _i > bricks_per_row; x = 0 <= bricks_per_row ? ++_i : --_i) {
    for (y = _j = 0; _j < 4; y = ++_j) {
      bricks.push(new Brick(new Cords(x, y), brick_width, _.shuffle(['orange', 'red', 'green'])[0]));
    }
  }

  gw.startGame();

}).call(this);
