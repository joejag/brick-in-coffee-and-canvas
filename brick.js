(function() {
  var Ball, Cords, Dimensions, Paddle, b, canvas, context, drawArc, drawRectangle, p;

  canvas = $('#brick')[0];

  context = canvas.getContext('2d');

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

  drawRectangle = function(drawable) {
    return context.fillRect(drawable.cords.x, drawable.cords.y, drawable.dimensions.width, drawable.dimensions.height);
  };

  drawArc = function(drawable) {
    context.beginPath();
    context.arc(drawable.cords.x, drawable.cords.y, drawable.radius, 0, Math.PI * 2, true);
    return context.fill();
  };

  p = new Paddle;

  b = new Ball;

  drawRectangle(p);

  drawArc(b);

}).call(this);
