/** 
This is a snake game I made with Vanilla Javascript.
Follow me on twitter @fariatondo
**/

let dom_replay = document.querySelector("#replay");
let player = document.querySelector("#player");
let start = document.querySelector("#start");
let dom_score1 = document.querySelector("#score1");
let dom_score2 = document.querySelector("#score2");
let dom_score3 = document.querySelector("#score3");
let dom_score4 = document.querySelector("#score4");
let dom_canvas = document.createElement("canvas");
document.querySelector("#canvas").appendChild(dom_canvas);
let CTX = dom_canvas.getContext("2d");
////////////
const W = (dom_canvas.width = 500);
const H = (dom_canvas.height = 500);

let snakes = [],
  food,
  currentHue,
  cells = 50,
  cellSize,
  isGameOver = false,
  tails = [],
  score = 00,
  maxScore = window.localStorage.getItem("maxScore") || undefined,
  particles = [],
  splashingParticleCount = 20,
  cellsCount,
  requestID;

  let snake2;

let helpers = {
  Vec: class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    mult(v) {
      if (v instanceof helpers.Vec) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
      } else {
        this.x *= v;
        this.y *= v;
        return this;
      }
    }
  },
  isCollision(v1, v2) {
    return v1.x == v2.x && v1.y == v2.y;
  },
  garbageCollector() {
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].size <= 0) {
        particles.splice(i, 1);
      }
    }
  },
  drawGrid() {
    CTX.lineWidth = 1;
    CTX.strokeStyle = "#00000000";
    CTX.shadowBlur = 0;
    for (let i = 1; i < cells; i++) {
      let f = (W / cells) * i;
      CTX.beginPath();
      CTX.moveTo(f, 0);
      CTX.lineTo(f, H);
      CTX.stroke();
      CTX.beginPath();
      CTX.moveTo(0, f);
      CTX.lineTo(W, f);
      CTX.stroke();
      CTX.closePath();
    }
  },
  randHue() {
    return ~~(Math.random() * 360);
  },
  hsl2rgb(hue, saturation, lightness) {
    if (hue == undefined) {
      return [0, 0, 0];
    }
    var chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    var huePrime = hue / 60;
    var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

    huePrime = ~~huePrime;
    var red;
    var green;
    var blue;

    if (huePrime === 0) {
      red = chroma;
      green = secondComponent;
      blue = 0;
    } else if (huePrime === 1) {
      red = secondComponent;
      green = chroma;
      blue = 0;
    } else if (huePrime === 2) {
      red = 0;
      green = chroma;
      blue = secondComponent;
    } else if (huePrime === 3) {
      red = 0;
      green = secondComponent;
      blue = chroma;
    } else if (huePrime === 4) {
      red = secondComponent;
      green = 0;
      blue = chroma;
    } else if (huePrime === 5) {
      red = chroma;
      green = 0;
      blue = secondComponent;
    }

    var lightnessAdjustment = lightness - chroma / 2;
    red += lightnessAdjustment;
    green += lightnessAdjustment;
    blue += lightnessAdjustment;

    return [
      Math.round(red * 255),
      Math.round(green * 255),
      Math.round(blue * 255)
    ];
  },
  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }
};

// Modificar el objeto KEY para almacenar la dirección de movimiento para cada serpiente
let KEY = {
  ArrowUp: [false, false, false, false], // Cada posición representa una serpiente (0: Snake1, 1: Snake2, 2: Snake3, 3: Snake4)
  ArrowRight: [false, false, false, false],
  ArrowDown: [false, false, false, false],
  ArrowLeft: [false, false, false, false],
  resetState() {
    this.ArrowUp = [false, false, false, false];
    this.ArrowRight = [false, false, false, false];
    this.ArrowDown = [false, false, false, false];
    this.ArrowLeft = [false, false, false, false];
  },
  listen() {
    addEventListener("keydown", (e) => {
      // Implementar la lógica para actualizar la dirección de movimiento de la serpiente deseada
      if (e.key === "ArrowUp") {
        //this.resetState();
        //this.ArrowUp[snakeIndex] = true;
        sendMove('up')
      } else if (e.key === "ArrowRight") {
        //this.resetState();
        //this.ArrowRight[snakeIndex] = true;
        sendMove('right')
      } else if (e.key === "ArrowDown") {
        //this.resetState();
        //this.ArrowDown[snakeIndex] = true;
        sendMove('down')
      } else if (e.key === "ArrowLeft") {
        //this.resetState();
        //this.ArrowLeft[snakeIndex] = true;
        sendMove('left')
      }
    }, false);
  }
};

