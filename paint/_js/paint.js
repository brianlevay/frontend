/////////////////////////////////////////////////////////////////
// Global state and DOM references //
/////////////////////////////////////////////////////////////////

var state = {
    option: "painting",
    mouseHold: false,
    canvasWidth: 500,
    canvasHeight: 400,
    brushType: "square",
    brushSize: 5,
    brushColor: [0,0,255],
    isNewShape: true,
    numShapes: 0,
    lineThickness: 5,
    lineColor: [0,0,0],
    fillColor: [0,255,0],
    isShapeFilled: true
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
    addBtn: document.getElementById("addToCanvas"),
    shapeThicknessElement: document.getElementById("shapeLineThickness"),
    shapeThicknessDisplay: document.getElementById("shapeLineThicknessVal"),
    shapeLineStylePrev: document.getElementById("shapeLineStylePrev"),
    shapeLineRedElement: document.getElementById("shapeLineRed"),
    shapeLineRedDisplay: document.getElementById("shapeLineRedVal"),
    shapeLineGreenElement: document.getElementById("shapeLineGreen"),
    shapeLineGreenDisplay: document.getElementById("shapeLineGreenVal"),
    shapeLineBlueElement: document.getElementById("shapeLineBlue"),
    shapeLineBlueDisplay: document.getElementById("shapeLineBlueVal"),
    shapeLineColorPrev: document.getElementById("shapeLineColorPrev"),
    emptyRadio: document.getElementById("emptyRadio"),
    filledRadio: document.getElementById("filledRadio"),
    shapeFillRedElement: document.getElementById("shapeFillRed"),
    shapeFillRedDisplay: document.getElementById("shapeFillRedVal"),
    shapeFillGreenElement: document.getElementById("shapeFillGreen"),
    shapeFillGreenDisplay: document.getElementById("shapeFillGreenVal"),
    shapeFillBlueElement: document.getElementById("shapeFillBlue"),
    shapeFillBlueDisplay: document.getElementById("shapeFillBlueVal"),
    shapeFillPrev: document.getElementById("shapeFillPrev"),
    
    canvasArea: document.getElementById("canvasArea"),
    canvControls: document.getElementById("canvControls"),
    svgControls: document.getElementById("svgControls"),
    canvTools: document.getElementById("canvTools"),
    svgTools: document.getElementById("svgTools"),
    selectPainting: document.getElementById("selectPainting"),
    selectShapes: document.getElementById("selectShapes")
    
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
    dom.canvasArea.style.height = state.canvasHeight + "px";
    dom.canvasArea.style.width = state.canvasWidth + "px";
    
    initializePaintBrush();
    bindBrushStateListeners();
    bindCanvasListeners();
    
    initializeShape();
    bindShapeStateListeners();
    bindSvgListeners();
    
    // Sets initial painting vs shapes visibilities //
    changeToOption(state.option);
    
    // Events for buttons //
    dom.selectPainting.addEventListener("click", function(){
        changeToOption("painting");
        return;
    });
    dom.selectShapes.addEventListener("click", function(){
        changeToOption("shapes");
        return;
    });
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
        state.isNewShape = true;
        changeToOption("painting");
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

function initializeShape() {
    // Initializes DOM shape properties based on default state //
    dom.shapeThicknessElement.value = state.lineThickness;
    dom.shapeThicknessDisplay.innerHTML = state.lineThickness;
    dom.shapeLineStylePrev.style.backgroundColor = toRGB(state.lineColor);
    dom.shapeLineStylePrev.style.width = "100%";
    dom.shapeLineStylePrev.style.height = state.lineThickness + "px";
    
    dom.shapeLineRedElement.value = state.lineColor[0];
    dom.shapeLineRedDisplay.innerHTML = state.lineColor[0];
    dom.shapeLineGreenElement.value = state.lineColor[1];
    dom.shapeLineGreenDisplay.innerHTML = state.lineColor[1];
    dom.shapeLineBlueElement.value = state.lineColor[2];
    dom.shapeLineBlueDisplay.innerHTML = state.lineColor[2];
    dom.shapeLineColorPrev.style.backgroundColor = toRGB(state.lineColor);
    
    dom.shapeFillRedElement.value = state.fillColor[0];
    dom.shapeFillRedDisplay.innerHTML = state.fillColor[0];
    dom.shapeFillGreenElement.value = state.fillColor[1];
    dom.shapeFillGreenDisplay.innerHTML = state.fillColor[1];
    dom.shapeFillBlueElement.value = state.fillColor[2];
    dom.shapeFillBlueDisplay.innerHTML = state.fillColor[2];
    
    if (state.isShapeFilled == true) {
        dom.filledRadio.checked = true;
        dom.shapeFillPrev.style.backgroundColor = toRGB(state.fillColor);
        dom.shapeFillPrev.innerHTML = "";
    }
    else {
        dom.emptyRadio.checked = true;
        dom.shapeFillPrev.style.backgroundColor = "white";
        dom.shapeFillPrev.innerHTML = "none";
    }
    
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
            drawFreeHand(getPosition(e,dom.canv));
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
            //e.preventDefault();
            drawFreeHand(getPosition(e.touches[0],dom.canv));
        }
        return;
    });
    dom.canv.addEventListener("touchend", function(e){
        state.mouseHold = false;
        return;
    });
    return;
}

