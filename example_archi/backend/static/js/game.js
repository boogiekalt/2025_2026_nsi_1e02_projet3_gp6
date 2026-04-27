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
    const r = pixel[0], g = pixel[1], b = pixel[2];

    // Noir = route
    if (r === 0 && g === 0 && b === 0) return true;

    // Rouge = ligne d'arrivée → autorisé pour rouler
    if (r === 255 && g === 0 && b === 0) return true;

    // Blanc = mur
    return false;
}

// Fond
const backgroundImage = new Image();
backgroundImage.src = '/static/img/circuit_1.jpg'; // adapte si besoin
backgroundImage.onload = () => console.log("FOND OK");
backgroundImage.onerror = () => console.log("FOND INTROUVABLE");


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
let x = 1336;
let y = 415;
let carSpeedx = 0;
let carSpeedy = 0;

// --- Décompte ---
let countdown = 3;
let countdownActive = true;
let countdownTimer = 0;

// --- Chrono ---
let chronoStart = 0;
let chronoRunning = false;
let chronoTime = 0;

// --- Tours ---
let laps = 0;
let maxLaps = 3;
let lastCross = false;

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

function startChrono() {
    chronoStart = performance.now();
    chronoRunning = true;
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

//BOUCLE DE DESSIN
function draw() {

    // --- DÉCOMPTE ---
    if (countdownActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0);

        ctx.fillStyle = "white";
        ctx.font = "120px Arial";
        ctx.textAlign = "center";
        ctx.fillText(countdown > 0 ? countdown : "GO!", canvas.width / 2, canvas.height / 2);

        if (performance.now() - countdownTimer > 1000) {
            countdown--;
            countdownTimer = performance.now();

            if (countdown < -1) {
                countdownActive = false;
                startChrono();
            }
        }

        requestAnimationFrame(draw);
        return; // IMPORTANT !!!
    }

    // --- FOND ---
    ctx.drawImage(backgroundImage, 0, 0);

    // --- ACCÉLÉRATION HORIZONTALE ---
    if (keys['ArrowRight']) {
        carSpeedx = Math.min(carSpeedx + 0.3, 4);
    }
    if (keys['ArrowLeft']) {
        carSpeedx = Math.max(carSpeedx - 0.3, -4);
    }
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
        carSpeedx *= 0.95;
        if (Math.abs(carSpeedx) < 0.1) carSpeedx = 0;
    }

    // --- ACCÉLÉRATION VERTICALE ---
    if (keys['ArrowUp']) {
        carSpeedy = Math.max(carSpeedy - 0.3, -4);
    }
    if (keys['ArrowDown']) {
        carSpeedy = Math.min(carSpeedy + 0.3, 4);
    }
    if (!keys['ArrowUp'] && !keys['ArrowDown']) {
        carSpeedy *= 0.95;
        if (Math.abs(carSpeedy) < 0.1) carSpeedy = 0;
    }

    // --- COLLISION ---
    let nextX = x + carSpeedx;
    let nextY = y + carSpeedy;

    if (isOnRoad(nextX, nextY)) {
        x = nextX;
        y = nextY;
    }

    // --- DÉTECTION LIGNE D'ARRIVÉE ---
    let onFinish = isOnFinishLine(x, y);

    if (onFinish && !lastCross) {
        laps++;
        console.log("Tour :", laps);

        if (laps >= maxLaps) {
            chronoRunning = false;
            console.log("Course terminée !");
        }
    }

    lastCross = onFinish;

    // --- DESSIN VOITURE ---
    drawCar(x, y);

    // --- CHRONO ---
    if (chronoRunning) {
        chronoTime = performance.now() - chronoStart;

        let ms = Math.floor(chronoTime % 1000);
        let s = Math.floor((chronoTime / 1000) % 60);
        let m = Math.floor(chronoTime / 60000);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(
            `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`,
            100, 50
        );
    }
    // --- AFFICHAGE DES TOURS ---
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(`Tour : ${laps} / ${maxLaps}`, 100, 90);

    requestAnimationFrame(draw);
}


function isOnFinishLine(x, y) {
    const pixel = collisionCtx.getImageData(x, y, 1, 1).data;
    return pixel[0] === 255 && pixel[1] === 0 && pixel[2] === 0;
}

console.log("APPEL MANUEL DE DRAW");

window.onload = () => {
    countdownTimer = performance.now();   // ← LA LIGNE EXACTE
    draw();
};