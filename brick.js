(function() {
  var Ball, Brick, Cords, Dimensions, Paddle, Score, animate, ball, brick_width, bricks, bricks_per_row, canvas, context, drawCircle, drawFilledRectangle, drawMenuLine, drawStrokedRectangle, endGame, paddle, score, startGame, x, y, _i, _j;

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

    function Ball() {
      this.cords = new Cords(300, 300);
      this.radius = 10;
    }

    Ball.prototype.draw = function() {
      return drawCircle(this);
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

  bricks_per_row = 8;

  brick_width = canvas.width / bricks_per_row;

  paddle = new Paddle;

  ball = new Ball;

  score = new Score;

  bricks = [];

  for (x = _i = 0; 0 <= bricks_per_row ? _i < bricks_per_row : _i > bricks_per_row; x = 0 <= bricks_per_row ? ++_i : --_i) {
    for (y = _j = 0; _j < 4; y = ++_j) {
      bricks.push(new Brick(new Cords(x, y), brick_width, _.shuffle(['orange', 'red', 'green'])[0]));
    }
  }

  animate = function() {
    var brick, _k, _len, _results;
    paddle.draw();
    ball.draw();
    score.draw();
    _results = [];
    for (_k = 0, _len = bricks.length; _k < _len; _k++) {
      brick = bricks[_k];
      _results.push(brick.draw());
    }
    return _results;
  };

  startGame = function() {
    var gameLoop;
    return gameLoop = setInterval(animate, 20);
  };

  endGame = function() {
    clearInterval(gameLoop);
    return context.fillText("Game Over!!!", canvas.width / 2, canvas.height / 2);
  };

  startGame();

}).call(this);
