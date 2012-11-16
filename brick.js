(function() {
  var Ball, Brick, Cords, Dimensions, Paddle, ball, brick, brick_width, bricks, bricks_per_row, canvas, context, drawArc, drawFilledRectangle, drawStrokedRectangle, paddle, x, y, _i, _j, _k, _len;

  canvas = $('#brick')[0];

  context = canvas.getContext('2d');

  drawFilledRectangle = function(d) {
    return context.fillRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height);
  };

  drawStrokedRectangle = function(d) {
    context.fillStyle = d.color;
    context.fillRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height);
    return context.strokeRect(d.cords.x + 1, d.cords.y + 1, d.dimensions.width - 2, d.dimensions.height - 2);
  };

  drawArc = function(drawable) {
    context.beginPath();
    context.arc(drawable.cords.x, drawable.cords.y, drawable.radius, 0, Math.PI * 2, true);
    return context.fill();
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

    function Paddle() {}

    Paddle.prototype.cords = new Cords(100, 460);

    Paddle.prototype.dimensions = new Dimensions(15, 100);

    Paddle.prototype.delta = new Cords(0, 0);

    return Paddle;

  })();

  Ball = (function() {

    function Ball() {}

    Ball.prototype.cords = new Cords(300, 300);

    Ball.prototype.radius = 10;

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

    return Brick;

  })();

  bricks_per_row = 8;

  brick_width = canvas.width / bricks_per_row;

  paddle = new Paddle;

  ball = new Ball;

  bricks = [];

  for (x = _i = 0; 0 <= bricks_per_row ? _i < bricks_per_row : _i > bricks_per_row; x = 0 <= bricks_per_row ? ++_i : --_i) {
    for (y = _j = 0; _j < 4; y = ++_j) {
      bricks.push(new Brick(new Cords(x, y), brick_width, _.shuffle(['orange', 'red', 'green'])[0]));
    }
  }

  drawFilledRectangle(paddle);

  drawArc(ball);

  for (_k = 0, _len = bricks.length; _k < _len; _k++) {
    brick = bricks[_k];
    drawStrokedRectangle(brick);
  }

}).call(this);
