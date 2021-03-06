(function() {
  var Ball, Brick, Cords, Dimensions, GameWorld, Paddle, Score, canvas, clearScreen, context, drawCircle, drawClearedRectnagle, drawFilledRectangle, drawGameOver, drawGameOverWin, drawMenuLine, drawStrokedRectangle, gw, looper;

  canvas = $('#brick')[0];

  context = canvas.getContext('2d');

  drawFilledRectangle = function(d) {
    context.fillStyle = 'black';
    return context.fillRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height);
  };

  drawClearedRectnagle = function(d) {
    return context.clearRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height);
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

  drawGameOverWin = function() {
    context.fillStyle = 'green';
    return context.fillText("You win!!!", canvas.width / 2 - 70, canvas.height / 2);
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
      this.paddle_speed = 10;
      this.set_direction("NONE");
      this.register_key_listeners();
    }

    Paddle.prototype.draw = function() {
      return drawFilledRectangle(this);
    };

    Paddle.prototype.register_key_listeners = function() {
      var parent;
      parent = this;
      $(document).keydown(function(evt) {
        if (evt.keyCode === 39) {
          parent.set_direction("RIGHT");
        }
        if (evt.keyCode === 37) {
          return parent.set_direction("LEFT");
        }
      });
      return $(document).keyup(function(evt) {
        if (evt.keyCode === 39) {
          parent.set_direction("NONE");
        }
        if (evt.keyCode === 37) {
          return parent.set_direction("NONE");
        }
      });
    };

    Paddle.prototype.set_direction = function(direction) {
      return this.paddle_move = direction;
    };

    Paddle.prototype.move = function() {
      if (this.paddle_move === 'LEFT') {
        this.delta.x = this.paddle_speed * -1;
      } else if (this.paddle_move === 'RIGHT') {
        this.delta.x = this.paddle_speed;
      } else {
        this.delta.x = 0;
      }
      if (this.cords.x + this.delta.x < 0 || this.cords.x + this.delta.x + this.dimensions.width > canvas.width) {
        this.delta.x = 0;
      }
      return this.cords.x += this.delta.x;
    };

    return Paddle;

  })();

  Ball = (function() {

    function Ball(game_world) {
      this.game_world = game_world;
      this.cords = new Cords(300, 300);
      this.radius = 10;
      this.delta = new Cords(-3, -6);
    }

    Ball.prototype.draw = function() {
      return drawCircle(this);
    };

    Ball.prototype.movement = function() {
      return {
        top: this.cords.y + this.delta.y - this.radius,
        bottom: this.cords.y + this.delta.y + this.radius,
        left: this.cords.x + this.delta.x - this.radius,
        right: this.cords.x + this.delta.x + this.radius
      };
    };

    Ball.prototype.move = function() {
      var brick, brick_bottom, brick_left, brick_right, brick_top, hit_brick_x, hit_brick_y, moves, p, touching_bottom, touching_left, touching_right, touching_top, _i, _len, _ref;
      moves = this.movement();
      if (moves.top < 0) {
        this.delta.y *= -1;
      }
      if (moves.left < 0 || moves.right > canvas.width) {
        this.delta.x *= -1;
      }
      if (moves.bottom > canvas.height) {
        this.game_world.endGame(false);
      }
      p = this.game_world.paddle;
      if (moves.bottom >= p.cords.y) {
        if (this.cords.x + this.delta.x >= p.cords.x && this.cords.x + this.delta.x <= p.cords.x + p.dimensions.width) {
          if (this.delta.y > 0) {
            this.delta.y *= -1;
          }
        }
      }
      hit_brick_x = false;
      hit_brick_y = false;
      _ref = this.game_world.bricks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brick = _ref[_i];
        if (brick.dead) {
          continue;
        }
        if (hit_brick_x && hit_brick_y) {
          continue;
        }
        brick_bottom = brick.cords.y + brick.dimensions.height;
        brick_top = brick.cords.y;
        brick_left = brick.cords.x;
        brick_right = brick.cords.x + brick.dimensions.width;
        touching_left = (moves.right >= brick_left) && (this.cords.x + this.radius <= brick_left);
        touching_right = (moves.left <= brick_right) && (this.cords.x - this.radius >= brick_right);
        if (touching_left || touching_right) {
          if ((moves.top <= brick_bottom) && (moves.bottom >= brick_top)) {
            brick.explode();
            this.game_world.score.score += 10;
            this.delta.x *= -1;
            hit_brick_x = true;
          }
        }
        touching_bottom = (moves.top <= brick_bottom) && (this.cords.y - this.radius >= brick_bottom);
        touching_top = (moves.bottom >= brick_top) && (this.cords.y + this.radius <= brick_top);
        if (touching_bottom || touching_top) {
          if ((moves.right >= brick_left) && (moves.left <= brick_right)) {
            brick.explode();
            this.game_world.score.score += 10;
            this.delta.y *= -1;
            hit_brick_y = true;
          }
        }
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
      this.dead = false;
    }

    Brick.prototype.draw = function() {
      if (!this.dead) {
        return drawStrokedRectangle(this);
      }
    };

    Brick.prototype.explode = function() {
      this.dead = true;
      return drawClearedRectnagle(this);
    };

    Brick.prototype.alive = function() {
      return this.dead;
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
        for (y = _j = 0; _j < 11; y = ++_j) {
          brick_color = _.shuffle(['orange', 'red', 'green'])[0];
          this.bricks.push(new Brick(new Cords(x, y), brick_width, brick_color));
        }
      }
    }

    GameWorld.prototype.startGame = function() {
      console.log(looper);
      return this.game_loop = setInterval(looper, 20);
    };

    GameWorld.prototype.endGame = function(win) {
      clearInterval(this.game_loop);
      if (win) {
        return drawGameOverWin();
      } else {
        return drawGameOver();
      }
    };

    GameWorld.prototype.animate = function() {
      var brick, _i, _len, _ref, _results;
      clearScreen();
      this.ball.move();
      this.paddle.move();
      if (_.filter(this.bricks, function(brick) {
        return brick.dead;
      }).length === this.bricks.length) {
        this.endGame(true);
      }
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
