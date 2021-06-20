function DrawVerticalLine(x, startingY, bottomY, color) {
  // draw
  for (let y = startingY > 0 ? startingY : 0; y < bottomY; y++)
    set(x, y, color)
}


function CalculateLinePoints(player, z) {
  let sinPlayerRot = Math.sin(player.rotation)
  let cosPlayerRot = Math.cos(player.rotation)

  let A = [
    (-cosPlayerRot*z - sinPlayerRot*z) + player.x,
    ( sinPlayerRot*z - cosPlayerRot*z) + player.y]
  
    let B = [
      ( cosPlayerRot*z - sinPlayerRot*z) + player.x,
      (-sinPlayerRot*z - cosPlayerRot*z) + player.y]
  
  return [A, B]
}


function CreateYBuffer(screenHeight, screenWidth) {

  let buffer = Array(screenWidth)
  for (let i = 0; i < screenWidth; i++)
    buffer[i] = screenHeight
  return buffer
}


function CalculateNextLinePoint(A, B, screenWidth) {

  const dx = (B[0] - A[0]) / screenWidth
  const dy = (B[1] - A[1]) / screenWidth

  return [A[0] + dx, A[1] + dy]
}

function Render(player, scaleHeight, horizon, distance, screenWidth, screenHeight, height, gameMap, colorMap, skyColor, LODFalloff = 0.1, initialLOD = 1, applyFog = false) {

  // prepare y buffer
  let yBuffer = CreateYBuffer(screenHeight, screenWidth)
  
  // draw from front to back
  let dz = initialLOD
  let z = 1

  while (z < distance) {
    // Points describing a line from A to B
    let [A, B] = CalculateLinePoints(player, z)
    
    // raster line
    for (let x = 0; x < screenWidth; x++) {

      let currHeightMapVal = MapGetAt(Math.trunc(A[0]), Math.trunc(A[1]), gameMap)
      let fog = map(z, 1, distance, 0, 255)
      let rawColorValue = SafeIndex2D(Math.trunc(A[0]), Math.trunc(A[1]), colorMap, color(0, 100, 255))

      let fogFalloff = Cap(fog * fog * 0.0001, 1, 0)

      let r = Cap(red(rawColorValue) + skyColor[0] * fogFalloff, 255)
      let g = Cap(green(rawColorValue) + skyColor[1] * fogFalloff, 255)
      let b = Cap(blue(rawColorValue) + skyColor[2] * fogFalloff, 255)

      let col = applyFog ? color(r, g, b) : rawColorValue

      const lineHeight = (height - currHeightMapVal) / z * scaleHeight + horizon

      DrawVerticalLine(x, lineHeight, yBuffer[x], col)

      if (lineHeight < yBuffer[x])
        yBuffer[x] = lineHeight

      A = CalculateNextLinePoint(A, B, screenWidth)

    }

    z += dz
    dz *= LODFalloff
  }
}