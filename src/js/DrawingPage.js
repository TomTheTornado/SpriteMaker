
function exportCanvas() {
    let canvas = document.getElementById("mainCanvas");
    let img = canvas.toDataURL("image/png");

    document.write('<img src="'+img+'"/>');
}

function saveCanvas() {
    // TODO
}