let spriteWidthPixels;
let spriteHeightPixels;

let spriteWidth = 30;
let spriteHeight = 30;
let colors1 = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
var colors2 = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
var colors3 = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let currentLayer = colors1;
let layerNum = 1;
let colorsFill = Array.from(Array(spriteWidth), () => new Array(spriteHeight));
let mouseDown = false;
let color;
let prevX = 0;
let prevY = 0;
let currentTool = "Paintbrush";

let previewPlaying = false;
let playingFrame = 0;

let currentFrame = 0;
let totalFrames = 0;
let frames = [];

function setupCanvas() {
    let canvas = document.getElementById("mainCanvas");
    let context = canvas.getContext("2d");

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

    setupFrame();
    document.getElementById('loadFile').addEventListener('change', uploadFile);

    canvas.addEventListener('mousedown', function(evt) {
        mouseDown = true;
        let mousePos = getMousePos(canvas, evt);
        handleTool(mousePos);
        drawAllLayers();
        showPreview();
        }, false);

    canvas.addEventListener('mousemove', function(evt) {
        let mousePos = getMousePos(canvas, evt);
        if (mouseDown){
            handleTool(mousePos);
            //showPreview();
            return;
        }
        drawAllLayers();
        showPreview();
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

function saveSpriteJson() {
    let name = "sprite";
    let json = { frames,
                 "totalFrames": totalFrames,
                 "spriteWidth": spriteWidth,
                 "spriteHeight": spriteHeight
                }
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    let a = document.getElementById('downloadSave');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", name + ".json");
    a.click();
}

function loadSpriteJson() {
    document.getElementById('loadFile').click();
}

function uploadFile() {
    let reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
    let obj = JSON.parse(event.target.result);

    // Set values from JSON
    spriteWidth = obj.spriteWidth;
    spriteHeight = obj.spriteHeight;

    totalFrames = obj.totalFrames;
    frames = obj.frames;

    // Set miscellaneous variables based on the above values
    let canvas = document.getElementById("mainCanvas");

    spriteWidthPixels = canvas.width / spriteWidth;
    spriteHeightPixels = canvas.height / spriteHeight;

    currentFrame = 0;
    playingFrame = 0;

    colors1 = JSON.parse(JSON.stringify((frames[currentFrame][0])));
    colors2 = JSON.parse(JSON.stringify((frames[currentFrame][1])));
    colors3 = JSON.parse(JSON.stringify((frames[currentFrame][2])));

    currentLayer = JSON.parse(JSON.stringify((frames[currentFrame][0])));
    layerNum = 1;
}

function setupFrame() {
  totalFrames += 1;

  newArray = create2DArray(spriteWidth);

  for (let i = 0; i < spriteWidth; i++) {
    for (let j = 0; j < spriteHeight; j++) {
        newArray[i][j] = "";
    }
  }

  let currentFrameLayers = [];
  currentFrameLayers.push(JSON.parse(JSON.stringify((newArray))));
  currentFrameLayers.push(JSON.parse(JSON.stringify((newArray))));
  currentFrameLayers.push(JSON.parse(JSON.stringify((newArray))));

  frames[currentFrame] = JSON.parse(JSON.stringify((currentFrameLayers)));
  switchLayer(layerNum);
}

// switchForward: false = backwards, true = forwards.
function switchFrame(switchForward) {
    if (currentFrame == 0 && !switchForward) return;

    // save previous frames
    if (layerNum == 1) {
        colors1 = JSON.parse(JSON.stringify((currentLayer)));
    }

    if (layerNum == 2) {
        colors1 = JSON.parse(JSON.stringify((currentLayer)));
    }

    if (layerNum == 3) {
        colors1 = JSON.parse(JSON.stringify((currentLayer)));
    }

    frames[currentFrame][0] = JSON.parse(JSON.stringify(colors1));
    frames[currentFrame][1] = JSON.parse(JSON.stringify((colors2)));
    frames[currentFrame][2] = JSON.parse(JSON.stringify((colors3)));
    
    // change current frame.
    if (switchForward)
        currentFrame += 1;
    else
        currentFrame -= 1;

    if (currentFrame > totalFrames - 1) {
        setupFrame();
    }

    // switch frames
    colors1 = JSON.parse(JSON.stringify((frames[currentFrame][0])));
    colors2 = JSON.parse(JSON.stringify((frames[currentFrame][1])));
    colors3 = JSON.parse(JSON.stringify((frames[currentFrame][2])));

    switchLayer(layerNum);
    
    clearDrawingCanvas();
    drawAllLayers();
}

function clearDrawingCanvas() {
    let canvas = document.getElementById("mainCanvas");
    let context = canvas.getContext("2d");

    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            if (j % 2 == 0) {
                context.fillStyle = i % 2 ? "#1e1e1e" : "#282828";
            } else {
                context.fillStyle = i % 2 ? "#282828" : "#1e1e1e";
            }
            context.beginPath();
            context.rect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels); 
            context.fill(); 
        }
    }
}

