#
# Drawing
#

canvas = $('#brick')[0]
context = canvas.getContext('2d')

drawFilledRectangle = (d) ->
    context.fillStyle = 'black'
    context.fillRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height)

drawClearedRectnagle = (d) ->
    context.clearRect(d.cords.x, d.cords.y, d.dimensions.width, d.dimensions.height)

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
        @paddle_speed = 10
        @set_direction("NONE")
        @register_key_listeners()
    draw: ->
        drawFilledRectangle(this)
    register_key_listeners: ->
        parent = this
        $(document).keydown (evt) ->
            parent.set_direction("RIGHT") if evt.keyCode == 39
            parent.set_direction("LEFT")  if evt.keyCode == 37
        $(document).keyup (evt) ->
            parent.set_direction("NONE") if evt.keyCode == 39
            parent.set_direction("NONE") if evt.keyCode == 37
    set_direction: (direction) ->
        @paddle_move = direction
    move: ->
        # Set the delta
        if @paddle_move == 'LEFT'
            @delta.x  = @paddle_speed * -1
        else if @paddle_move == 'RIGHT'
            @delta.x  = @paddle_speed
        else @delta.x =  0

        # bounds checking for screen sides
        if @cords.x + @delta.x < 0 or @cords.x + @delta.x + @dimensions.width > canvas.width
            @delta.x = 0

        @cords.x += @delta.x

class Ball
    constructor: (@game_world) ->
        @cords = new Cords(300, 300)
        @radius = 10
        @delta = new Cords(-2, -4)
    draw: -> drawCircle(this)
    move: ->
        # hits top of screen, move downwards
        if @cords.y + @delta.y - @radius < 0
            @delta.y *= -1

        # hits side of wall, reverse X direction
        if @cords.x + @delta.x - @radius < 0 or @cords.x + @delta.x + @radius > canvas.width
            @delta.x *= -1
        
        # hits bottom of screen, then end game
        if @cords.y + @delta.y + @radius > canvas.height
            @game_world.endGame()

        # hits paddle
        # is inline with paddle Y
        p = @game_world.paddle
        if @cords.y + @delta.y + @radius >= p.cords.y
            # is positioned within the paddle
            if @cords.x + @delta.x >= p.cords.x and @cords.x + @delta.x <= p.cords.x + p.dimensions.width
                @delta.y *= -1 if @delta.y > 0

        # hits brick
        for brick in @game_world.bricks
            continue if brick.dead
            touching_left = false
            touching_right = false
            if (@cords.x + @delta.x + @radius >= brick.cords.x) and (@cords.x + @radius <= brick.cords.x)
                touching_left = true
            if (@cords.x + @delta.x - @radius <= brick.cords.x + brick.dimensions.width) and (@cords.x - @radius >= brick.cords.x + brick.dimensions.width)
                touching_right = true
            if touching_left or touching_right
                if (@cords.y + @delta.y - @raidus <= brick.cords.y + brick.dimensions.height) and (@cords.y + @delta.y + @radius >= brick.cords.y)
                    brick.explode()
                    @game_world.score.score += 10
                    @delta.y *= -1
                    continue

            touching_bottom = false
            touching_top = false

            ball_y_top = @cords.y + @delta.y - @radius
            ball_y_cur_top = @cords.y - @radius
            brick_y_bottom = brick.cords.y + brick.dimensions.height

            if (ball_y_top <= brick_y_bottom) and (ball_y_cur_top >= brick_y_bottom)
                touching_bottom = true
            if(@cords.y + @delta.y + @radius >= brick.cords.y) and (@cords.y + @radius <= brick.cords.y)
                touching_top = true
            if touching_bottom or touching_top
                if(@cords.x + @delta.x + @radius >= brick.cords.x) and (@cords.x + @delta.x - @radius <= brick.cords.x + brick.dimensions.width)
                    brick.explode()
                    @game_world.score.score += 10
                    @delta.x *= -1
        
        @cords = new Cords(@cords.x + @delta.x, @cords.y + @delta.y)

class Brick
    constructor: (@base_cords, @width, @color) ->
        @dimensions = new Dimensions(20, @width)
        @cords = new Cords(@base_cords.x * @dimensions.width, @base_cords.y * @dimensions.height)
        @dead = false
    draw: ->
        drawStrokedRectangle(this) unless @dead
    explode: ->
        @dead = true
        drawClearedRectnagle(this)
    alive: -> @dead

class Score
    score: 0
    draw: -> drawMenuLine(this)

class GameWorld
    constructor: ->
        @paddle = new Paddle
        @ball = new Ball(this)
        @score = new Score

        bricks_per_row = 8
        brick_width = canvas.width/bricks_per_row

        @bricks = []
        for x in [0...bricks_per_row]
          for y in [0...4]
              brick_color = _.shuffle(['orange', 'red','green'])[0]
              @bricks.push new Brick(new Cords(x,y), brick_width, brick_color)
    
    startGame: ->
        console.log looper
        @game_loop = setInterval(looper, 20)

    endGame: ->
        clearInterval(@game_loop)
        drawGameOver()

    animate: () ->
        clearScreen()

        @ball.move()
        @paddle.move()

        @paddle.draw()
        @ball.draw()
        @score.draw()
        brick.draw() for brick in @bricks

#
# Start world
#

gw = new GameWorld

looper = ->
    gw.animate()

gw.startGame()



