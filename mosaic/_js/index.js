/* global Image */
// This maintains any state variables //

var state_vals = {
    fileName: null,
    img: null,
    imgHeight: 0, imgWidth: 0,
    displayHeight: 0, displayWidth: 0,
    rotation: 0.0
};

// TOP LEVEL FUNCTION //
// This function is called from the onchange for the file input //

function handleFile(files) {
    initializeImage(files);
    return;
}

// This function loads the image and resets the fields and sliders as needed //

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
        var zoomInBtn = document.getElementById('zoomIn');
        var zoomOutBtn = document.getElementById('zoomOut');
        var rotateLeftBtn = document.getElementById('rotateLeft');
        var rotateRightBtn = document.getElementById('rotateRight');
        generateBtn.disabled = false;
        zoomInBtn.disabled = false;
        zoomOutBtn.disabled = false;
        rotateLeftBtn.disabled = false;
        rotateRightBtn.disabled = false;
    };
    state_vals["img"].src = window.URL.createObjectURL(files[0]);
    return;
}

function generateMosaic() {
    return;
}

function updateImage(direction, zoom) {
    var canvasArea = document.getElementById('canvasArea');
    var canvas = document.getElementById('img_canvas');
    var overlay = document.getElementById('overlay_canvas');
    var ctxCanvas = canvas.getContext('2d');
    if (direction == "right") {
        state_vals["rotation"] = state_vals["rotation"] + 90.0;
    } else if (direction == "left") {
        state_vals["rotation"] = state_vals["rotation"] - 90.0;
    }
    var mult = 1.0;
    if (zoom == "in") {
        mult = (1.0/0.9);
    } else if (zoom == "out") {
        mult = (0.9/1.0);
    }
    state_vals["displayHeight"] = Math.round(state_vals["displayHeight"] * mult, 0);
    state_vals["displayWidth"] = Math.round(state_vals["displayWidth"] * mult, 0);
    
    //ctxCanvas.save();
    //ctxCanvas.translate(state_vals["displayWidth"]/2, state_vals["displayHeight"]/2);
    //ctxCanvas.rotate(state_vals["rotation"]*Math.PI/180);
    //ctxCanvas.translate(-state_vals["displayWidth"]/2, -state_vals["displayHeight"]/2);
    
    canvasArea.style.height = state_vals["displayHeight"] + "px";
    canvasArea.style.width = state_vals["displayWidth"] + "px";
    canvas.height = state_vals["displayHeight"];
    canvas.width = state_vals["displayWidth"];
    overlay.height = state_vals["displayHeight"];
    overlay.width = state_vals["displayWidth"];
    //ctxCanvas.drawImage(state_vals["img"], 0, 0, state_vals["imgWidth"], state_vals["imgHeight"]);
    ctxCanvas.drawImage(state_vals["img"], 0, 0, state_vals["displayWidth"], state_vals["displayHeight"]);
    //ctxCanvas.restore();
    return;
}



