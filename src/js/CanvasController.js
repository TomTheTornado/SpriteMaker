let spriteWidthPixels;
let spriteHeightPixels;

let spriteWidth = 30;
let spriteHeight = 30;
let colors1 = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let colors2 = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let colors3 = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let currentLayer = colors1;
let colorsFill = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let mouseDown = false;
let color;
let prevX = 0;
let prevY = 0;
let currentTool = "Paintbrush";


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
            colors1[i][j] = "";
            colors2[i][j] = "";
            colors3[i][j] = "";
            context.beginPath();
            context.rect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels); 
            context.fill(); 
        }
    }
    canvas.addEventListener('mousedown', function(evt) {
        mouseDown = true;
        let mousePos = getMousePos(canvas, evt);
        handleTool(mousePos);
        drawAllLayers();
        }, false);

    canvas.addEventListener('mousemove', function(evt) {
        let mousePos = getMousePos(canvas, evt);
        if (mouseDown){
            handleTool(mousePos);
            return;
        }
        drawAllLayers();
        hoverPoint(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
        }, false);


    canvas.addEventListener('mouseup', function(evt) {
        mouseDown = false;
        }, false);

    canvas.addEventListener ("mouseout", function(evt) {
        mouseDown = false;
        drawAllLayers();
        // Do nothing else. It should kill all input to the drawing.
        }, false);
}
function switchLayer(layerNumber) {
    if (layerNumber === 1)
        currentLayer = colors1;
    if (layerNumber === 2)
        currentLayer = colors2;
    if (layerNumber === 3)
        currentLayer = colors3;
}
function setTool(tool) {
    document.getElementById(currentTool).className="list-group-item list-group-item-success";
    currentTool = tool;
    document.getElementById(currentTool).className="list-group-item list-group-item-dark";
}
function colorPicker(x,y){
    if (!currentLayer[x][y]) return;
    console.log(currentLayer[x][y]);
    document.getElementById('selectedColor').value = currentLayer[x][y];
}

function handleTool(mousePos) {
    switch(currentTool) {
        case "ColorPicker":
            colorPicker(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
            break;
        case "PaintBucket":
            paintBucket(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
            break;
        case "Eraser":
            erasePoint(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
            break;
        case "DitherTool":
            ditherTool(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
            break;
        case "ReverseDitherTool":
            reverseDitherTool(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
            break;
        case "RecolorTool":
            recolorTool(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
            break;
        case "Paintbrush":
        default:
            drawPoint(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
            break;
    }
}

function recolorTool(x,y){
    let color = currentLayer[x][y];
    for(let i = 0; i < spriteWidth; i++){
        for(let j = 0; j < spriteHeight; j++){
            if(currentLayer[i][j] == color){
                drawPoint(i,j);
            }
        }
    }
}

function reverseDitherTool(x,y){
    if((x%2 == 0)&&(y%2 == 1)){
        drawPoint(x,y);
    }
    if((x%2 == 1)&&(y%2 == 0)){
        drawPoint(x,y);
    }
}

function ditherTool(x,y){
    if((x%2 == 0)&&(y%2 == 0)){
        drawPoint(x,y);
    }
    if((x%2 == 1)&&(y%2 == 1)){
        drawPoint(x,y);
    }
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
    colorsFill[x][y] = 1;
    if(x+1 >= 0 && x+1 < spriteWidth){
        if(currentLayer[x][y] == currentLayer[x+1][y] && colorsFill[x+1][y] == 0){fillArea(x+1,y);}
    }
    if(x-1 >= 0 && x-1 < spriteWidth){
        if(currentLayer[x][y] == currentLayer[x-1][y] && colorsFill[x-1][y] == 0){fillArea(x-1,y);}
    }
    if(y+1 >= 0 && y+1 < spriteHeight){
        if(currentLayer[x][y] == currentLayer[x][y+1] && colorsFill[x][y+1] == 0){fillArea(x,y+1);}
    }
    if(y-1 >= 0 && y-1 < spriteHeight){
        if(currentLayer[x][y] == currentLayer[x][y-1] && colorsFill[x][y-1] == 0){fillArea(x,y-1);}
    }
    drawPoint(x,y);
}

function hoverPoint(x,y){
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");
    context.beginPath();
    context.fillStyle = "rgba(255, 255, 255, 0.4)";
    context.rect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);       
    context.fill();
}
function erasePoint(x, y) {
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");
    context.clearRect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);

    if (y % 2 == 0) {
        context.fillStyle = x % 2 ? "#1e1e1e" : "#282828";
    } else {
        context.fillStyle = x % 2 ? "#282828" : "#1e1e1e";
    }
    colors[x][y] = "";
    context.beginPath();
    context.rect(x * spriteWidthPixels, y * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels); 
    context.fill(); 
}

function drawPoint(x, y) {
    color = document.getElementById('selectedColor').value;
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");

    currentLayer[x][y] = color;
    drawAllLayers();
}

function drawPointColor(x, y, color, context) {
    if (color === "") return;
    console.log(color);

    context.beginPath();
    context.fillStyle = color;
    context.rect(x, y, 1,1);       
    context.fill();
}

function drawAllLayers() {
    drawLayer(colors3);
    drawLayer(colors2);
    drawLayer(colors1);
}

function drawLayer(layer) {
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");

    for (let x = 0; x < spriteWidth; x++) {
        for (let y = 0; y < spriteHeight; y++) {
            let color;
            if (colors1[x][y] == "" && colors2[x][y] == "" && colors3[x][y] == "") {
                if (y % 2 == 0) {
                    color = x % 2 ? "#1e1e1e" : "#282828";
                } else {
                    color = x % 2 ? "#282828" : "#1e1e1e";
                }
            }
            else if (layer[x][y] == "") continue;
            else {color = layer[x][y];}
            context.beginPath();
            context.fillStyle = color;
            context.rect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);
            context.clearRect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);       
            context.fill();
        }
    }
}

function exportCanvas() {
    let exportCanvas = createContext(spriteWidth, spriteHeight);
    let exportCanvasContext = exportCanvas.getContext("2d");
    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            drawPointColor(i, j, colors3[i][j], exportCanvasContext);
        }
    }
    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            drawPointColor(i, j, colors2[i][j], exportCanvasContext);
        }
    }
    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            drawPointColor(i, j, colors1[i][j], exportCanvasContext);
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
    colors1 = create2DArray(spriteWidth);
    colors2 = create2DArray(spriteWidth);
    colors3 = create2DArray(spriteWidth);
    setupCanvas();
}

function create2DArray(rows){
    if(rows <= 0) throw new Error();
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
