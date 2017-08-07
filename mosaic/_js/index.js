/* global Image */
// This maintains any state variables //

var state_vals = {
    fileName: null,
    img: null,
    imgHeight: 0, imgWidth: 0,
    displayHeight: 0, displayWidth: 0,
    rotation: 0.0,
    RGB_XYZ_white: {'Xref':100.0,'Yref':100.0,'Zref':100.0},
    XYZ_Lab_white: {'Xref':95.047,'Yref':100.000,'Zref':108.883}
};

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

// This will be the root function for executing the mosaic drawing //

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
    var overlay = document.getElementById('overlay_canvas');
    var ctxCanvas = canvas.getContext('2d');
    var ctxOverlay = overlay.getContext('2d');
    
    var nTilesWidthUser = Number(document.getElementById("nTilesWidth").value);
    if ((isNaN(nTilesWidthUser)==true) || (nTilesWidthUser < 1) || (nTilesWidthUser > 100)) {
        alert("Not a valid number of tiles in X direction");
    } else {
        var nTilesWidth = nTilesWidthUser;
        var tileWidth = Math.ceil(canvas.width / nTilesWidth);
        var tileHeight = tileWidth;
        var nTilesHeight = Math.ceil(canvas.height / tileHeight);
        var tileMargin = 5;
        
        var pixelArray = [];
        var aveRGB = [];
        var tlX, tlY;
        var rgbFillStr = "";
        for (var i = 0; i < nTilesHeight; i++) {
            for (var j = 0; j < nTilesWidth; j++) {
                tlX = (j*tileWidth);
                tlY = (i*tileHeight);
                pixelArray = ctxCanvas.getImageData(tlX, tlY, tileWidth, tileHeight).data;
                aveRGB = averageRGB(pixelArray);
                rgbFillStr = "rgb(" + aveRGB['R'] + "," + aveRGB['G'] + "," + aveRGB['B'] + ")";
                ctxOverlay.lineWidth = tileMargin;
                ctxOverlay.strokeStyle = "rgb(50,50,50)";
                ctxOverlay.fillStyle = rgbFillStr;
                ctxOverlay.fillRect(tlX, tlY, tileWidth, tileHeight);
                ctxOverlay.strokeRect(tlX, tlY, tileWidth, tileHeight);
            }
        }
    }
    generateBtn.disabled = false;
    largerBtn.disabled = false;
    smallerBtn.disabled = false;
    rotateLeftBtn.disabled = false;
    rotateRightBtn.disabled = false;
    return;
}

// This averages the RGB values over an entire spot //

function averageRGB(pixelArray) {
    var aveRGB = {'R':0,'G':0,'B':0,'X':0,'Y':0,'Z':0,'L*':0,'a*':0,'b*':0};
    var n_pixels = Math.round(pixelArray.length/4);
    var RGB, XYZ, Lab = [];
    for (var k=0, len=pixelArray.length; k<len; k+=4) {
        RGB = [pixelArray[k+0],pixelArray[k+1],pixelArray[k+2]];
        XYZ = RGBtoXYZ(RGB);
        Lab = XYZtoLab(XYZ);
        aveRGB['L*'] += Lab[0];
        aveRGB['a*'] += Lab[1];
        aveRGB['b*'] += Lab[2];
    }
    aveRGB['L*'] = aveRGB['L*']/n_pixels;
    aveRGB['a*'] = aveRGB['a*']/n_pixels;
    aveRGB['b*'] = aveRGB['b*']/n_pixels;
    var XYZ_ave = LabToXYZ([aveRGB['L*'],aveRGB['a*'],aveRGB['b*']]);
    aveRGB['X'] = XYZ_ave[0];
    aveRGB['Y'] = XYZ_ave[1];
    aveRGB['Z'] = XYZ_ave[2];
    var RGB_ave = XYZtoRGB(XYZ_ave);
    aveRGB['R'] = RGB_ave[0];
    aveRGB['G'] = RGB_ave[1];
    aveRGB['B'] = RGB_ave[2];
    return aveRGB;
}

