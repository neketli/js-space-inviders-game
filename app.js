class GameObject {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.active = true;
  }

  draw(ctx) {
    this.active && ctx.drawImage(this.img, this.x, this.y, 40, 40);
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
      between(shot.x, this.x, this.x + 50) &&
      between(shot.y + 10, this.y, this.y + 30)
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
    return this.y > 0 && this.y < 500;
  }

  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x - 1, this.y, 5, 20);
  }
}

const ctx = document.getElementById("canvas").getContext("2d");
const hero = new GameObject(220, 450, document.getElementById("hero"));
let enemies = [];
let heroShot, enemyShot;
let enemyDx = 3;
let enemyDy = 0.3;
const heroDx = 10;
const interval = setInterval(game, 50);
let score = 0;

// Leaderboard logic

function initLeaderboard(user = null) {
  const tableBody = document.getElementById("tableBody");

  const LEADERS = [
    {
      name: "Player 1",
      score: 101,
    },
    {
      name: "hi",
      score: 69,
    },
    {
      name: "Leon from brawl stars",
      score: 37,
    },
    {
      name: "null",
      score: 14,
    },
    {
      name: "skeleton",
      score: 5,
    },
  ];

  const appendTableRow = (item) => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    name.innerText = item.name;
    const value = document.createElement("td");
    value.innerText = item.score;
    row.appendChild(name);
    row.appendChild(value);
    tableBody.appendChild(row);
  };

  let leaderboardData = JSON.parse(localStorage.getItem("leaderboard"));
  if (!leaderboardData) {
    leaderboardData = LEADERS;
  }

  if (!!user) {
    leaderboardData = leaderboardData.filter((item) => item.name !== user.name);
    leaderboardData = [...leaderboardData, user];
  }
  leaderboardData = leaderboardData.sort((a, b) => b.balance - a.balance);
  leaderboardData = leaderboardData.slice(0, 5);

  // Clear table
  if (tableBody.rows) {
    const len = tableBody.rows.length;
    for (var i = 0; i < len; i++) {
      tableBody.deleteRow(0);
    }
  }
  leaderboardData.forEach((item) => appendTableRow(item));
  localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));
}

function init() {
  const image = document.getElementById("enemy");
  enemies = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 7; j++) {
      enemies.push(new GameObject(40 + j * 60, 20 + i * 60, image));
    }
  }
}

function draw() {
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, 500, 500);
  enemies.forEach((enemy) => enemy.draw(ctx));
  hero.draw(ctx);
  enemyShot && enemyShot.draw(ctx);
  heroShot && heroShot.draw(ctx);
}

async function move() {
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
    await new Promise((resolve) =>
      setTimeout(resolve, parseInt(Math.random() * 1000))
    );
  }
  if (heroShot) {
    const hit = enemies.find((enemy) => enemy.isHitBy(heroShot));
    if (hit) {
      hit.active = false;
      heroShot = null;
      score++;
      if (!enemies.filter((enemy) => enemy.active).length) {
        init();
        enemyDy += 0.1;
        enemyDx += 0.1;
      }
    } else if (!heroShot.move()) {
      heroShot = null;
    }
  }
}

function isGameOver() {
  return (
    hero.isHitBy(enemyShot) ||
    enemies.find((enemy) => enemy.active && enemy.y > 500)
  );
}

function game() {
  move();
  draw();

  // if (isGameOver()) {
  //   alert(`Game over\nYour score is: ${score}`);
  //   clearInterval(interval);
  // }
}

function start() {
  init();
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "user",
    score: 0,
  };
  initLeaderboard(user);
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && hero.x > 20) {
      hero.move(-heroDx, 0);
    }
    if (event.key === "ArrowRight" && hero.x < 430) {
      hero.move(heroDx, 0);
    }
    if (event.key === " " && !heroShot) {
      heroShot = hero.fire(-30);
    }
  });
}

window.onload = start;
