class GameObject {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.active = true;
  }

  draw(ctx) {
    this.active && ctx.drawImage(this.img, this.x, this.y, 50, 50);
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}

const ctx = document.getElementById("canvas").getContext("2d");
const hero = new GameObject(220, 650, document.getElementById("hero"));
const enemies = [];

function init() {
  const image = document.getElementById("enemy");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 7; j++) {
      enemies.push(new GameObject(40 + j * 60, 30 + i * 60, image));
    }
  }
}

function draw() {
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, 500, 750);
  enemies.forEach((enemy) => enemy.draw(ctx));
  hero.draw(ctx);
}

function move() {}

function game() {
  move();
  draw();
}

function start() {
  init();
  document.addEventListener("keydown", (event) => {});
  const interval = setInterval(game, 50);
}

window.onload = start;
