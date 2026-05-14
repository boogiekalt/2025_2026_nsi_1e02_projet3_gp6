// Récupération du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas invisible pour la collision
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");

// Image masque noir/blanc
const collisionMap = new Image();
collisionMap.src = "/static/img/collision_map.png";

let raceFinished = false;

collisionMap.onload = () => {
    collisionCtx.drawImage(collisionMap, 0, 0);
};

function isOnRoad(x, y) {
    const pixel = collisionCtx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];

    const isBlack = r < 10 && g < 10 && b < 10;
    const isRed = r > 240 && g < 10 && b < 10;

    return isBlack || isRed;
}

// Fond
const backgroundImage = new Image();
backgroundImage.src = '/static/img/circuit_1.jpg';
backgroundImage.onload = () => console.log("FOND OK");
backgroundImage.onerror = () => console.log("FOND INTROUVABLE");

// Images de la voiture
const carUp = new Image(); carUp.src = '/static/img/car_up.png';
const carDown = new Image(); carDown.src = '/static/img/car_down.png';
const carLeft = new Image(); carLeft.src = '/static/img/car_left.png';
const carRight = new Image(); carRight.src = '/static/img/car_right.png';
const carRightUp = new Image(); carRightUp.src = '/static/img/car_right_up.png';
const carLeftUp = new Image(); carLeftUp.src = '/static/img/car_left_up.png';
const carRightDown = new Image(); carRightDown.src = '/static/img/car_right_down.png';
const carLeftDown = new Image(); carLeftDown.src = '/static/img/car_left_down.png';

// Position et vitesses
let x = 1336;
let y = 415;
let carSpeedx = 0;
let carSpeedy = 0;

// Décompte
let countdown = 3;
let countdownActive = true;
let countdownTimer = 0;

// Chrono
let chronoStart = 0;
let chronoRunning = false;
let chronoTime = 0;

// Tours
let laps = 0;
let maxLaps = 3;
let lastCross = false;
let checkpointCrossed = false;

// Checkpoints
const checkpoints = [
    // Checkpoint 1 : en haut du circuit (marque rouge du haut)
    { x: 650, y: 180, width: 120, height: 40 },

    // Checkpoint 3 : en bas à gauche
    { x: 300, y: 445, width: 140, height: 40 }
];



let currentCheckpoint = 0;

function isOnCheckpoint(x, y, checkpoint) {
    return (
        x > checkpoint.x &&
        x < checkpoint.x + checkpoint.width &&
        y > checkpoint.y &&
        y < checkpoint.y + checkpoint.height
    );
}

// Suivi des touches
const keys = {};

document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
    updateCarImage();
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
    updateCarImage();
});

// Choix de l'image selon les touches
let currentCarImage = carUp;

function updateCarImage() {
    const up = keys['ArrowUp'];
    const down = keys['ArrowDown'];
    const left = keys['ArrowLeft'];
    const right = keys['ArrowRight'];

    if (up && right) { currentCarImage = carRightUp; return; }
    if (up && left) { currentCarImage = carLeftUp; return; }
    if (down && right) { currentCarImage = carRightDown; return; }
    if (down && left) { currentCarImage = carLeftDown; return; }

    if (up) { currentCarImage = carUp; return; }
    if (down) { currentCarImage = carDown; return; }
    if (left) { currentCarImage = carLeft; return; }
    if (right) { currentCarImage = carRight; return; }
}

function startChrono() {
    chronoStart = performance.now();
    chronoRunning = true;
}

// Dessin de la voiture
function drawCar(xPos, yPos) {
    if (currentCarImage && currentCarImage.complete) {
        ctx.drawImage(currentCarImage, xPos - 16, yPos - 16, 32, 32);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(xPos - 10, yPos - 5, 20, 10);
    }
}

