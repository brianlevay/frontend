/////////////////////////////////////////////////////////////////
// Global state and DOM references //
/////////////////////////////////////////////////////////////////

var state = {
    mouseHold: false,
    canvasWidth: 600,
    canvasHeight: 400,
    brushType: "square",
    brushSize: 5,
    brushColor: [0,0,255]
};

var dom = {
    canv: document.getElementById("pad"),
    ctx: document.getElementById("pad").getContext("2d"),
    brushSizeElement: document.getElementById("brushSize"),
    circleRadio: document.getElementById("circleRadio"),
    squareRadio: document.getElementById("squareRadio"),
    brushSizeDisplay: document.getElementById("brushSizeVal"),
    brushSizePrev: document.getElementById("brushSizePrev"),
    brushRedElement: document.getElementById("brushRed"),
    brushRedDisplay: document.getElementById("brushRedVal"),
    brushGreenElement: document.getElementById("brushGreen"),
    brushGreenDisplay: document.getElementById("brushGreenVal"),
    brushBlueElement: document.getElementById("brushBlue"),
    brushBlueDisplay: document.getElementById("brushBlueVal"),
    brushColorPrev: document.getElementById("brushColorPrev"),
    clearBtn: document.getElementById("clearBtn")
}

/////////////////////////////////////////////////////////////////
// Define setup function //
/////////////////////////////////////////////////////////////////

function setup() {
    // Initializes canvas //
    dom.canv.width = state.canvasWidth;
    dom.canv.height = state.canvasHeight;
    
    initializePaintBrush();
    bindBrushStateListeners();
    
    // Mouse events for traditional desktop //
    dom.canv.addEventListener("mousedown", function(e){
        state.mouseHold = true;
        return;
    });
    dom.canv.addEventListener("mousemove", function(e){
        if (state.mouseHold) {
            drawFreeHand(dom.ctx, state.brushColor, state.brushType, state.brushSize, getMousePosition(e,dom.canv));
        }
        return;
    });
    dom.canv.addEventListener("mouseup", function(e){
        state.mouseHold = false;
        return;
    });
    
    // Touch events - got the e.touches[0] from Stack Overflow! //
    dom.canv.addEventListener("touchstart", function(e){
        state.mouseHold = true;
        return;
    });
    dom.canv.addEventListener("touchmove", function(e){
        if (state.mouseHold) {
            drawFreeHand(dom.ctx, state.brushColor, state.brushType, state.brushSize, getMousePosition(e.touches[0],dom.canv));
        }
        return;
    });
    dom.canv.addEventListener("touchend", function(e){
        state.mouseHold = false;
        return;
    });
    
    // Event for clearing the page //
    dom.clearBtn.addEventListener("click", function(){
        clearCanvas(dom.ctx);
        return;
    });
    
    return;
}

/////////////////////////////////////////////////////////////////
// Define component functions //
/////////////////////////////////////////////////////////////////

function initializePaintBrush() {
    // Initializes DOM paintbrush properties based on default state //
    dom.brushSizeElement.value = state.brushSize;
    dom.brushSizeDisplay.innerHTML = state.brushSize;
    dom.brushSizePrev.style.backgroundColor = toRGB(state.brushColor);
    dom.brushSizePrev.style.width = state.brushSize + "px";
    dom.brushSizePrev.style.height = state.brushSize + "px";
    if (state.brushType == "circle") {
        dom.circleRadio.checked = true;
        dom.brushSizePrev.style.borderRadius = "100%";
    }
    else {
        dom.squareRadio.checked = true;
        dom.brushSizePrev.style.borderRadius = "0%";
    }
    dom.brushRedElement.value = state.brushColor[0];
    dom.brushRedDisplay.innerHTML = state.brushColor[0];
    dom.brushGreenElement.value = state.brushColor[1];
    dom.brushGreenDisplay.innerHTML = state.brushColor[1];
    dom.brushBlueElement.value = state.brushColor[2];
    dom.brushBlueDisplay.innerHTML = state.brushColor[2];
    dom.brushColorPrev.style.backgroundColor = toRGB(state.brushColor);
    return;
}

function bindBrushStateListeners() {
    // Binding brush DOM elements to state parameters //
    dom.brushSizeElement.addEventListener("change", function(){
        state.brushSize = dom.brushSizeElement.value;
        dom.brushSizeDisplay.innerHTML = state.brushSize;
        dom.brushSizePrev.style.width = state.brushSize + "px";
        dom.brushSizePrev.style.height = state.brushSize + "px";
        return;
    });
    dom.circleRadio.addEventListener("click", function(){
        state.brushType = "circle";
        dom.brushSizePrev.style.borderRadius = "100%";
        return;
    });
    dom.squareRadio.addEventListener("click", function(){
        state.brushType = "square";
        dom.brushSizePrev.style.borderRadius = "0%";
        return;
    });
    dom.brushRedElement.addEventListener("change", function(){
        state.brushColor[0] = dom.brushRedElement.value;
        dom.brushRedDisplay.innerHTML = state.brushColor[0];
        dom.brushColorPrev.style.backgroundColor = toRGB(state.brushColor);
        dom.brushSizePrev.style.backgroundColor = toRGB(state.brushColor);
        return;
    });
    dom.brushGreenElement.addEventListener("change", function(){
        state.brushColor[1] = dom.brushGreenElement.value;
        dom.brushGreenDisplay.innerHTML = state.brushColor[1];
        dom.brushColorPrev.style.backgroundColor = toRGB(state.brushColor);
        dom.brushSizePrev.style.backgroundColor = toRGB(state.brushColor);
        return;
    });
    dom.brushBlueElement.addEventListener("change", function(){
        state.brushColor[2] = dom.brushBlueElement.value;
        dom.brushBlueDisplay.innerHTML = state.brushColor[2];
        dom.brushColorPrev.style.backgroundColor = toRGB(state.brushColor);
        dom.brushSizePrev.style.backgroundColor = toRGB(state.brushColor);
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
    context.fillStyle = toRGB(color);
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

function toRGB(color) {
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
}

/////////////////////////////////////////////////////////////////
// Run the Setup function... //
/////////////////////////////////////////////////////////////////

setup();