// Agregar una función controlarMove para actualizar la dirección de la serpiente deseada
function controlarMove(direction, snakeIndex) {
   // Restablecer todas las direcciones a falso
   for (const key in KEY) {
    KEY[key][snakeIndex] = false;
  }
  if (direction === "up") {
    KEY.ArrowUp[snakeIndex] = true;
  } else if (direction === "right") {
    KEY.ArrowRight[snakeIndex] = true;
  } else if (direction === "down") {
    KEY.ArrowDown[snakeIndex] = true;
  } else if (direction === "left") {
    KEY.ArrowLeft[snakeIndex] = true;
  }
}

class Snake {
  constructor(i, type) {
    this.pos = new helpers.Vec(W / 1, H / 1);
    this.startPos=new helpers.Vec(W / 2, H / 2);
    this.dir = new helpers.Vec(0, 0);
    this.type = type;
    this.index = i;
    this.delay = 5;
    this.size = W / cells;
    //this.color = `hsl(${helpers.randHue()}, 100%, 50%)`; // Random color
    this.color = this.getSnakeColor(type);
    this.history = [];
    this.total = 1;
    this.score = 0;
    this.canMove = true; // Add a flag to determine if the snake can move or not

  }
  
  getSnakeColor(type) {
    switch (type) {
      case "snake1":
        return "blue";
      case "snake2":
        return "green";
      case "snake3":
        return "red";
      case "snake4":
        return "yellow";
      default:
        return "red";
    }
  }

  
  draw() {
    let { x, y } = this.pos;
    CTX.fillStyle = this.color;
    CTX.shadowBlur = 20;
    CTX.shadowColor = this.color;
    CTX.fillRect(x, y, this.size, this.size);
    CTX.shadowBlur = 0;
    if (this.total >= 2) {
      for (let i = 0; i < this.history.length - 1; i++) {
        let { x, y } = this.history[i];
        CTX.lineWidth = 1;
        CTX.fillStyle = this.color; //tail color
        CTX.fillRect(x, y, this.size, this.size);
      }
    }
  }
  walls() {
    let { x, y } = this.pos;
    if (x + cellSize > W) {
      this.pos.x = 0;
    }
    if (y + cellSize > W) {
      this.pos.y = 0;
    }
    if (y < 0) {
      this.pos.y = H - cellSize;
    }
    if (x < 0) {
      this.pos.x = W - cellSize;
    }
  }
  controlls() {
    let dir = this.size;
  if (KEY.ArrowUp[this.index]) {
    this.dir = new helpers.Vec(0, -dir);
  }
  if (KEY.ArrowDown[this.index]) {
    this.dir = new helpers.Vec(0, dir);
  }
  if (KEY.ArrowLeft[this.index]) {
    this.dir = new helpers.Vec(-dir, 0);
  }
  if (KEY.ArrowRight[this.index]) {
    this.dir = new helpers.Vec(dir, 0);
  }
  }
  selfCollision() {
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      if (helpers.isCollision(this.pos, p)) {
        //isGameOver = true;
        console.log(1);
        const hitSnake = this;
        hitSnake.score--; // Decrement score for the hit snake
        particleSplash(this.pos,this.color)
        this.restart(); // Restart this snake

        return;
      }
    }

