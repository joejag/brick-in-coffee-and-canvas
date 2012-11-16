canvas = $('#brick')[0]
context = canvas.getContext('2d')

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

drawRectangle = (drawable) ->
    context.fillRect(drawable.cords.x, drawable.cords.y,
                     drawable.dimensions.width, drawable.dimensions.height)

drawArc = (drawable) ->
    context.beginPath()
    # Draw full circle, 0 to 2xPI
    context.arc(drawable.cords.x, drawable.cords.y, drawable.radius,
        0, Math.PI*2, true)
    context.fill()

p = new Paddle
b = new Ball

drawRectangle(p)
drawArc(b)
