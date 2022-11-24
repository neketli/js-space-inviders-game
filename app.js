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

  fire(dy) {
    return new Shot(this.x + 20, this.y + 20, dy);
  }

  isHitBy(shot) {
    const between = (x, a, b) => x >= a && x <= b;
    return (
      this.active &&
      between(shot.x, this.x, this.x + 40) &&
      between(shot.y + 10, this.y, this.y + 20)
    );
  }
}

class Shot {
  constructor(x, y, dy) {
    this.x = x;
    this.y = y;
    this.dy = dy;
  }

  move() {
    this.y += this.dy;
    return this.y > 0 && this.y < 700;
  }

  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x - 1, this.y, 5, 20);
  }
}

const ctx = document.getElementById("canvas").getContext("2d");
const hero = new GameObject(220, 650, document.getElementById("hero"));
const enemies = [];
let heroShot, enemyShot;
let enemyDx = 3;
let enemyDy = 1;
const heroDx = 10;

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
  enemyShot && enemyShot.draw(ctx);
  heroShot && heroShot.draw(ctx);
}

function move() {
  let leftX = enemies[0].x,
    rightX = enemies[enemies.length - 1].x;
  if (leftX <= 20 || rightX >= 430) {
    enemyDx *= -1;
  }
  enemies.forEach((enemy) => enemy.move(enemyDx, enemyDy));
  if (enemyShot && !enemyShot.move()) {
    enemyShot = null;
  }
  if (!enemyShot) {
    // Если никто из врагов не стреляет
    // выбираем одного и заставляем выстрелить
    const active = enemies.filter((enemy) => enemy.active);
    enemyShot = active[Math.floor(Math.random() * active.length)].fire(20);
  }
  if (heroShot && heroShot.move()) {
    heroShot = null;
  }
}

function game() {
  move();
  draw();
}

function start() {
  init();
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && hero.x > 20) {
      hero.move(-heroDx, 0);
    }
    if (event.key === "ArrowRight" && hero.x < 430) {
      hero.move(heroDx, 0);
    }
  });
  const interval = setInterval(game, 50);
}

window.onload = start;