// This converts the RGB value to CIE XYZ //

function RGBtoXYZ([R,G,B]) {
    var Rn = R/255;
    var Gn = G/255;
    var Bn = B/255;
    var r = Rn > 0.04045 ? Math.pow((Rn + 0.055)/1.055, 2.4) : (Rn/12.92);
    var g = Gn > 0.04045 ? Math.pow((Gn + 0.055)/1.055, 2.4) : (Gn/12.92);
    var b = Bn > 0.04045 ? Math.pow((Bn + 0.055)/1.055, 2.4) : (Bn/12.92);
    var xn = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
    var yn = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
    var zn = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);
    var X = xn * state_vals['RGB_XYZ_white']['Xref'];
    var Y = yn * state_vals['RGB_XYZ_white']['Yref'];
    var Z = zn * state_vals['RGB_XYZ_white']['Zref'];
    return [X,Y,Z];
}

function XYZtoRGB([X,Y,Z]) {
    var xn = X / state_vals['RGB_XYZ_white']['Xref'];
    var yn = Y / state_vals['RGB_XYZ_white']['Yref'];
    var zn = Z / state_vals['RGB_XYZ_white']['Zref'];
    var r = (xn * 3.2406) + (yn * -1.5372) + (zn * -0.4986);
    var g = (xn * -0.9689) + (yn * 1.8758) + (zn * 0.0415);
    var b = (xn * 0.0557) + (yn * -0.2040) + (zn * 1.0570);
    var Rn = r > 0.0031308 ? 1.055*Math.pow(r,(1.0/2.4)) - 0.055 : (r/12.92);
    var Gn = g > 0.0031308 ? 1.055*Math.pow(g,(1.0/2.4)) - 0.055 : (g/12.92);
    var Bn = b > 0.0031308 ? 1.055*Math.pow(b,(1.0/2.4)) - 0.055 : (b/12.92);
    var R = Math.round(Rn * 255);
    var G = Math.round(Gn * 255);
    var B = Math.round(Bn * 255);
    return [R,G,B];
}

// This converts the CIE XYZ to Lab //

function XYZtoLab([X,Y,Z]) {
    var xn = X / state_vals['XYZ_Lab_white']['Xref'];
    var yn = Y / state_vals['XYZ_Lab_white']['Yref'];
    var zn = Z / state_vals['XYZ_Lab_white']['Zref'];
    var epsilon = 0.008856;
    var kappa = 903.3;
    var fx = xn > epsilon ? Math.pow(xn, (1.0/3.0)) : (kappa*xn + 16)/116;
    var fy = yn > epsilon ? Math.pow(yn, (1.0/3.0)) : (kappa*yn + 16)/116;
    var fz = zn > epsilon ? Math.pow(zn, (1.0/3.0)) : (kappa*zn + 16)/116;
    var L = 116*fy - 16;
    var a = 500*(fx - fy);
    var b = 200*(fy - fz);
    return [L,a,b];
}

function LabToXYZ([L,a,b]) {
    var fy = (L + 16)/116;
    var fx = a/500 + fy;
    var fz = fy - (b/200);
    var epsilon = 0.008856;
    var kappa = 903.3;
    var xn = Math.pow(fx,3) > epsilon ? Math.pow(fx,3) : (116*fx - 16)/kappa;
    var yn = L > (kappa*epsilon) ? Math.pow(((L + 16)/116),3) : L/kappa;
    var zn = Math.pow(fz,3) > epsilon ? Math.pow(fz,3) : (116*fz - 16)/kappa;
    var X = xn * state_vals['XYZ_Lab_white']['Xref'];
    var Y = yn * state_vals['XYZ_Lab_white']['Yref'];
    var Z = zn * state_vals['XYZ_Lab_white']['Zref'];
    return[X,Y,Z];
}
