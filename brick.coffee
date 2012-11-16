#
# Drawing
#

canvas = $('#brick')[0]
context = canvas.getContext('2d')

drawFilledRectangle = (d) ->
    context.fillRect(d.cords.x, d.cords.y,
                     d.dimensions.width, d.dimensions.height)

drawStrokedRectangle = (d) ->
    context.fillStyle = d.color
    context.fillRect(d.cords.x, d.cords.y,
                     d.dimensions.width, d.dimensions.height)
    context.strokeRect(d.cords.x+1,d.cords.y+1,
                       d.dimensions.width - 2, d.dimensions.height - 2)
    

drawArc = (drawable) ->
    context.beginPath()
    # Draw full circle, 0 to 2xPI
    context.arc(drawable.cords.x, drawable.cords.y, drawable.radius,
        0, Math.PI*2, true)
    context.fill()

#
# Game world
#

class Cords
    constructor: (@x, @y) ->

class Dimensions
    constructor: (@height, @width) ->

class Paddle
    cords: new Cords 100, 460
    dimensions: new Dimensions 15, 100
    delta: new Cords 0, 0

class Ball
    cords: new Cords 300, 300
    radius: 10

class Brick
    constructor: (@base_cords, @width, @color) ->
        @dimensions = new Dimensions(20, @width)
        @cords = new Cords(@base_cords.x * @dimensions.width, @base_cords.y * @dimensions.height)

#
# Objects
#

bricks_per_row = 8
brick_width = canvas.width/bricks_per_row

paddle = new Paddle
ball = new Ball
bricks = []
for x in [0...bricks_per_row]
  for y in [0...4]
      bricks.push new Brick(new Cords(x,y), brick_width, _.shuffle(['orange', 'red','green'])[0])


#
# Draw world
#

drawFilledRectangle(paddle)
drawArc(ball)
drawStrokedRectangle(brick) for brick in bricks




