/////////////////////////////////////////////////////////////////
// Global state and DOM references //
/////////////////////////////////////////////////////////////////

var state = {
    mouseHold: false,
    canvasWidth: 600,
    canvasHeight: 400,
    brushType: "square",
    brushSize: 5,
    brushColor: [0,0,255],
    isNewShape: true,
    numShapes: 0,
    lineThickness: 5,
    lineColor: [0,0,0],
    shapeColor: [0,255,0],
    isFilled: true
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
    clearBtn: document.getElementById("clearBtn"),
    svg: document.getElementById("trace"),
    closeBtn: document.getElementById("closePath"),
    finishBtn: document.getElementById("finishShape"),
    addBtn: document.getElementById("addToCanvas")
};

/////////////////////////////////////////////////////////////////
// Define setup function //
/////////////////////////////////////////////////////////////////

function setup() {
    // Initializes canvas and svg //
    dom.canv.setAttribute("width", state.canvasWidth);
    dom.canv.setAttribute("height", state.canvasHeight);
    dom.svg.setAttribute("width", state.canvasWidth);
    dom.svg.setAttribute("height", state.canvasHeight);
    
    initializePaintBrush();
    bindBrushStateListeners();
    bindCanvasListeners();
    
    bindSvgListeners();
    
    // Events for buttons //
    dom.clearBtn.addEventListener("click", function(){
        clearCanvas();
        return;
    });
    dom.closeBtn.addEventListener("click", function(){
        closeLastShape();
        state.isNewShape = true;
        return;
    });
    dom.finishBtn.addEventListener("click", function(){
        state.isNewShape = true;
        return;
    });
    dom.addBtn.addEventListener("click", function(){
        svgToCanvas();
        clearSVG();
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

function bindCanvasListeners() {
    // Mouse events for traditional desktop //
    dom.canv.addEventListener("mousedown", function(e){
        state.mouseHold = true;
        return;
    });
    dom.canv.addEventListener("mousemove", function(e){
        if (state.mouseHold) {
            drawFreeHand(getCanvasPosition(e,dom.canv));
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
            e.preventDefault();
            drawFreeHand(getCanvasPosition(e.touches[0],dom.canv));
        }
        return;
    });
    dom.canv.addEventListener("touchend", function(e){
        state.mouseHold = false;
        return;
    });
    return;
}

function bindSvgListeners() {
    // Mouse events for traditional desktop //
    dom.svg.addEventListener("mouseup", function(e){
        drawShape(getSVGPosition(e, dom.svg));
        return;
    });
    
    // Touch events - got the e.touches[0] from Stack Overflow! //
    dom.svg.addEventListener("touchend", function(e){
        drawShape(getSVGPosition(e.touches[0], dom.svg));
        return;
    });
    return;
}

function getCanvasPosition(e, canvas) {
    var X = e.pageX - canvas.offsetLeft;
    var Y = e.pageY - canvas.offsetTop;
    return [X,Y];
}

function getSVGPosition(e, svg) {
    var dim = svg.getBoundingClientRect();
    var X = e.clientX - dim.left;
    var Y = e.clientY - dim.top;
    return [X,Y];
}

function drawFreeHand(center) {
    dom.ctx.fillStyle = toRGB(state.brushColor);
    if (state.brushType == "circle") {
        var rad = Math.round((state.brushSize)/2);
        dom.ctx.beginPath();
        dom.ctx.arc(center[0],center[1],rad,0,2.0*Math.PI);
        dom.ctx.closePath();
        dom.ctx.fill();
    }
    else if (state.brushType == "square") {
        var cornerX = center[0] - Math.round((state.brushSize)/2);
        var cornerY = center[1] - Math.round((state.brushSize)/2);
        dom.ctx.beginPath();
        dom.ctx.rect(cornerX,cornerY,state.brushSize,state.brushSize);
        dom.ctx.closePath();
        dom.ctx.fill();
    }
    return;
}

function drawShape(position) {
    var shape;
    var dStr;
    if (state.isNewShape) {
        state.numShapes += 1;
        state.isNewShape = false;
        dStr = "M" + Math.round(position[0]) + "," + Math.round(position[1]);
        shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shape.setAttribute("stroke", toRGB(state.lineColor));
        shape.setAttribute("stroke-width", state.lineThickness);
        if (state.isFilled) {
            shape.setAttribute("fill", toRGB(state.shapeColor));
        }
        else {
            shape.setAttribute("fill", "none");
        }
        shape.setAttribute("id","s" + state.numShapes);
        shape.setAttribute("d",dStr);
        dom.svg.appendChild(shape);
    }
    else {
        shape = document.getElementById("s" + state.numShapes);
        dStr = shape.getAttribute("d");
        dStr += " L" + Math.round(position[0]) + "," + Math.round(position[1]);
        shape.setAttribute("d",dStr);
    }
    return;
}

function closeLastShape() {
    if (state.isNewShape === false) {
        var shape = document.getElementById("s" + state.numShapes);
        var dStr = shape.getAttribute("d");
        var dStrParts = dStr.split(" ");
        if (dStrParts.length > 1) {
            dStr += " Z";
            shape.setAttribute("d",dStr);
        }
    }
}

function svgToCanvas() {
    //took this code from MDN: "Drawing DOM objects into a canvas" //
    var xml = new XMLSerializer().serializeToString(dom.svg);
    var DOMURL = window.URL || window.webkitURL || window;
    var img = new Image();
    var data = new Blob([xml], {type: 'image/svg+xml'});
    var url = DOMURL.createObjectURL(data);
    img.onload = function(){
        dom.ctx.drawImage(img,0,0);
        DOMURL.revokeObjectURL(url);
    };
    img.src = url;
}

function clearCanvas() {
    dom.ctx.fillStyle = "#FFFFFF";
    dom.ctx.beginPath();
    dom.ctx.rect(0,0,state.canvasWidth,state.canvasHeight);
    dom.ctx.closePath();
    dom.ctx.fill();
    return;
}

function clearSVG() {
    var shape;
    for (var i = 1; i <= state.numShapes; i++) {
        shape = document.getElementById("s" + i);
        shape.remove();
    }
    state.numShapes = 0;
    return;
}

function toRGB(color) {
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
}

/////////////////////////////////////////////////////////////////
// Run the Setup function... //
/////////////////////////////////////////////////////////////////

setup();

