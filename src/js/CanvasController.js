let spriteWidthPixels;
let spriteHeightPixels;

let spriteWidth = 30;
let spriteHeight = 30;
let colors = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let mouseDown = false;
let color;


function setupCanvas() {
    
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");

    spriteWidthPixels = canvas.width / spriteWidth;
    spriteHeightPixels = canvas.height / spriteHeight;

    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            if (j % 2 == 0) {
                context.fillStyle = i % 2 ? "#055a4b" : "#000000";
            } else {
                context.fillStyle = i % 2 ? "#000000" : "#055a4b";
            }
            colors[i][j] = "";
            context.beginPath();
            context.rect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels); 
            context.fill(); 
        }
    }
    canvas.addEventListener('mousedown', function(evt) {
        mouseDown = true;
        let mousePos = getMousePos(canvas, evt);
        drawPoint(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
        }, false);

    canvas.addEventListener('mousemove', function(evt) {
        if (!mouseDown) return;
        let mousePos = getMousePos(canvas, evt);
        drawPoint(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
        }, false);

    canvas.addEventListener('mouseup', function(evt) {
        mouseDown = false;
        }, false);
}

function drawPoint(x, y) {
    color = document.getElementById('selectedColor').value;
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");

    colors[x][y] = color;
    context.beginPath();
    context.fillStyle = color;
    context.rect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth,canvas.height / spriteHeight);       
    context.fill();
}

function drawPointColor(x, y, color, context) {
    if (color === "") return;
    console.log(color);

    context.beginPath();
    context.fillStyle = color;
    context.rect(x, y, 1,1);       
    context.fill();
}

function exportCanvas() {
    let exportCanvas = createContext(spriteWidth, spriteHeight);
    let exportCanvasContext = exportCanvas.getContext("2d");
    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            drawPointColor(i, j, colors[i][j], exportCanvasContext);
        }
    }
    let img = exportCanvas.toDataURL("image/png");

    document.write('<img src="'+img+'"/>');
}

function createContext(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function resizeCanvas(){
    console.log(document.getElementById('canX').value);
    spriteWidth = document.getElementById('canX').value;
    spriteHeight = document.getElementById('canY').value;
    let colors = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
    setupCanvas();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    }
  }
