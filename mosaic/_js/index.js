/* global Image */
// This maintains any state variables //

var state_vals = {
    worker: null,
    fileName: null,
    img: null,
    imgHeight: 0, imgWidth: 0,
    displayHeight: 0, displayWidth: 0,
    rotation: 0.0,
    tile_margin: 5
};

// This handles the web worker events //

window.onload = function(){
    var worker = new Worker("_js/rgb.js");
    state_vals['worker'] = worker;
    state_vals['worker'].addEventListener("message", workerCompletion, false);
};

function workerCompletion(message) {
    if (message.data.command == "done") {
        drawMosaic(message.data.rgbSpots);
    }
}

// Root function for handling the image loading //

function handleFile(files) {
    initializeImage(files);
    return;
}

// This handles the image loading and enables the buttons //

function initializeImage(files) {
    var canvasArea = document.getElementById('canvasArea');
    var canvas = document.getElementById('img_canvas');
    var overlay = document.getElementById('overlay_canvas');
    var ctxCanvas = canvas.getContext('2d');
    
    state_vals["img"] = null;
    state_vals["img"] = new Image();
    state_vals["img"].onload = function() {
        var height = state_vals["img"].height;
        var width = state_vals["img"].width;
        canvasArea.style.height = height + "px";
        canvasArea.style.width = width + "px";
        canvas.height = height;
        canvas.width = width;
        overlay.height = height;
        overlay.width = width;
        state_vals["imgHeight"] = height;
        state_vals["imgWidth"] = width;
        state_vals["displayHeight"] = height;
        state_vals["displayWidth"] = width;
        ctxCanvas.drawImage(state_vals["img"], 0, 0);
        
        var generateBtn = document.getElementById('generateMosaic');
        var largerBtn = document.getElementById('largerImg');
        var smallerBtn = document.getElementById('smallerImg');
        var rotateLeftBtn = document.getElementById('rotateLeft');
        var rotateRightBtn = document.getElementById('rotateRight');
        generateBtn.disabled = false;
        largerBtn.disabled = false;
        smallerBtn.disabled = false;
        rotateLeftBtn.disabled = false;
        rotateRightBtn.disabled = false;
    };
    state_vals["img"].src = window.URL.createObjectURL(files[0]);
    return;
}

// This handles redrawing the image on the canvas due to changes in size or rotation //

function updateImage(direction, sizeChange) {
    var canvasArea = document.getElementById('canvasArea');
    var canvas = document.getElementById('img_canvas');
    var overlay = document.getElementById('overlay_canvas');
    var ctxCanvas = canvas.getContext('2d');
    if (direction == "right") {
        state_vals["rotation"] = state_vals["rotation"] + 90.0;
        if (state_vals["rotation"] >= 360) {state_vals["rotation"] = state_vals["rotation"] - 360;}
    } else if (direction == "left") {
        state_vals["rotation"] = state_vals["rotation"] - 90.0;
        if (state_vals["rotation"] < 0) {state_vals["rotation"] = state_vals["rotation"] + 360;}
    }
    var mult = 1.0;
    if (sizeChange == "larger") {
        mult = (1.0/0.9);
    } else if (sizeChange == "smaller") {
        mult = (0.9/1.0);
    }
    var newHeight = Math.round(state_vals["displayHeight"] * mult, 0);
    var newWidth = Math.round(state_vals["displayWidth"] * mult, 0);
    state_vals["displayHeight"] = newHeight;
    state_vals["displayWidth"] = newWidth;
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    if ((state_vals["rotation"] == 0.0) || (state_vals["rotation"] == 180.0)) {
        canvasArea.style.height = state_vals["displayHeight"] + "px";
        canvasArea.style.width = state_vals["displayWidth"] + "px";
        canvas.height = state_vals["displayHeight"];
        canvas.width = state_vals["displayWidth"];
        overlay.height = state_vals["displayHeight"];
        overlay.width = state_vals["displayWidth"];
    } else {
        canvasArea.style.height = state_vals["displayWidth"] + "px";
        canvasArea.style.width = state_vals["displayHeight"] + "px";
        canvas.height = state_vals["displayWidth"];
        canvas.width = state_vals["displayHeight"];
        overlay.height = state_vals["displayWidth"];
        overlay.width = state_vals["displayHeight"];
    }
    
    ctxCanvas.save();
    ctxCanvas.rotate(state_vals["rotation"]*Math.PI/180);
    if (state_vals["rotation"] == 0.0) {
        ctxCanvas.drawImage(state_vals["img"], 0, 0, newWidth, newHeight);
    } else if (state_vals["rotation"] == 90.0) {
        ctxCanvas.drawImage(state_vals["img"], 0, -newHeight, newWidth, newHeight);
    } else if (state_vals["rotation"] == 180.0) {
        ctxCanvas.drawImage(state_vals["img"], -newWidth, -newHeight, newWidth, newHeight);
    } else {
        ctxCanvas.drawImage(state_vals["img"], -newWidth, 0, newWidth, newHeight);
    }
    ctxCanvas.restore();
    return;
}

