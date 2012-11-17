(function() {
  var Ball, Brick, Cords, Dimensions, GameWorld, Paddle, Score, canvas, clearScreen, context, drawCircle, drawFilledRectangle, drawGameOver, drawMenuLine, drawStrokedRectangle, gw, looper;

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
        this.delta.y *= -1;
      }
      if (this.cords.x + this.delta.x - this.radius < 0 || this.cords.x + this.delta.x + this.radius > canvas.width) {
        this.delta.x *= -1;
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

    function GameWorld() {
      var brick_color, brick_width, bricks_per_row, x, y, _i, _j;
      this.paddle = new Paddle;
      this.ball = new Ball(this);
      this.score = new Score;
      bricks_per_row = 8;
      brick_width = canvas.width / bricks_per_row;
      this.bricks = [];
      for (x = _i = 0; 0 <= bricks_per_row ? _i < bricks_per_row : _i > bricks_per_row; x = 0 <= bricks_per_row ? ++_i : --_i) {
        for (y = _j = 0; _j < 4; y = ++_j) {
          brick_color = _.shuffle(['orange', 'red', 'green'])[0];
          this.bricks.push(new Brick(new Cords(x, y), brick_width, brick_color));
        }
      }
    }

    GameWorld.prototype.startGame = function() {
      return setInterval(looper, 20);
    };

    GameWorld.prototype.endGame = function() {
      clearInterval(looper);
      return drawGameOver();
    };

    GameWorld.prototype.animate = function() {
      var brick, _i, _len, _ref, _results;
      clearScreen();
      this.ball.move();
      this.paddle.draw();
      this.ball.draw();
      this.score.draw();
      _ref = this.bricks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brick = _ref[_i];
        _results.push(brick.draw());
      }
      return _results;
    };

    return GameWorld;

  })();

  gw = new GameWorld;

  looper = function() {
    return gw.animate();
  };

  gw.startGame();

}).call(this);
