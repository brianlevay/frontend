var state = {
    mouseHold: false,
    canvasWidth: 600,
    canvasHeight: 400,
    brushType: "circle",
    brushSize: 5,
    brushColor: [0,0,255]
};

function setup() {
    // Initializes canvas //
    var canv = document.getElementById("pad");
    var ctx = canv.getContext("2d");
    canv.width = state.canvasWidth;
    canv.height = state.canvasHeight;
    
    // Initializes paintbrush properties //
    var brushSizeElement = document.getElementById("brushSize");
    var brushSizeDisplay = document.getElementById("brushSizeVal");
    brushSizeElement.value = state.brushSize;
    brushSizeDisplay.innerHTML = state.brushSize;
    
    var brushRedElement = document.getElementById("brushRed");
    var brushRedDisplay = document.getElementById("brushRedVal");
    var brushGreenElement = document.getElementById("brushGreen");
    var brushGreenDisplay = document.getElementById("brushGreenVal");
    var brushBlueElement = document.getElementById("brushBlue");
    var brushBlueDisplay = document.getElementById("brushBlueVal");
    brushRedElement.value = state.brushColor[0];
    brushRedDisplay.innerHTML = state.brushColor[0];
    brushGreenElement.value = state.brushColor[1];
    brushGreenDisplay.innerHTML = state.brushColor[1];
    brushBlueElement.value = state.brushColor[2];
    brushBlueDisplay.innerHTML = state.brushColor[2];
    
    // Gets reference for "CLEAR" button //
    var clearBtn = document.getElementById("clearBtn");
    
    // Mouse events for traditional desktop //
    canv.addEventListener("mousedown", function(e){
        state.mouseHold = true;
        return;
    });
    canv.addEventListener("mousemove", function(e){
        if (state.mouseHold) {
            drawFreeHand(ctx, state.brushColor, state.brushType, state.brushSize, getMousePosition(e,canv));
        }
        return;
    });
    canv.addEventListener("mouseup", function(e){
        state.mouseHold = false;
        return;
    });
    
    // Touch events - got the e.touches[0] from Stack Overflow! //
    canv.addEventListener("touchstart", function(e){
        state.mouseHold = true;
        return;
    });
    canv.addEventListener("touchmove", function(e){
        if (state.mouseHold) {
            drawFreeHand(ctx, state.brushColor, state.brushType, state.brushSize, getMousePosition(e.touches[0],canv));
        }
        return;
    });
    canv.addEventListener("touchend", function(e){
        state.mouseHold = false;
        return;
    });
    
    // Event for clearing the page //
    clearBtn.addEventListener("click", function(){
        clearCanvas(ctx);
        return;
    });
    
    // Events for updating brush parameters //
    brushSizeElement.addEventListener("change", function(){
        state.brushSize = brushSizeElement.value;
        brushSizeDisplay.innerHTML = state.brushSize;
        return;
    });
    brushRedElement.addEventListener("change", function(){
        state.brushColor[0] = brushRedElement.value;
        brushRedDisplay.innerHTML = state.brushColor[0];
        return;
    });
    brushGreenElement.addEventListener("change", function(){
        state.brushColor[1] = brushGreenElement.value;
        brushGreenDisplay.innerHTML = state.brushColor[1];
        return;
    });
    brushBlueElement.addEventListener("change", function(){
        state.brushColor[2] = brushBlueElement.value;
        brushBlueDisplay.innerHTML = state.brushColor[2];
        return;
    });
    
    return;
}

function getMousePosition(e, canvas) {
    var X = e.pageX - canvas.offsetLeft;
    var Y = e.pageY - canvas.offsetTop;
    return [X,Y];
}

function drawFreeHand(context, color, shape, thickness, center) {
    context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    if (shape == "circle") {
        var rad = Math.round(thickness/2);
        context.beginPath();
        context.arc(center[0],center[1],rad,0,2.0*Math.PI);
        context.closePath();
        context.fill();
        return;
    }
    else if (shape == "square") {
        var cornerX = center[0] - Math.round(thickness/2);
        var cornerY = center[1] - Math.round(thickness/2);
        context.beginPath();
        context.rect(cornerX,cornerY,thickness,thickness);
        context.closePath();
        context.fill();
        return;
    }
    else {
        return;
    }
}

function clearCanvas(context) {
    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.rect(0,0,state.canvasWidth,state.canvasHeight);
    context.closePath();
    context.fill();
    return;
}

/* This binds the appropriate functions on page load */
setup();