// ---------------------------
//     FENÊTRE DE SCORE
// ---------------------------
function showResults() {

    let ms = Math.floor(chronoTime % 1000);
    let s = Math.floor((chronoTime / 1000) % 60);
    let m = Math.floor(chronoTime / 60000);
    const finalTime = `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;

    // Charger anciens scores
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    // Ajouter score actuel
    scores.push({
        time: finalTime,
        laps: laps,
        date: new Date().toLocaleString()
    });

    // Sauvegarder
    localStorage.setItem("scores", JSON.stringify(scores));

    // Afficher dans la popup
    document.getElementById("finalTime").textContent = "Temps final : " + finalTime;
    document.getElementById("finalLaps").textContent = `Tours : ${laps}/${maxLaps}`;

    // Liste des scores
    const list = document.getElementById("scoreList");
    list.innerHTML = "";
    scores.slice(-5).forEach(s => {
        const li = document.createElement("li");
        li.textContent = `${s.time} (${s.laps} tours)`;
        list.appendChild(li);
    });

    // Afficher la popup
    document.getElementById("raceResults").style.display = "flex";

    // Boutons
    document.getElementById("retryBtn").onclick = () => location.reload();
    document.getElementById("menuBtn").onclick = () => {
        console.log("Retour au menu (à coder)");
    };
}

// ---------------------------
//         BOUCLE DRAW
// ---------------------------
function draw() {

    // Décompte
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
        return;
    }

    // Fond
    ctx.drawImage(backgroundImage, 0, 0);

    // DEBUG : afficher les checkpoints
for (let cp of checkpoints) {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.strokeRect(cp.x, cp.y, cp.width, cp.height);
}


    // Accélération horizontale
    if (keys['ArrowRight']) carSpeedx = Math.min(carSpeedx + 0.3, 4);
    if (keys['ArrowLeft']) carSpeedx = Math.max(carSpeedx - 0.3, -4);
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
        carSpeedx *= 0.95;
        if (Math.abs(carSpeedx) < 0.1) carSpeedx = 0;
    }

    // Accélération verticale
    if (keys['ArrowUp']) carSpeedy = Math.max(carSpeedy - 0.3, -4);
    if (keys['ArrowDown']) carSpeedy = Math.min(carSpeedy + 0.3, 4);
    if (!keys['ArrowUp'] && !keys['ArrowDown']) {
        carSpeedy *= 0.95;
        if (Math.abs(carSpeedy) < 0.1) carSpeedy = 0;
    }

    // Collision
    let nextX = x + carSpeedx;
    let nextY = y + carSpeedy;

    // Checkpoints
    let onCheckpoint =
        currentCheckpoint < checkpoints.length &&
        isOnCheckpoint(x, y, checkpoints[currentCheckpoint]);

    if (onCheckpoint && !checkpointCrossed) {
        console.log("Checkpoint", currentCheckpoint + 1, "validé");
        currentCheckpoint++;
    }

    checkpointCrossed = onCheckpoint;

    // Test horizontal
    if (isOnRoad(nextX, y)) x = nextX;
    else carSpeedx *= -1;

    // Test vertical
    if (isOnRoad(x, nextY)) y = nextY;
    else carSpeedy *= -1;

    // Ligne d'arrivée
    let onFinish = isOnFinishLine(x, y);

    if (onFinish && !lastCross) {

        if (currentCheckpoint === checkpoints.length) {

            laps++;
            console.log("Tour :", laps);

            currentCheckpoint = 0;
            checkpointCrossed = false;

            if (laps >= maxLaps && !raceFinished) {
                raceFinished = true;
                chronoRunning = false;
                showResults();
                console.log("Course terminée !");
            }

        } else {
            console.log("Tour refusé : checkpoints manquants");
        }
    }

    lastCross = onFinish;

    // Dessin voiture
    drawCar(x, y);

    // Chrono
    if (chronoRunning) {
        chronoTime = performance.now() - chronoStart;

        let ms = Math.floor(chronoTime % 1000);
        let s = Math.floor((chronoTime / 1000) % 60);
        let m = Math.floor(chronoTime / 60000);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(`${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`, 100, 50);
    }

    // Tours
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(`Tour : ${laps} / ${maxLaps}`, 100, 90);

    requestAnimationFrame(draw);
}

function isOnFinishLine(x, y) {
    const pixel = collisionCtx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];

    // tolérance pour le rouge
    return r > 200 && g < 50 && b < 50;
}


window.onload = () => {
    countdownTimer = performance.now();
    draw();
};
