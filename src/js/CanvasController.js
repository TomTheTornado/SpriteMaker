let spriteWidthPixels;
let spriteHeightPixels;

let spriteWidth = 32;
let spriteHeight = 32;
let colors = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let colorsFill = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let mouseDown = false;
let color;
let prevX = 0;
let prevY = 0;
let tool = "draw";


function setupCanvas() {
    
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");

    spriteWidthPixels = canvas.width / spriteWidth;
    spriteHeightPixels = canvas.height / spriteHeight;

    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            if (j % 2 == 0) {
                context.fillStyle = i % 2 ? "#1e1e1e" : "#282828";
            } else {
                context.fillStyle = i % 2 ? "#282828" : "#1e1e1e";
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
        paintBucket(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
        }, false);

    canvas.addEventListener('mousemove', function(evt) {
        let mousePos = getMousePos(canvas, evt);
        if (mouseDown){
            drawPoint(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
            return;
        }
        //hoverPoint(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
        }, false);


    canvas.addEventListener('mouseup', function(evt) {
        mouseDown = false;
        }, false);
}


function colorPicker(x,y){
    document.getElementById('selectedColor').value = colors[x][y];
}

function hoverPoint(x,y){
    color = document.getElementById('selectedColor').value;
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");
    //colors[x][y] = color;
    context.beginPath();
    context.fillStyle = color;
    context.rect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);       
    context.fill();

}

function paintBucket(x,y){
    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            colorsFill[i][j] = 0;
        }
    }
    fillArea(x,y);
}

function fillArea(x,y){
    console.log(colorsFill[x][y].value);
    colorsFill[x][y] = 1;
    if(x+1 >= 0 && x+1 < spriteWidth){
        if(colors[x][y] == colors[x+1][y] && colorsFill[x+1][y] == 0){
            fillArea(x+1,y);
        }
    }
    if(x-1 >= 0 && x-1 < spriteWidth){
        if(colors[x][y] == colors[x-1][y] && colorsFill[x-1][y] == 0){
            fillArea(x-1,y);
        }
    }
    if(y+1 >= 0 && y+1 < spriteHeight){
        if(colors[x][y] == colors[x][y+1] && colorsFill[x][y+1] == 0){
            fillArea(x,y+1);
        }
    }
    if(y-1 >= 0 && y-1 < spriteHeight){
        if(colors[x][y] == colors[x][y-1] && colorsFill[x][y-1] == 0){
            fillArea(x,y-1);
        }
    }
    
    drawPoint(x,y);
}

function drawPoint(x, y) {
    color = document.getElementById('selectedColor').value;
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");

    colors[x][y] = color;
    context.beginPath();
    context.fillStyle = color;
    context.rect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);       
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
    let context = document.getElementById("mainCanvas").getContext("2d");
    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            context.clearRect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels); 
            context.clearRect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels);
        }
    }
    console.log(document.getElementById('canX').value);
    spriteWidth = document.getElementById('canX').value;
    spriteHeight = document.getElementById('canY').value;
    colors = create2DArray(spriteWidth);
    setupCanvas();
}

function create2DArray(rows){
    var arr = [];

    for (var i=0;i<rows;i++){
        arr[i] = [];
    }
    return arr;
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
