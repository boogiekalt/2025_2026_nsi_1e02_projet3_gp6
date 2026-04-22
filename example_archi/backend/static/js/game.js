// Récupération du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
let carSpeed = 0;
let carSpeedY = 0;

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
    // Fond
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Voiture
    drawCar(x, y);

    // Accélération/Décélération horizontale
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
    x += carSpeed;

    // Accélération/Décélération verticale
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
    y += carSpeedY;

    // Limites
    if (x > canvas.width - 10) x = canvas.width - 10;
    if (x < 10) x = 10;
    if (y < 12) y = 12;
    if (y > canvas.height - 12) y = canvas.height - 12;

    requestAnimationFrame(draw);
}

draw();
