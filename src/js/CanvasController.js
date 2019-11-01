let spriteWidthPixels;
let spriteHeightPixels;

let spriteWidth = 30;
let spriteHeight = 20;

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
    }
    
    //context.fillStyle = "#000000";
    //context.rect(10, 10, spriteWidthPixels, spriteHeightPixels); 
    context.fill(); 
}
function drawPoint(x, y) {
    let canvas = document.getElementById("mainCanvas");
    let context = document.getElementById("mainCanvas").getContext("2d");
    context.fillStyle = "#ffc821";
    context.rect(x * 15,y * 15,canvas.width / spriteWidth,canvas.height / spriteHeight);       
    context.fill();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }