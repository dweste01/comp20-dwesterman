
// html code has <canvas id="game_canvas" height="600" width="800"></canvas>
// and <body onload="init();">

function init() {
    var canvas = document.getElementById("game_canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.addEventListener("load", function() {
	    ctx.drawImage(img, 321, 0, 466, 139, 0, 0, 466, 139);
	    ctx.drawImage(img, 80, 20, 20, 20, 34, 24, 20, 20);
    }, false);
    img.src = "pacman10-hp-sprite.png";
}


