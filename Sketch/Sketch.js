//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let ScreenWidth = 200 // 300px for maximum retro look!
let GameMap = []
let ColorMap = []
let Player = { x: 50, y: 50, rotation: 0 }
let Height = 10
let YVelocity = 0
let Horizon = 50
let PlayerHeight = 50
let TerrainScale = .1
let MinimapDrawDist = ScreenWidth / 5
let DoDrawMinimap = true
let Grounded = true
let SnowHeight = 130
let SkyColor = [20, 100, 255]
let ShowDebug = false
let PlayerSpeed = .4
let Distance = 100
let Bobbing = false

let MapNumber = 7

let ColorMapURL = `${window.location.href}/Assets/C${MapNumber}.png`
let GameMapURL = `${window.location.href}/Assets/D${MapNumber}.png`

let GameMapImg
let ColorMapImg

let LastTimeGrounded = 0


// key codes
const SPACE = 32



function preload() {


  // load the maps as images
  ColorMapImg = loadImage(ColorMapURL)
  ColorMapImg.loadPixels()

  GameMapImg = loadImage(GameMapURL)
  GameMapImg.loadPixels()
}



function setup() {
  noiseSeed(2)

  frameRate(30)
  let cnv = createCanvas(ScreenWidth, ScreenWidth)
  cnv.id("canvas")

  loadPixels()
  
  // load the maps
  let size = TerrainScale * 3000
  console.log("map size: " + size)
  ColorMapImg.resize(size, 0)
  GameMapImg.resize(size, 0)

  ColorMap = ImageTo2DArray(ColorMapImg)
  GameMap = Map2DArray(ToGrayscale, ImageTo2DArray(GameMapImg))

}


function IsCharDown(c) {
  return keyIsDown(c.charCodeAt(0) - 32)
}


function keyPressed() {
  if (key === 'm')
    DoDrawMinimap = !DoDrawMinimap
  
  if (key === '?')
    ShowDebug = !ShowDebug
}



function HandleKeys(player, playerSpeed) {

  let computedPlayerSpeed = playerSpeed

  if (keyIsDown(SHIFT))
    computedPlayerSpeed += 0.5

  let sinPlayerRot = sin(player.rotation) * computedPlayerSpeed
  let cosPlayerRot = cos(player.rotation) * computedPlayerSpeed

  if (IsCharDown('s')) {
    player.x += sinPlayerRot
    player.y += cosPlayerRot
  }

  if (IsCharDown('w')) {
    player.x -= sinPlayerRot
    player.y -= cosPlayerRot
  }

  if (IsCharDown('d')) {
    player.x += cosPlayerRot
    player.y -= sinPlayerRot
  }

  if (IsCharDown('a')) {
    player.x -= cosPlayerRot
    player.y += sinPlayerRot
  }

  if (keyIsDown(SPACE) && Grounded)
    YVelocity = -5

  if (keyIsDown(UP_ARROW)) {
    Horizon += 10
  }

  if (keyIsDown(DOWN_ARROW)) {
    Horizon -= 10
  }

  if (keyIsDown(LEFT_ARROW)) {

    player.rotation += 0.1
  }

  if (keyIsDown(RIGHT_ARROW)) {

    player.rotation -= 0.1
  }
}


function draw() {


  
  let scaleHeight = ScreenWidth/(1/TerrainScale)
  let horizon = Horizon
  let distance = Distance
  let screenWidth = ScreenWidth
  let screenHeight = screenWidth

  let playerHeight = IsCharDown('w') && Bobbing ? Math.sin(millis() / 100) * 2 + PlayerHeight : PlayerHeight
  
  let terrainHeight = MapGetAt(Math.trunc(Player.x), Math.trunc(Player.y), GameMap)

  let height = Height
  let altitudeGround = terrainHeight - height + playerHeight

  YVelocity += .3
  Height -= YVelocity

  if (altitudeGround > 0) {
    height = terrainHeight + playerHeight
    Height = height
    YVelocity = 0
    LastTimeGrounded = 0
  }
  else {
    LastTimeGrounded += deltaTime
  }

  // base Grounded value on the last time a
  // ground collision was detected to get smoothing
  Grounded = LastTimeGrounded < 100
  
  HandleKeys(Player, PlayerSpeed)
  
  // fill screen with sky color
  // doesn't kill as much performance, as i would expect.
  // possible optimisation:
  //  fill only what is left after rendering the y buffer
  //  (would have to be done in Render.js)
  for (let i = 0; i < ScreenWidth * ScreenWidth * 20 /* magic value for some reason ¯\_(ツ)_/¯ */; i += 4) {

    pixels[i] = SkyColor[0]
    pixels[i+1] = SkyColor[1]
    pixels[i+2] = SkyColor[2]
    pixels[i+3] = 255
  }

  updatePixels()


  Render(Player, scaleHeight, horizon, distance, screenWidth, screenHeight, height, GameMap, ColorMap, SkyColor, LODFalloff = 1.03, initialLOD = 0.02, applyFog = false)
  

  if (DoDrawMinimap)
    DrawMinimap(ScreenWidth - MinimapDrawDist, 0, Player.x, Player.y, Player.rotation, MinimapDrawDist, ColorMap)

  updatePixels()

  if (ShowDebug) {
    textSize(8)
    stroke(255,0,0)
    fill(255, 0, 0)
    
    text(

      'FPS: ' + Math.trunc(frameRate()) + '\n' +
      'altitude (ground): ' + int(altitudeGround) + '\n' +
      'ground level: ' + int(terrainHeight) + '\n' +
      'Grounded: ' + Grounded,

      2, 8
    )
  }
}