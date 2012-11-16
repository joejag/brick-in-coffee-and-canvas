canvas = $('#brick')[0]
context = canvas.getContext('2d')

class Cords
    constructor: (@x, @y) ->

class Dimensions
    constructor: (@height, @width) ->

class Paddle
    cords:  new Cords 100, 460
    dimensions: new Dimensions 15, 100
    delta: new Cords 0, 0

p = new Paddle

drawRectangle = (drawable) ->
    context.fillRect(drawable.cords.x, drawable.cords.y,
                     drawable.dimensions.width, drawable.dimensions.height)

drawRectangle(p)
