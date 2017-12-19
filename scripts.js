document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')

  var width
  var height
  var center

  var MIN_ZOOM = 0.1
  var MAX_ZOOM = 10
  var DEFAULT_ZOOM = 0.2
  var STAR_ACC = 1.01
  var MIN_RADIUS = 1
  var MAX_RADIUS = 3

  var stars = []

  var starNum = 200
  var zoom = DEFAULT_ZOOM

  var STARS_RED = 'STARS_RED'
  var STARS_BLUE = 'STARS_BLUE'
  var STARS_PURPLE = 'STARS_PURPLE'
  var STARS_WHITE = 'STARS_WHITE'
  var STARS_MULTI = 'STARS_MULTI'

  var colorTiedToRadius = true

  var starColor = STARS_MULTI

  class Star {
    constructor(id) {
      this.id = id
      this.reset()
    }

    reset() {
      this.x = Math.random() * width
      this.y = Math.random() * height
      var vAngle = Math.atan2(this.y - center.y, this.x - center.x)
      var vMagnitude = (Math.random()) + 1
      this.vx = vMagnitude * Math.cos(vAngle)
      this.vy = vMagnitude * Math.sin(vAngle)

      var radiusRand = Math.random()
      this.radius = (radiusRand * (MAX_RADIUS - MIN_RADIUS)) + MIN_RADIUS
      this.opacity = 0
      
      var colorRand
      if (colorTiedToRadius) {
        colorRand = radiusRand
      } else {
        colorRand = Math.random()
      }
      switch (starColor) {
        case STARS_WHITE:
          this.color = `rgb(255, 255, 255)`
          break
        case STARS_RED:
          this.color = randomRed(colorRand)
          break
        case STARS_BLUE:
          this.color = randomBlue(colorRand)
          break  
        case STARS_PURPLE:
          this.color = randomPurple(colorRand)
          break
        case STARS_MULTI:
          var colorChoice = Math.random() * 3
          if (colorChoice < 1) {
            this.color = randomRed(colorRand)
          } else if (colorChoice < 2) {
            this.color = randomBlue(colorRand)
          } else {
            this.color = randomPurple(colorRand)
          }
          break
        default:
          this.color = `rgb(255, 255, 255)`
      }
      
    }

    step() {
      this.x += this.vx * zoom
      this.y += this.vy * zoom
      this.vx *= STAR_ACC
      this.vy *= STAR_ACC
      if (this.offScreen()) {
        this.reset()
        return
      }
      this.calculateOpacity()
    }

    calculateOpacity() {
      if (this.opacity > 0 && this.lifespan < 20) {
        this.opacity -= 0.02
      } else if (this.opacity < 0.9 && zoom > 1) {
        this.opacity += 0.1
      } else if (this.opacity < 0.9) {
        this.opacity += 0.02
      }
    }

    draw() {
      ctx.fillStyle = this.color
      ctx.globalAlpha = this.opacity
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    offScreen() {
      return this.x > width || 
             this.y > height ||
             this.x < 0 ||
             this.y < 0
    }
  }

  function randomRed(colorRand) {
    return `rgb(255, ${Math.floor(colorRand * 255)}, ${Math.floor(colorRand * 255)})`
  }

  function randomBlue(colorRand) {
    return `rgb(${Math.floor(colorRand * 255)}, ${Math.floor(colorRand * 255)}, 255)`
  }

  function randomPurple(colorRand) {
    return this.color = `rgb(255, ${Math.floor(colorRand * 255)}, 255)`
  }

  init()

  function step() {
    update()
    draw()
    window.requestAnimationFrame(step)
  }

  window.requestAnimationFrame(step)

  function createStars() {
    for (var i = 0; i < starNum; i++) {
      if (!stars[i])
      stars[i] = new Star(i)
    }
  }

  function init() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')

    width = canvas.width
    height = canvas.height

    center = {
      x: width / 2,
      y: height / 2
    }
    createStars()
  }

  function update() {
    for (var i = 0; i < starNum; i++) {
      stars[i].step()
    }
  }

  function draw() {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    for (var i = 0; i < starNum; i++) {
      stars[i].draw()
    }
  }

/****************************
  EVENT LISTENERS
*****************************/

  window.addEventListener("resize", _.debounce(init, 50))

  var starSlider = document.querySelector('#star-slider')
  var colorDropdown = document.querySelector('select[name="color"]')
  var zoomSlider = document.querySelector('#zoom-slider')
  
  starSlider.onchange = _.debounce(starSliderChanged, 50)
  starSlider.oninput = _.debounce(starSliderChanged, 50)
  colorDropdown.onchange = colorChanged
  zoomSlider.onchange = zoomSliderChanged
  zoomSlider.oninput = zoomSliderChanged

  function starSliderChanged() {
    starNum = starSlider.value
    init() 
  }

  function colorChanged() {
    switch (colorDropdown.value) {
      case 'white':
        starColor = STARS_WHITE
        break;
      case 'red':
        starColor = STARS_RED
        break;
      case 'blue':
        starColor = STARS_BLUE
        break;
      case 'purple':
        starColor = STARS_PURPLE
        break;
      case 'multi':
        starColor = STARS_MULTI
        break;
    }
  }

  function zoomSliderChanged() {
    var minp = zoomSlider.min;
    var maxp = zoomSlider.max;
    var minv = Math.log(MIN_ZOOM);
    var maxv = Math.log(MAX_ZOOM);
    var scale = (maxv-minv) / (maxp-minp);
    zoom = Math.exp(minv + scale*(zoomSlider.value-minp));
  }
})