function bindShapeStateListeners() {
    // Binding shape DOM elements to state parameters //
    dom.shapeThicknessElement.addEventListener("change", function(){
        state.lineThickness = dom.shapeThicknessElement.value;
        dom.shapeThicknessDisplay.innerHTML = state.lineThickness;
        dom.shapeLineStylePrev.style.height = state.lineThickness + "px";
        return;
    });
    dom.shapeLineRedElement.addEventListener("change", function(){
        state.lineColor[0] = dom.shapeLineRedElement.value;
        dom.shapeLineRedDisplay.innerHTML = state.lineColor[0];
        dom.shapeLineColorPrev.style.backgroundColor = toRGB(state.lineColor);
        dom.shapeLineStylePrev.style.backgroundColor = toRGB(state.lineColor);
        return;
    });
    dom.shapeLineGreenElement.addEventListener("change", function(){
        state.lineColor[1] = dom.shapeLineGreenElement.value;
        dom.shapeLineGreenDisplay.innerHTML = state.lineColor[1];
        dom.shapeLineColorPrev.style.backgroundColor = toRGB(state.lineColor);
        dom.shapeLineStylePrev.style.backgroundColor = toRGB(state.lineColor);
        return;
    });
    dom.shapeLineBlueElement.addEventListener("change", function(){
        state.lineColor[2] = dom.shapeLineBlueElement.value;
        dom.shapeLineBlueDisplay.innerHTML = state.lineColor[2];
        dom.shapeLineColorPrev.style.backgroundColor = toRGB(state.lineColor);
        dom.shapeLineStylePrev.style.backgroundColor = toRGB(state.lineColor);
        return;
    });
    dom.filledRadio.addEventListener("click", function(){
        state.isShapeFilled = true;
        dom.shapeFillPrev.style.backgroundColor = toRGB(state.fillColor);
        dom.shapeFillPrev.innerHTML = "";
        return;
    });
    dom.emptyRadio.addEventListener("click", function(){
        state.isShapeFilled = false;
        dom.shapeFillPrev.style.backgroundColor = "white";
        dom.shapeFillPrev.innerHTML = "none";
        return;
    });
    dom.shapeFillRedElement.addEventListener("change", function(){
        state.fillColor[0] = dom.shapeFillRedElement.value;
        dom.shapeFillRedDisplay.innerHTML = state.fillColor[0];
        if (state.isShapeFilled) {
            dom.shapeFillPrev.style.backgroundColor = toRGB(state.fillColor);
        }
        return;
    });
    dom.shapeFillGreenElement.addEventListener("change", function(){
        state.fillColor[1] = dom.shapeFillGreenElement.value;
        dom.shapeFillGreenDisplay.innerHTML = state.fillColor[1];
        if (state.isShapeFilled) {
            dom.shapeFillPrev.style.backgroundColor = toRGB(state.fillColor);
        }
        return;
    });
    dom.shapeFillBlueElement.addEventListener("change", function(){
        state.fillColor[2] = dom.shapeFillBlueElement.value;
        dom.shapeLineBlueDisplay.innerHTML = state.fillColor[2];
        if (state.isShapeFilled) {
            dom.shapeFillPrev.style.backgroundColor = toRGB(state.fillColor);
        }
        return;
    });
    return;
}

function bindSvgListeners() {
    // Mouse events for traditional desktop //
    dom.svg.addEventListener("mouseup", function(e){
        drawShape(getPosition(e, dom.svg));
        return;
    });
    
    // Touch events - got the e.touches[0] from Stack Overflow! //
    dom.svg.addEventListener("touchend", function(e){
        drawShape(getPosition(e.touches[0], dom.svg));
        return;
    });
    return;
}

function getPosition(e, target) {
    var dim = target.getBoundingClientRect();
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
        if (state.isShapeFilled) {
            shape.setAttribute("fill", toRGB(state.fillColor));
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

function changeToOption(newOption) {
    if (newOption == "painting") {
        state.option = "painting";
        dom.svg.style.zIndex = 1;
        dom.svgControls.style.display = "none";
        dom.svgTools.style.display = "none";
        dom.canv.style.zIndex = 2;
        dom.canvControls.style.display = "block";
        dom.canvTools.style.display = "block";
    }
    else {
        state.option = "shapes";
        dom.svg.style.zIndex = 2;
        dom.svgControls.style.display = "block";
        dom.svgTools.style.display = "block";
        dom.canv.style.zIndex = 1;
        dom.canvControls.style.display = "none";
        dom.canvTools.style.display = "none";
    }
    return;
}

/////////////////////////////////////////////////////////////////
// Run the Setup function... //
/////////////////////////////////////////////////////////////////

setup();

