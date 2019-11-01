let spriteWidthPixels;
let spriteHeightPixels;

let spriteWidth = 12;
let spriteHeight = 10;

function setupCanvas() {
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");

    spriteWidthPixels = canvas.width / spriteWidth;
    spriteHeightPixels = canvas.height / spriteHeight;

    for (let i = 0; i < spriteWidth; i++) {
        for (let j = 0; j < spriteHeight; j++) {
            if (j % 2 == 0) {
                context.fillStyle = i % 2 ? "#055a4b" : "#000000";
            }
            else {
                context.fillStyle = i % 2 ? "#000000" : "#055a4b" ;
            }
            context.beginPath();
            context.rect(i * spriteWidthPixels, j * spriteHeightPixels, spriteWidthPixels, spriteHeightPixels); 
   
            context.fill(); 
        }

        canvas.addEventListener('mouseup', function(evt) {
            var mousePos = getMousePos(canvas, evt);
            drawPoint(Math.floor(mousePos.x / spriteWidthPixels), Math.floor(mousePos.y / spriteHeightPixels));
          }, false);
    }
}
function drawPoint(x, y) {
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");
    context.beginPath();
    context.fillStyle = "#ffc821";
    context.rect(x * spriteWidthPixels, y * spriteHeightPixels, canvas.width / spriteWidth,canvas.height / spriteHeight);       
    context.fill();
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