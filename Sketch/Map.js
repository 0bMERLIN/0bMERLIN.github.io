////////////////////// DRAWING //////////////////////
function DrawLine(len, x, y, rot) {

  let sinRot = sin(rot)
  let cosRot = cos(rot)

  for (let n = 0; n < len; n++)
    set(x + sinRot * n, y + cosRot * n, color(255, 0, 0))
}



function DrawMinimap(miniMapX, miniMapY, playerX, playerY, playerRot, drawDist, miniMap) {


  for (let py = playerY; py < playerY + drawDist; py++) {
    for (let px = playerX; px < playerX + drawDist; px++) {
      let x = Math.trunc(px - drawDist / 2)
      let y = Math.trunc(py - drawDist / 2)

      if (dist(drawDist / 2, drawDist / 2, px - playerX, py - playerY) < drawDist / 2)
        set(px - playerX - -miniMapX, py - playerY + -miniMapY, MapGetAt(x, y, miniMap))
    }
  }

  // draw player
  set(miniMapX + drawDist / 2, miniMapY + drawDist / 2, color(255, 0, 0))
}


////////////////////// INDEXING //////////////////////
function SafeIndex2D(x, y, a, def=null) {

  let yv = a[y]
  if (yv !== undefined) {

    xv = yv[x]
    return (xv !== undefined) ? xv : def
  }
  return def
}


function MapGetAt(x, y, gameMap) {
  return SafeIndex2D(x, y, gameMap, 10)
}


////////////////////// MAP GENERATION //////////////////////
function GenerateMap(width, height,scale=1) {
  let m = []
  for (let y = 0; y < height; y++) {
    let l = []
    for (let x = 0; x < width; x++)
      l.push(
        255 - map(noise(x*scale, y*scale),
        0.0, .5, 0, 255))
    m.push(l)
  }
  return m
}


function Cap(x, max, min=0) {
  if (x > max) return max
  if (x < min) return min
  return x
}


function GenerateColorMap(width, height,scale=1, heightMap, snowHeight=100) {

  let m = []
  for (let y = 0; y < height; y++) {
    let l = []
    for (let x = 0; x < width; x++) {
      let hValue = SafeIndex2D(x, y, heightMap, 0)
      
      if (hValue < snowHeight) {
        l.push(color(Cap(hValue, 50), (255 - hValue) / 4, 0))
      }
      else {
        l.push(color(200, 200, 240))
      }
    }
    m.push(l)
  }
  return m
}



////////////////////// LOADING //////////////////////
function ImageTo2DArray(img) {

  let acc = []
  for (let y = 0; y < img.height; y++) {
    let line = []
    for (let x = 0; x < img.width; x++) {
      line.push(img.get(x, y))
    }
    acc.push(line)
  }
  return acc
}



function Array2DToImage(arr) {

  let img = createImage(arr[0].length, arr.length)
  img.loadPixels()

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      img.set(x, y, arr[y][x])
    }
  }

  img.updatePixels()

  return img
}


function Map2DArray(f, arr) {

  let acc = []
  let lIdx = 0
  for (l of arr) {
    let line = []
    let idx = 0
    for (x of l) {
      line.push(f(x, lIdx, idx))
      idx++
    }
    acc.push(line)
    lIdx++
  }
  return acc
}



function ToGrayscale(p) {

  // assuming r = g = b
  return green(p)
}