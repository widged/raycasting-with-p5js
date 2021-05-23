const level= [2,2,2,2,2,2,2,2,2,2,
              2,0,0,0,0,0,0,0,0,2,
              2,0,1,1,0,0,1,1,0,2,
              2,0,1,1,0,0,0,1,0,2,
              2,0,1,0,0,0,0,0,0,2,
              2,0,1,0,0,0,0,0,0,2,
              2,0,1,1,0,0,0,1,0,2,
              2,0,1,1,0,0,1,1,0,2,
              2,0,0,0,0,0,0,0,0,2,
              2,2,2,2,2,2,2,2,2,2,]

const mapSize = 10
const blockSize = 20
const mapWidth = mapSize * blockSize
const playerWidth = 5

let playerPosition;
const moveSpeed = 2

function setup() {
  mapDim = mapSize*blockSize
  threeDim = 1000
  colorMode(HSB, 255);
  createCanvas(mapDim+1000, mapDim+1000);
  playerPosition = createVector(width / 2, height / 2)
}

// <<< Map ---
function drawMap(level, mapSize, blockWidth) {
  for (i = 0; i<mapSize; i+=1){
    for (j = 0; j<mapSize; j+=1){
      if (mapToLevel(i,j)== 0){
        stroke(0,93)
        fill(250)
      }else{
        fill(0)
      }
      rect(i*blockWidth, j*blockWidth, blockWidth,blockWidth)
    }
  }
}

function isItPossibleToWalkThere(x,y) {
  const {i,j} = pixelToMap(x,y)
  return (mapToLevel(i,j) == 0) ? true : false
}

function pixelToMap(x,y) {
  return {i: floor(x/blockSize), j: floor(y/blockSize)}
}
function mapToLevel(i, j){  
  return level[i+j*mapSize]
}
// --- Map >>>

// <<< Player ---
function drawPlayer(pt, radius = 15) {
  noStroke()
  fill("red")
  circle(pt.x, pt.y, radius)
}

function movePlayerToPosition(x,y) {
  if (isItPossibleToWalkThere(x,y)) {
    playerPosition.x = x
    playerPosition.y = y
  }
}
// --- Player >>>

// <<< FOV ---
function drawFOV(from, to) {
  stroke('red')
  const maxLength = 250
  let rays = []

  let direction = createVector(to.x-from.x, to.y-from.y)
  direction.normalize()

  for (i=-30; i<30; i++){
    let ray = direction.copy()
    ray.rotate(radians(i))
    const [s1,s2] = [from.x, from.y]
    let [e1,e2] = [s1,s2]
    let rl
    for(rl = 0; rl <= maxLength; rl++) {
      [e1, e2] = [from.x+ray.x*rl, from.y+ray.y*rl]
      if(!isItPossibleToWalkThere(e1, e2)) { break}
    }
    const rr = 1 - (rl / maxLength)
    rays.push([rr, [s1,s2, e1,e2]])  
    line(s1,s2, e1,e2)
  }
  return rays
}
// --- FOV >>>

  const pixelWidth = 50;

// <<< FOV ---
function draw3D(rays) {
  const sceneW = 500
  const sceneH = 300
  const scenes = [...rays]
  const w = sceneW / scenes.length
  const [o1,o2] = [250, 0]
  for(let i = 0; i < scenes.length; i++) {
    const rl = scenes[i][0]
    const h = sceneH*Math.pow(rl,2)
    fill(color(150, 126*rl, 255*rl))
    stroke(color(150, 126*rl+30, 255*rl))
    rect(o1+(i * w), sceneH-(h/2), w+1, h)
  }

  
  // DRAW 3D
}  
// --- FOV >>>

function movementFromArrows() {
  let x = 0; y = 0;
  if(keyIsDown(LEFT_ARROW)){
    x -= 1
  }
  if(keyIsDown(RIGHT_ARROW)){
    x += 1
  }
  if(keyIsDown(UP_ARROW)){
    y -= 1
  }
  if(keyIsDown(DOWN_ARROW)){
    y += 1
  }
  return [x, y]
}


function draw() {

  background(220);

  drawMap(level, mapSize, blockSize);
  drawPlayer(playerPosition, playerWidth)
  const rays = drawFOV(playerPosition, {x: mouseX, y:mouseY})
  draw3D(rays, playerPosition);
  // --- interactivité --------------------------- 
  if (mouseIsPressed){
    movePlayerToPosition(mouseX, mouseY)
  } else {
    let [x,y] = movementFromArrows()
    movePlayerToPosition(
      playerPosition.x + x*moveSpeed, 
      playerPosition.y + y*moveSpeed
    )
  }
}