function clearCanvas(whichCanvas) {
    let canvas = whichCanvas;
    let context = canvas.getContext("2d");

    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            if (j % 2 == 0) {
                context.fillStyle = i % 2 ? "#1e1e1e" : "#282828";
            } else {
                context.fillStyle = i % 2 ? "#282828" : "#1e1e1e";
            }
            context.beginPath();
            context.rect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels); 
            context.fill(); 
        }
    }
}
function switchLayer(layerNumber) {
    if (layerNumber === 1) {
        currentLayer = (frames[currentFrame][0]);
        layerNum = 1;
    }
    if (layerNumber === 2) {
        currentLayer = (frames[currentFrame][1]);
        layerNum = 2;
    }
    if (layerNumber === 3) {
        currentLayer = (frames[currentFrame][2]);
        layerNum = 3;
    }
}
function setTool(tool) {
    document.getElementById(currentTool).className="list-group-item list-group-item-dark-custom";
    currentTool = tool;
    document.getElementById(currentTool).className="list-group-item list-group-item-selected";
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
    if (color == "") return;
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
    currentLayer[x][y] = "";
    //drawAllLayersAtAPoint(x, y);

    // save previous frames
    if (layerNum == 1) {
        frames[currentFrame][0] = JSON.parse(JSON.stringify((currentLayer)));
        colors1 = JSON.parse(JSON.stringify((frames[currentFrame][0])));
    }
    if (layerNum == 2) {
        frames[currentFrame][1] = JSON.parse(JSON.stringify((currentLayer)));
        colors2 = JSON.parse(JSON.stringify((frames[currentFrame][1])));
    }
    if (layerNum == 3) {
        frames[currentFrame][2] = JSON.parse(JSON.stringify((currentLayer)));
        colors3 = JSON.parse(JSON.stringify((frames[currentFrame][2])));
    }

    drawAllLayers();
}

function drawPoint(x, y) {
    color = document.getElementById('selectedColor').value;

    currentLayer[x][y] = color;

    // save previous frames
    if (layerNum == 1) {
        frames[currentFrame][0] = JSON.parse(JSON.stringify((currentLayer)));
        colors1 = JSON.parse(JSON.stringify((frames[currentFrame][0])));
    }
    if (layerNum == 2) {
        frames[currentFrame][1] = JSON.parse(JSON.stringify((currentLayer)));
        colors2 = JSON.parse(JSON.stringify((frames[currentFrame][1])));
    }
    if (layerNum == 3) {
        frames[currentFrame][2] = JSON.parse(JSON.stringify((currentLayer)));
        colors3 = JSON.parse(JSON.stringify((frames[currentFrame][2])));
    }

    drawAllLayers();
}

function drawPointColor(x, y, color, context) {
    if (color === "") return;

    context.beginPath();
    context.fillStyle = color;
    context.rect(x, y, 1,1);       
    context.fill();
}

function drawAllLayers() {
    drawLayer(JSON.parse(JSON.stringify(colors3)));
    drawLayer(JSON.parse(JSON.stringify(colors2)));
    drawLayer(JSON.parse(JSON.stringify(colors1)));
}

function drawAllLayersOfFrame(frame, canvas) {
    drawLayerOnCanvas(JSON.parse(JSON.stringify(frames[frame][2])), canvas);
    drawLayerOnCanvas(JSON.parse(JSON.stringify(frames[frame][1])), canvas);
    drawLayerOnCanvas(JSON.parse(JSON.stringify(frames[frame][0])), canvas);
}

function drawAllLayersAtAPoint(x, y) {
    drawLayerAtAPoint(JSON.parse(JSON.stringify(frames[currentFrame][2])),x,y);
    drawLayerAtAPoint(JSON.parse(JSON.stringify(frames[currentFrame][1])),x,y);
    drawLayerAtAPoint(JSON.parse(JSON.stringify(frames[currentFrame][0])),x,y);
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

function drawLayerOnCanvas(layer, whichCanvas) {
    let canvas = whichCanvas;
    let context = whichCanvas.getContext("2d");

    for (let x = 0; x < spriteWidth; x++) {
        for (let y = 0; y < spriteHeight; y++) {
            let color;
            if (layer[x][y] == "") continue;
            else {color = layer[x][y];}
            context.beginPath();
            context.fillStyle = color;
            context.rect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);
            context.clearRect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);       
            context.fill();
        }
    }
}

