let garden = [];
let inventory = {
  seeds: { basic: 3, rare: 0, epic: 0 },
  water: 10,
  flowers: { basic: 0, rare: 0, epic: 0, mutated: 0 },
  money: 10,
  upgrades: { waterCapacity: 1 }
};
let selectedTool = "basicSeed";
let selectedShopTab = "buy";
let gameTime = 0;
let shopOpen = false;
let day = 1;
let season = "Primavera";
const seasons = ["Primavera", "Verao", "Outono", "Inverno"];
let gameState = "intro";
let introIndex = 0;
let introFade = 0;
let showMessage = false;
let message = "";
let messageTimer = 0;
let particles = [];
let crows = [];
let crowSpawnTimer = 0;
const CROW_SPAWN_RATE = 0.0001;
const skyColors = {
  Primavera: [173, 216, 230],
  Verao: [135, 206, 235],
  Outono: [252, 212, 164],
  Inverno: [224, 255, 255]
};

function setup() {
  createCanvas(800, 700);
  resetGarden();
  textSize(16);
  noStroke();
}

function draw() {
  drawSkyGradient();
  if (gameState === "intro") drawIntro();
  else {
    updateGame();
    drawGame();
  }
}

function drawSkyGradient() {
  const [r, g, b] = skyColors[season];
  for (let y = 0; y < height; y++) {
    const inter = map(y, 0, height, 0, 1);
    const c1 = color(r, g, b);
    const c2 = color(r * 0.7, g * 0.7, b * 0.7);
    fill(lerpColor(c1, c2, inter));
    rect(0, y, width, 1);
  }
  fill(season === "Inverno" ? color(240, 240, 255) : color(255, 255, 150));
  ellipse(100, 100, 80, 80);
  fill(season === "Inverno" ? color(200, 230, 255) : color(50, 120, 50));
  beginShape();
  vertex(0, height - 100);
  for (let x = 0; x <= width; x += 50) {
    const y = height - 100 + sin(x * 0.01 + frameCount * 0.01) * 20;
    vertex(x, y);
  }
  vertex(width, height - 100);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function resetGarden() {
  garden = [];
  for (let i = 0; i < 5; i++) {
    garden[i] = [];
    for (let j = 0; j < 5; j++) resetPlot(i, j);
  }
}

function resetPlot(i, j) {
  garden[i][j] = {
    hasPlant: false,
    growth: 0,
    water: 0,
    color: [0, 0, 0],
    type: null,
    isMutated: false,
    harvestValue: 0,
    growthRate: 1
  };
}

function updateGame() {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const p = garden[i][j];
      if (p.hasPlant && p.growth < 100 && p.water > 0) {
        p.growth += 0.05 * p.growthRate;
        p.water -= 0.01;
        if (p.growth >= 100 && p.harvestValue === 0) {
          p.harvestValue = floor(p.type.value * (p.isMutated ? 3 : 1) * random(0.8, 1.2));
        }
      }
    }
  }
  updateCrows();
  if (showMessage) {
    messageTimer--;
    if (messageTimer <= 0) showMessage = false;
  }
  updateParticles();
  gameTime++;
  if (gameTime % 1000 === 0) {
    day++;
    if (day % 30 === 0) {
      const currentSeasonIndex = seasons.indexOf(season);
      season = seasons[(currentSeasonIndex + 1) % seasons.length];
    }
  }
}

function updateCrows() {
  if (random() < CROW_SPAWN_RATE && crows.length < 3) spawnCrow();
  for (let crow of crows) {
    crow.x += crow.speed;
    if (crow.x > width - 50 || crow.x < 50) crow.speed *= -1;
  }
}

function spawnCrow() {
  crows.push({
    x: random(50, width - 50),
    y: random(50, 200),
    size: 40,
    speed: random(0.5, 1.5) * (random() > 0.5 ? 1 : -1),
    frame: 0
  });
}
