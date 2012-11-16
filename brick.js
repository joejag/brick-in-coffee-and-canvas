(function() {
  var Cords, Dimensions, Paddle, canvas, context, drawRectangle, p;

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

  p = new Paddle;

  drawRectangle = function(drawable) {
    return context.fillRect(drawable.cords.x, drawable.cords.y, drawable.dimensions.width, drawable.dimensions.height);
  };

  drawRectangle(p);

}).call(this);
