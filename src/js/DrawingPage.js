var slider = document.getElementById("fpsSlider");
var output = document.getElementById("fpsValue");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
}

function selectButton(element) {
    document.getElementById('layer1button').className="btn btn-dark";
    document.getElementById('layer2button').className="btn btn-dark";
    document.getElementById('layer3button').className="btn btn-dark";
    document.getElementById(element).className = "btn btn-light";
}

function saveCanvas() {
    // TODO
}

function HandleToggleStyle() {
    let btn = document.getElementById('togglePreviewBtn');

    if (btn.value == "true") {
        btn.value = "false";
        btn.innerHTML = "Stop&nbsp;&nbsp;";
    } else {
        btn.value = "true";
        btn.innerHTML = "Play&nbsp;&nbsp;&nbsp;";
    }
}