function drawLayerAtAPoint(layer,x,y) {
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");
    let color;
    if (colors1[x][y] == "" && colors2[x][y] == "" && colors3[x][y] == "") {
        if (y % 2 == 0) {
            color = x % 2 ? "#1e1e1e" : "#282828";
        } else {
            color = x % 2 ? "#282828" : "#1e1e1e";
        }
    }
    else if (layer[x][y] == "") return;
    else {color = layer[x][y];}
    context.beginPath();
    context.fillStyle = color;
    context.rect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);
    context.clearRect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth , canvas.height / spriteHeight);       
    context.fill();
}
function exportCanvas() {
    let exportSpriteSheet = createContext(spriteWidth * totalFrames, spriteHeight);
    let exportSpriteSheetContext = exportSpriteSheet.getContext("2d");
    for (let exportingFrame = 0; exportingFrame < totalFrames; exportingFrame++) {
        let exportCanvas = createContext(spriteWidth, spriteHeight);
        let exportCanvasContext = exportCanvas.getContext("2d");
        for (let i = 0; i < spriteWidth; i++) {
            for (let j = 0; j < spriteHeight; j++) {
                drawPointColor(i, j, frames[exportingFrame][2][i][j], exportCanvasContext);
            }
        }
        for (let i = 0; i < spriteWidth; i++) {
            for (let j = 0; j < spriteHeight; j++) {
                drawPointColor(i, j, frames[exportingFrame][1][i][j], exportCanvasContext);
            }
        }
        for (let i = 0; i < spriteWidth; i++) {
            for (let j = 0; j < spriteHeight; j++) {
                drawPointColor(i, j, frames[exportingFrame][0][i][j], exportCanvasContext);
            }
        }
        let img = exportCanvas;
        exportSpriteSheetContext.drawImage(img, spriteWidth * exportingFrame, 0);
    }
    let button = document.getElementById('exportBtn');
        button.setAttribute("href", exportSpriteSheet);
            var link = document.createElement('a');
            link.download = 'YourSpriteSheet.png';
            link.href = exportSpriteSheet.toDataURL("image/png");
            link.click();
}
function exportCanvasFrame() {
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
    let button = document.getElementById('exportBtn');
    button.setAttribute("href", img);
        var link = document.createElement('a');
        link.download = 'YourSprite.png';
        link.href = img;
        link.click();
}

function createContext(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function resizeCanvas(){
    let canvas = document.getElementById("mainCanvas");
    let context = canvas.getContext("2d");

    let newSpriteWidth = document.getElementById('canX').value;
    let newSpriteHeight = document.getElementById('canY').value;

    if (newSpriteWidth > canvas.scrollWidth || newSpriteHeight > canvas.scrollHeight) {
        document.getElementById('canX').value = spriteWidth;
        document.getElementById('canY').value = spriteHeight;
        alert(`Value too large! Maximize sprite size is ${canvas.scrollWidth}x${canvas.scrollHeight}.`);
        return;
    }   

    spriteWidth = newSpriteWidth;
    spriteHeight = newSpriteHeight;

    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            context.clearRect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels); 
            context.clearRect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels);
        }
    }

    colors1 = create2DArray(spriteWidth);
    colors2 = create2DArray(spriteWidth);
    colors3 = create2DArray(spriteWidth);
    currentLayer = colors1;
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

  function showPreview() {
    let preview = document.getElementById('preview');
    let previewContext = preview.getContext("2d");

    let mainCanvas = document.getElementById("mainCanvas");
    if (!previewPlaying) {
        previewContext.drawImage(mainCanvas, 0, 0);
    } else {
        let fakeCanvas = createContext(mainCanvas.width, mainCanvas.height);
        clearCanvas(fakeCanvas);
        drawAllLayersOfFrame(playingFrame, fakeCanvas);
        previewContext.drawImage(fakeCanvas, 0, 0);
        playingFrame += 1;
        if (playingFrame >= totalFrames)
            playingFrame = 0;
    }
  }

  function TogglePreviewAnimation() {
      previewPlaying = !previewPlaying;
  }
