#
# Drawing
#

canvas = $('#brick')[0]
context = canvas.getContext('2d')

drawFilledRectangle = (d) ->
    context.fillStyle = 'black'
    context.fillRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height)

drawStrokedRectangle = (d) ->
    context.fillStyle = d.color
    context.fillRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height)
    context.strokeRect(d.cords.x+1,d.cords.y+1, d.dimensions.width - 2, d.dimensions.height - 2)

drawCircle = (d) ->
    context.fillStyle = 'black'
    context.beginPath()
    context.arc(d.cords.x, d.cords.y, d.radius, 0, Math.PI*2, true)
    context.fill()

drawMenuLine = (d) ->
    context.fillStyle = 'grey'
    context.font = '20px Times New Roman'
    context.clearRect(0, canvas.height-30, canvas.width, 30)
    context.fillText("Score: #{d.score}", 10, canvas.height-5)

drawGameOver = ->
    context.fillStyle = 'red'
    context.fillText("Game Over!!!", canvas.width/2-70, canvas.height/2)

clearScreen = ->
    context.clearRect(0,0,canvas.width, canvas.height)

#
# Game world
#

class Cords
    constructor: (@x, @y) ->

class Dimensions
    constructor: (@height, @width) ->

class Paddle
    constructor: ->
        @cords = new Cords(100, 460)
        @dimensions = new Dimensions(15, 100)
        @delta = new Cords(0, 0)
    draw: ->
        drawFilledRectangle(this)

class Ball
    constructor: (@game_world) ->
        @cords = new Cords(300, 300)
        @radius = 10
        @delta = new Cords(-2, -4)
    draw: -> drawCircle(this)
    move: ->
        # hits top of screen, move downwards
        if @cords.y + @delta.y - @radius < 0
            @delta.y = @delta.y * -1
        
        # hits bottom of screen, then end game
        if @cords.y + @delta.y + @radius > canvas.height
            @game_world.endGame()

        @cords = new Cords(@cords.x + @delta.x, @cords.y + @delta.y)

class Brick
    constructor: (@base_cords, @width, @color) ->
        @dimensions = new Dimensions(20, @width)
        @cords = new Cords(@base_cords.x * @dimensions.width, @base_cords.y * @dimensions.height)
    draw: -> drawStrokedRectangle(this)

class Score
    score: 0
    draw: -> drawMenuLine(this)

class GameWorld
    startGame: ->
        @gameLoop = setInterval(@animate, 20)

    endGame: ->
        clearInterval(@gameLoop)
        drawGameOver()

    animate: ->
        clearScreen()

        ball.move()

        paddle.draw()
        ball.draw()
        score.draw()
        brick.draw() for brick in bricks

#
# Objects
#

gw = new GameWorld
bricks_per_row = 8
brick_width = canvas.width/bricks_per_row

paddle = new Paddle
ball = new Ball(gw)
score = new Score
bricks = []
for x in [0...bricks_per_row]
  for y in [0...4]
      bricks.push new Brick(new Cords(x,y), brick_width, _.shuffle(['orange', 'red','green'])[0])

gw.startGame()