    // Check collision with other snakes
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      for (const snake of snakes) {
        if (snake === this) continue; // Skip self-check
        for (let j = 0; j < snake.history.length; j++) {
          let path = snake.history[j];
          if (helpers.isCollision(p, path)) {
            const hitterSnake = snake;
            const hitSnake = this;
            hitSnake.score--; // Decrement score for the hit snake
            //isGameOver = true;
            console.error(`Hitter Snake:`, hitterSnake);
            console.error(`Hit Snake:`, hitSnake);
            particleSplash(this.pos,this.color)
            this.restart(); // Restart this snake
            return;
          }
        }
      }
    }
  
  }
  restart() {
    // Move the snake back to its starting position and reset its direction
    this.pos = getIndex(this.index);
    this.dir = new helpers.Vec(0, 0);
    this.total = 1;
    this.history = [];
    this.canMove = false; // Set the flag to false, so the snake won't move until a new arrow key is pressed
    KEY.resetState();

  }
  
  update() {
    this.walls();
    this.draw();
    this.controlls();
    if (!this.delay--) {
      if (helpers.isCollision(this.pos, food.pos)) {
        this.score++;

        incrementScore();
        particleSplash();
        food.spawn();
        this.total++;

      }
      this.history[this.total - 1] = new helpers.Vec(this.pos.x, this.pos.y);
      for (let i = 0; i < this.total - 1; i++) {
        this.history[i] = this.history[i + 1];
      }
      console.log(6666);
      //if (this.canMove) {
       //setTimeout(() => {
         // Only update the snake's position if it can move
         this.pos.add(this.dir);
         this.delay = 5;
         this.total > 3 ? this.selfCollision() : null;
       //}, 1000);
      //}
    }
    
     
    
  }

  static createSnakes(count) {
    for (let i = 0; i < count; i++) {
      const snake = new Snake(i);
      snakes.push(snake);
    }
  }

  static drawAll() {
    for (const snake of snakes) {
      snake.draw();
    }
  }

  static updateAll() {
    for (const snake of snakes) {
      snake.update();
    }
  }

  static handleCollisions() {
    for (const snake of snakes) {
      //snake.selfCollision();
    }
  }

}

class Food {
  constructor() {
    this.pos = new helpers.Vec(
      ~~(Math.random() * cells) * cellSize,
      ~~(Math.random() * cells) * cellSize
    );
    this.color = currentHue = 'white';
    this.size = cellSize;
    this.img = new Image();
    this.img.src = imgSrc;
    
  }
  draw() {
    let { x, y } = this.pos;
    let radius = this.size / 2;
    let centerX = x + radius;
    let centerY = y + radius;

    CTX.globalCompositeOperation = "lighter";
    CTX.shadowBlur = 20;
    CTX.shadowColor = this.color;
    CTX.fillStyle = this.color;
    CTX.beginPath();
    CTX.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    CTX.fill();
    CTX.closePath();
    CTX.globalCompositeOperation = "source-over";
    CTX.shadowBlur = 0;

    CTX.save();
    CTX.beginPath();
    CTX.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    CTX.clip();
    CTX.drawImage(this.img, x, y, this.size, this.size);
    CTX.closePath();
    CTX.restore();
  }
 
  spawn() {
    let randX = ~~(Math.random() * cells) * this.size;
    let randY = ~~(Math.random() * cells) * this.size;

    // Check for collisions with all snakes' histories
   /* for (const snake of snakes) {
      for (let path of snake.history) {
        if (helpers.isCollision(new helpers.Vec(randX, randY), path)) {
          return this.spawn();
        }
      }
    }*/

    this.color = currentHue= this.getFoodColor();
    this.pos = new helpers.Vec(randX, randY);

  }
  getFoodColor() {
    // You can add logic here to set the color based on the snake type
    return snakes[0] ? /*snakes[0].color*/ 'white' : "white"; // Assuming Snake1 is always present
  }
}
let imgSrc = './img/food.png';

class Particle {
  constructor(pos, color, size, vel) {
    this.pos = pos;
    this.color = color;
    this.size = Math.abs(size / 2);
    this.ttl = 0;
    this.gravity = -0.2;
    this.vel = vel;
  }
  draw() {
    let { x, y } = this.pos;
    let hsl = '#00000000'
      .split("")
      .filter((l) => l.match(/[^hsl()$% ]/g))
      .join("")
      .split(",")
      .map((n) => +n);
    let [r, g, b] = helpers.hsl2rgb(hsl[0], hsl[1] / 100, hsl[2] / 100);
    CTX.shadowColor = `rgb(${r},${g},${b},${1})`;
    CTX.shadowBlur = 0;
    CTX.globalCompositeOperation = "lighter";
    CTX.fillStyle = this.color; //particles color
    CTX.fillRect(x, y, this.size+4, this.size+4);
    CTX.globalCompositeOperation = "source-over";

    // Draw the image at the position of the collision
    // const image = new Image();
    // image.onload = () => {
    //   CTX.drawImage(image, x, y, this.size, this.size);
    // };
    // image.src = imgPath;
  }
  update() {
    this.draw();
    this.size -= 0.3;
    this.ttl += 1;
    this.pos.add(this.vel);
    this.vel.y -= this.gravity;
  }
}