// This generates the array of spots, gets the pixels for each, sends the whole set to the web worker //

function generateMosaic() {
    var generateBtn = document.getElementById('generateMosaic');
    var largerBtn = document.getElementById('largerImg');
    var smallerBtn = document.getElementById('smallerImg');
    var rotateLeftBtn = document.getElementById('rotateLeft');
    var rotateRightBtn = document.getElementById('rotateRight');
    generateBtn.disabled = true;
    largerBtn.disabled = true;
    smallerBtn.disabled = true;
    rotateLeftBtn.disabled = true;
    rotateRightBtn.disabled = true;
        
    var canvas = document.getElementById('img_canvas');
    var ctxCanvas = canvas.getContext('2d');

    var nTilesWidthUser = Number(document.getElementById("nTilesWidth").value);
    if ((isNaN(nTilesWidthUser)==true) || (nTilesWidthUser < 1) || (nTilesWidthUser > 100)) {
        alert("Not a valid number of tiles in X direction");
        generateBtn.disabled = false;
        largerBtn.disabled = false;
        smallerBtn.disabled = false;
        rotateLeftBtn.disabled = false;
        rotateRightBtn.disabled = false;
    } else {
        var nTilesWidth = nTilesWidthUser;
        var tileWidth = Math.ceil(canvas.width / nTilesWidth);
        var tileHeight = tileWidth;
        var nTilesHeight = Math.ceil(canvas.height / tileHeight);
        
        var pts = [];
        var point = {};
        var imgData;
        var tlX, tlY;
        for (var i = 0; i < nTilesHeight; i++) {
            for (var j = 0; j < nTilesWidth; j++) {
                tlX = (j*tileWidth);
                tlY = (i*tileHeight);
                point = {'tlX': tlX, 'tlY': tlY, 'delX': tileWidth, 'delY': tileHeight};
                pts.push(point);
            }
        }
        imgData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
        var contents = {'pts': pts, 'imgData': imgData, 'width': canvas.width, 'height': canvas.height};
        state_vals['worker'].postMessage({"contents": contents});
    }
    return;
}

// This draws the points after the list is returned from the webworker //

function drawMosaic(rgbSpots) {
    var overlay = document.getElementById('overlay_canvas');
    var ctxOverlay = overlay.getContext('2d');
    
    var generateBtn = document.getElementById('generateMosaic');
    var largerBtn = document.getElementById('largerImg');
    var smallerBtn = document.getElementById('smallerImg');
    var rotateLeftBtn = document.getElementById('rotateLeft');
    var rotateRightBtn = document.getElementById('rotateRight');
    
    var nSpots = rgbSpots.length;
    var rgbFillStr = "";
    for (var n = 0; n < nSpots; n++) {
        rgbFillStr = "rgb(" + rgbSpots[n]['aveRGB']['R'] + "," + rgbSpots[n]['aveRGB']['G'] + "," + rgbSpots[n]['aveRGB']['B'] + ")";
        ctxOverlay.lineWidth = state_vals['tileMargin'];
        ctxOverlay.strokeStyle = "rgb(50,50,50)";
        ctxOverlay.fillStyle = rgbFillStr;
        ctxOverlay.fillRect(rgbSpots[n]['tlX'], rgbSpots[n]['tlY'], rgbSpots[n]['delX'], rgbSpots[n]['delY']);
        ctxOverlay.strokeRect(rgbSpots[n]['tlX'], rgbSpots[n]['tlY'], rgbSpots[n]['delX'], rgbSpots[n]['delY']);
    }
    
    generateBtn.disabled = false;
    largerBtn.disabled = false;
    smallerBtn.disabled = false;
    rotateLeftBtn.disabled = false;
    rotateRightBtn.disabled = false;
    return;
}

