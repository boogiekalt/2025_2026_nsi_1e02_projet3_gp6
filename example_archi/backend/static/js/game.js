// Récupération du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas invisible pour la collision
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");

// Image masque noir/blanc
const collisionMap = new Image();
collisionMap.src = "/static/img/collision_map.png";

collisionMap.onload = () => {
    collisionCtx.drawImage(collisionMap, 0, 0);
};

function isOnRoad(x, y) {
    const pixel = collisionCtx.getImageData(x, y, 1, 1).data;

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    // NOIR = route (0,0,0)
    if (r === 0 && g === 0 && b === 0) {
        return true;
    }

    // BLANC = mur (255,255,255)
    return false;
}

// Fond
const backgroundImage = new Image();
backgroundImage.src = '/static/img/circuit_1.jpg'; // adapte si besoin

// Images de la voiture
const carUp = new Image();
carUp.src = '/static/img/car_up.png';

const carDown = new Image();
carDown.src = '/static/img/car_down.png';

const carLeft = new Image();
carLeft.src = '/static/img/car_left.png';

const carRight = new Image();
carRight.src = '/static/img/car_right.png';

const carRightUp = new Image();
carRightUp.src = '/static/img/car_right_up.png';

const carLeftUp = new Image();
carLeftUp.src = '/static/img/car_left_up.png';

const carRightDown = new Image();
carRightDown.src = '/static/img/car_right_down.png';

const carLeftDown = new Image();
carLeftDown.src = '/static/img/car_left_down.png';

// Position et vitesses
let x = 50;
let y = 300;
let carSpeedx = 0;
let carSpeedy = 0;

// Suivi des touches
const keys = {};

// Listeners clavier
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
    updateCarImage();
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
    updateCarImage();
});

// Choix de l'image selon les touches
function updateCarImage() {
    const up = keys['ArrowUp'];
    const down = keys['ArrowDown'];
    const left = keys['ArrowLeft'];
    const right = keys['ArrowRight'];

    // Diagonales
    if (up && right) { currentCarImage = carRightUp; return; }
    if (up && left) { currentCarImage = carLeftUp; return; }
    if (down && right) { currentCarImage = carRightDown; return; }
    if (down && left) { currentCarImage = carLeftDown; return; }

    // Directions simples
    if (up) { currentCarImage = carUp; return; }
    if (down) { currentCarImage = carDown; return; }
    if (left) { currentCarImage = carLeft; return; }
    if (right) { currentCarImage = carRight; return; }
}

let currentCarImage = carUp;

// Dessin de la voiture
function drawCar(xPos, yPos) {
    if (currentCarImage && currentCarImage.complete) {
        ctx.drawImage(currentCarImage, xPos - 16, yPos - 16, 32, 32);
    } else {
        // fallback rectangle si l'image n'est pas encore chargée
        ctx.fillStyle = 'red';
        ctx.fillRect(xPos - 10, yPos - 5, 20, 10);
    }
}

// Boucle de dessin
function draw() {
    // 1) Fond
    ctx.drawImage(backgroundImage, 0, 0);

    // 2) Accélération horizontale
    if (keys['ArrowRight']) {
        carSpeed = Math.min(carSpeed + 0.5, 8);
    }
    if (keys['ArrowLeft']) {
        carSpeed = Math.max(carSpeed - 0.5, -8);
    }
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
        carSpeed *= 0.95;
        if (Math.abs(carSpeed) < 0.1) carSpeed = 0;
    }

    // 3) Accélération verticale
    if (keys['ArrowUp']) {
        carSpeedY = Math.max(carSpeedY - 0.5, -8);
    }
    if (keys['ArrowDown']) {
        carSpeedY = Math.min(carSpeedY + 0.5, 8);
    }
    if (!keys['ArrowUp'] && !keys['ArrowDown']) {
        carSpeedY *= 0.95;
        if (Math.abs(carSpeedY) < 0.1) carSpeedY = 0;
    }

    // 4) Collision AVANT de bouger
    let nextX = x + carSpeedx;
    let nextY = y + carSpeedY;

    const centerX = nextX;
    const centerY = nextY;

    if (isOnRoad(centerX, centerY)) {
        x = nextX;
        y = nextY;
    }

    // 5) Dessiner la voiture APRÈS mise à jour
    drawCar(x, y);

    // 6) Boucle
    requestAnimationFrame(draw);
}