function incrementScore() {
  //score++;
  dom_score1.innerHTML ='';
  for (const snake of snakes) {
    dom_score1.innerHTML += `<span>${snake.type} Score: ${snake.score}</span>`;

  }
}

function particleSplash(pos=0,cl = 0) {
  for (let i = 0; i < splashingParticleCount; i++) {
    let vel = new helpers.Vec(Math.random() * 6 - 3, Math.random() * 6 - 3);
    let position = pos ==0 ?new helpers.Vec(food.pos.x, food.pos.y):pos;
    let color = cl == 0? 'white': cl;
    particles.push(new Particle(position, color, food.size, vel));
  }
}

function clear() {
  CTX.clearRect(0, 0, W, H);
}

function initialize() {
  CTX.imageSmoothingEnabled = false;
  KEY.listen();
  cellsCount = cells * cells;
  cellSize = W / cells;
  //Snake.createSnakes(1); // Create one initial snake
 // handleNewPlayer();

  food = new Food();
  dom_replay.addEventListener("click", reset, false);
  loop();

}

// Llamar a Snake.updateAll() para actualizar las direcciones de todas las serpientes
function loop() {
  clear();
  if (!isGameOver) {
    requestID = setTimeout(loop, 1000 / 60);
    helpers.drawGrid();

    // Actualizar direcciones de las serpientes antes de actualizar su posición
    for (let i = 0; i < snakes.length; i++) {
      let snake = snakes[i];
      if (KEY.ArrowUp[i]) {
        snake.dir = new helpers.Vec(0, -snake.size);
      } else if (KEY.ArrowRight[i]) {
        snake.dir = new helpers.Vec(snake.size, 0);
      } else if (KEY.ArrowDown[i]) {
        snake.dir = new helpers.Vec(0, snake.size);
      } else if (KEY.ArrowLeft[i]) {
        snake.dir = new helpers.Vec(-snake.size, 0);
      }
    }

    Snake.updateAll();
    Snake.drawAll();
    food.draw();
    for (let p of particles) {
      p.update();
    }
    helpers.garbageCollector();
    Snake.handleCollisions();
  } else {
    clear();
    gameOver();
  }}

function gameOver() {
  maxScore ? null : (maxScore = score);
  score > maxScore ? (maxScore = score) : null;
  window.localStorage.setItem("maxScore", maxScore);
  CTX.fillStyle = "#4cffd7";
  CTX.textAlign = "center";
  CTX.font = "bold 30px Poppins, sans-serif";
  CTX.fillText("GAME OVER", W / 2, H / 2);
  CTX.font = "15px Poppins, sans-serif";
  CTX.fillText(`SCORE   ${score}`, W / 2, H / 2 + 60);
  CTX.fillText(`MAXSCORE   ${maxScore}`, W / 2, H / 2 + 80);
  for (const snake of snakes) {
    console.log(`Snake ${snake.type} Score: ${snake.score}`);
    snake.restart();
  }
}

function reset() {
  dom_score1.innerText = "00";
  score = "00";
  food.spawn();
  KEY.resetState();
  isGameOver = false;
  clearTimeout(requestID);
  loop();
}

function handleNewPlayer() {
  // Create a new snake for the new player max 4
  let startPos = getIndex(snakes.length)
  const newSnake = new Snake(snakes.length, `snake${snakes.length + 1}`);
  newSnake.pos = startPos;
  snakes.push(newSnake);
}
function getIndex(index){
  switch (index) {
    case 0:
      return new helpers.Vec(W / cells, H / cells);
    case 1:
      return new helpers.Vec(W - W / cells-10, H / cells);
    case 2:
      return new helpers.Vec(W / cells, H - H / cells-10);
    case 3:
      return new helpers.Vec(W - W / cells-10, H - H / cells-10);
    default:
      return;
  }
}
let num = 0;

player.onclick= function(){
  handleNewPlayer()
  num = num++ < 4? num++: 4;
  player.innerHTML = 'player '+num;
}

start.onclick= function(){
 initialize()
}
