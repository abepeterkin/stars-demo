const canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let width
let height
let center

const MIN_ZOOM = 0.1
const MAX_ZOOM = 10
const DEFAULT_ZOOM = 0.2
const STAR_ACC = 1.01
const MIN_RADIUS = 1
const MAX_RADIUS = 3

const stars = []

let starNum = 200
let zoom = DEFAULT_ZOOM

const STARS_RED = 'STARS_RED'
const STARS_BLUE = 'STARS_BLUE'
const STARS_PURPLE = 'STARS_PURPLE'
const STARS_WHITE = 'STARS_WHITE'
const STARS_MULTI = 'STARS_MULTI'

let colorTiedToRadius = true

let starColor = STARS_MULTI

class Star {
  constructor(id) {
    this.id = id
    this.reset()
  }

  reset() {
    this.x = Math.random() * width
    this.y = Math.random() * height
    const vAngle = Math.atan2(this.y - center.y, this.x - center.x)
    const vMagnitude = (Math.random()) + 1
    this.vx = vMagnitude * Math.cos(vAngle)
    this.vy = vMagnitude * Math.sin(vAngle)

    const radiusRand = Math.random()
    this.radius = (radiusRand * (MAX_RADIUS - MIN_RADIUS)) + MIN_RADIUS
    this.opacity = 0
    
    let colorRand
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
        const colorChoice = Math.random() * 3
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

setInterval(() => {
  update()
  draw()
}, 25)

function createStars() {
  for (var i = 0; i < starNum; i++) {
    stars[i] = new Star(i)
  }
}

function init() {
  console.log('resize')
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