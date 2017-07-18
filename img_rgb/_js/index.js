// This maintains any state variables //

var state_vals = {
    fileName: null,
    coreTopPx: 0, coreBottomPx: 0, coreLeftPx: 0, coreRightPx: 0,
    boundThickness: 10,
    RGB_XYZ_white: {'Xref':100.0,'Yref':100.0,'Zref':100.0},
    XYZ_Lab_white: {'Xref':95.047,'Yref':100.000,'Zref':108.883}
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
    var overlay = document.getElementById('overlay');
    var ctxCanvas = canvas.getContext('2d');
    var imgNew = new Image();
    imgNew.onload = function() {
        var height = imgNew.height;
        var width = imgNew.width;
        canvasArea.style.height = height + "px";
        canvasArea.style.width = width + "px";
        canvas.height = height;
        canvas.width = width;
        overlay.height = height;
        overlay.width = width;
        ctxCanvas.drawImage(imgNew, 0, 0);
        ///// for debugging /////////////////////////////////////
        //ctxCanvas.fillStyle = "rgb(131,124,98)";
        //ctxCanvas.fillRect(0,0,width,height);
        /////////////////////////////////////////////////////////
        state_vals["fileName"] = files[0];
        state_vals["coreTopPx"] = 0;
        state_vals["coreBottomPx"] = height;
        state_vals["coreLeftPx"] = 0;
        state_vals["coreRightPx"] = width;
        setSliderRanges();
        updateDivBounds();
        updateSliders();
        updateTxts();
        attachBoundListeners();
        resetPointFields();
        var generateBtn = document.getElementById('generatePts');
        generateBtn.disabled = false;
    };
    imgNew.src = window.URL.createObjectURL(files[0]);
    return;
}

// This function adjusts the max slider pixel values to match the size of the newly loaded image //

function setSliderRanges() {
    var topSlider = document.getElementById('topSlider');
    var bottomSlider = document.getElementById('bottomSlider');
    var leftSlider = document.getElementById('leftSlider');
    var rightSlider = document.getElementById('rightSlider');
    topSlider.max = state_vals["coreBottomPx"];
    bottomSlider.max = state_vals["coreBottomPx"];
    leftSlider.max = state_vals["coreRightPx"];
    rightSlider.max = state_vals["coreRightPx"];
    return;
}

// These functions update the sliders, text boxes, and divs for the core boundary based on the state values //

function updateDivBounds() {
    var topDiv = document.getElementById('imgTop');
    var bottomDiv = document.getElementById('imgBottom');
    var leftDiv = document.getElementById('imgLeft');
    var rightDiv = document.getElementById('imgRight');
    
    var width = state_vals["coreRightPx"] - state_vals["coreLeftPx"];
    var height = state_vals["coreBottomPx"] - state_vals["coreTopPx"];
    
    topDiv.style.width = (width+2*state_vals["boundThickness"]) + "px";
    topDiv.style.height = state_vals["boundThickness"] + "px";
    bottomDiv.style.width = (width+2*state_vals["boundThickness"]) + "px";
    bottomDiv.style.height = state_vals["boundThickness"] + "px";
    leftDiv.style.width = state_vals["boundThickness"] + "px";
    leftDiv.style.height = (height+2*state_vals["boundThickness"]) + "px";
    rightDiv.style.width = state_vals["boundThickness"] + "px";
    rightDiv.style.height = (height+2*state_vals["boundThickness"]) + "px";
    
    topDiv.style.left = (state_vals["coreLeftPx"]-state_vals["boundThickness"]) + "px";
    topDiv.style.top = (state_vals["coreTopPx"]-state_vals["boundThickness"]) + "px";
    bottomDiv.style.left = (state_vals["coreLeftPx"]-state_vals["boundThickness"]) + "px";
    bottomDiv.style.top = state_vals["coreBottomPx"] + "px";
    leftDiv.style.left = (state_vals["coreLeftPx"]-state_vals["boundThickness"]) + "px";
    leftDiv.style.top = (state_vals["coreTopPx"]-state_vals["boundThickness"]) + "px";
    rightDiv.style.left = state_vals["coreRightPx"] + "px";
    rightDiv.style.top = (state_vals["coreTopPx"]-state_vals["boundThickness"]) + "px";
    return;
}

function updateSliders() {
    var topSlider = document.getElementById('topSlider');
    var bottomSlider = document.getElementById('bottomSlider');
    var leftSlider = document.getElementById('leftSlider');
    var rightSlider = document.getElementById('rightSlider');
    topSlider.value = state_vals["coreTopPx"];
    bottomSlider.value = state_vals["coreBottomPx"];
    leftSlider.value = state_vals["coreLeftPx"];
    rightSlider.value = state_vals["coreRightPx"];
    return;
}

function updateTxts() {
    var topTxt = document.getElementById('topTxt');
    var bottomTxt = document.getElementById('bottomTxt');
    var leftTxt = document.getElementById('leftTxt');
    var rightTxt = document.getElementById('rightTxt');
    topTxt.value = state_vals["coreTopPx"];
    bottomTxt.value = state_vals["coreBottomPx"];
    leftTxt.value = state_vals["coreLeftPx"];
    rightTxt.value = state_vals["coreRightPx"];
    return;
}

// This function attaches the event handlers so that any slider or text change updates all boundary DOM elements as well as the state //

function attachBoundListeners() {
    var topSlider = document.getElementById('topSlider');
    var bottomSlider = document.getElementById('bottomSlider');
    var leftSlider = document.getElementById('leftSlider');
    var rightSlider = document.getElementById('rightSlider');
    var topTxt = document.getElementById('topTxt');
    var bottomTxt = document.getElementById('bottomTxt');
    var leftTxt = document.getElementById('leftTxt');
    var rightTxt = document.getElementById('rightTxt');
    
    topSlider.onchange = function(){
        updateBoundaries(topSlider, "coreTopPx", "coreBottomPx", "smaller");
    };
    bottomSlider.onchange = function(){
        updateBoundaries(bottomSlider, "coreBottomPx", "coreTopPx", "larger");
    };
    leftSlider.onchange = function(){
        updateBoundaries(leftSlider, "coreLeftPx", "coreRightPx", "smaller");
    };
    rightSlider.onchange = function(){
        updateBoundaries(rightSlider, "coreRightPx", "coreLeftPx", "larger");
    };
    topTxt.onchange = function(){
        updateBoundaries(topTxt, "coreTopPx", "coreBottomPx", "smaller");
    };
    bottomTxt.onchange = function(){
        updateBoundaries(bottomTxt, "coreBottomPx", "coreTopPx", "larger");
    };
    leftTxt.onchange = function(){
        updateBoundaries(leftTxt, "coreLeftPx", "coreRightPx", "smaller");
    };
    rightTxt.onchange = function(){
        updateBoundaries(rightTxt, "coreRightPx", "coreLeftPx", "larger");
    };
    return;
}

// This function actually does the state and DOM element updates for the boundaries

function updateBoundaries(element, boundary, opposite, constraint) {
    if (isNaN(Number(element.value)) == false) {
        if (constraint == "smaller") {
            if (element.value < state_vals[opposite]) {
                state_vals[boundary] = Math.round(Number(element.value));
            } else {
                state_vals[boundary] = state_vals[opposite];
            }
        } else if (constraint == "larger") {
            if (element.value > state_vals[opposite]) {
                state_vals[boundary] = Math.round(Number(element.value));
            } else {
                state_vals[boundary] = state_vals[opposite];
            }
        }
    }
    updateSliders();
    updateTxts();
    updateDivBounds();
    return;
}

// This clears out all text areas when a new image is loaded //

function resetPointFields() {
    var addedPoints = document.getElementById("addedPoints");
    var skippedPoints = document.getElementById("skippedPoints");
    var specialAreas = document.getElementById("specialAreas");
    var results = document.getElementById("results");
    
    addedPoints.value = "";
    skippedPoints.value = "";
    specialAreas.value = "";
    results.value = "";
    return;
}

// TOP LEVEL FUNCTION //
// This function is the one bound to the onclick event for "Generate Points" //
// The button is only active once an image loaded //

function generatePoints() {
    var geometry = getCoreGeometryInputs();
    if (geometry["error"] == false) {
        var pointsInMM = generatePointsInMM(geometry);
        var pointsInPX = generatePixelPositions(pointsInMM, geometry);
        var pointsRGB = getRGB(pointsInPX);
        var keys = ['downMM','crossMM','R','G','B','L*','a*','b*'];
        clearOverlay();
        drawPoints(pointsRGB);
        printResults(pointsRGB, keys);
    }
    return;
}

// This validates the core geometry inputs and converts to numbers //

function getCoreGeometryInputs() {
    var geometry = {};
    var hasError = false;
    var numeric = 0;
    geometry["downCoreLength"] = document.getElementById("lengthTxt").value;
    geometry["crossCoreWidth"] = document.getElementById("widthTxt").value;
    geometry["downCoreSpacing"] = document.getElementById("spacingTxt").value;
    geometry["crossCorePosition"] = document.getElementById("lateralTxt").value;
    geometry["downCoreSpot"] = document.getElementById("downSpotTxt").value;
    geometry["crossCoreSpot"] = document.getElementById("crossSpotTxt").value;
    for (var value in geometry) {
        if (geometry[value] == "") {
            hasError = true;
        } else {
            numeric = Number(geometry[value]);
            if (isNaN(numeric)) {
                hasError = true;
            } else {
                geometry[value] = numeric;
            }
        }
    }
    if (hasError == true) {
        alert("Missing or non-numeric entry in core size or point spacing field.");
        geometry["error"] = true;
    } else {
        geometry["error"] = false;
    }
    return geometry;
}

// This function reads the special point text boxes and generates the list of body-centered points, in millimeters //

function generatePointsInMM(geometry) {
    var pointsInMM = [];
    
    var skipFirst = document.getElementById("skipFirstCheck").checked;
    var addedPoints = document.getElementById("addedPoints").value;
    var skippedPoints = document.getElementById("skippedPoints").value;
    var specialAreas = document.getElementById("specialAreas").value;

    var initialList = generateArray(0,geometry["downCoreLength"],geometry["downCoreSpacing"],skipFirst);
    
    var addedList = getPointsList(addedPoints, "extra points");
    var skippedList = getPointsList(skippedPoints, "skip points");
    var specialList = getSpecialAreaList(specialAreas);
    
    var mergedList = mergeLists(initialList, addedList);
    var prunedList = pruneList(mergedList, skippedList);
    var reconciledList = reconcileAreas(prunedList, specialList, skipFirst);
    
    var len = reconciledList.length;
    for (var i=0; i<len; i++) {
        pointsInMM[i] = {'downMM': reconciledList[i], 'crossMM': geometry["crossCorePosition"]};
    }
    return pointsInMM;
}

// This function attempts to convert the user-entered extra and skip point lists into numbers //

function getPointsList(ptsRaw, name) {
    var ptsList = ptsRaw.split(/[\n,]+/);
    var vals = [];
    var badPts = false;
    var i,len_i = 0;
    len_i = ptsList.length;
    
    for (i=0; i<len_i; i++) {
        if (ptsList[i] != "") {
            ptsList[i] = Number(ptsList[i]);
            if (isNaN(ptsList[i]) == true) {
                if (badPts == false) {
                    alert("Non-numeric value entered in " + name + " field. Points will be ignored");
                    badPts = true;
                }
            } else {
                vals.push(ptsList[i]);
            }
        }
    }
    return vals;
}

function getSpecialAreaList(areaRaw) {
    var areaList = areaRaw.split(/[\n,]+/);
    var vals = [];
    var sub_vals = [];
    var badArea = false;
    var badSubset = false;
    var i,j,len_i,len_j = 0;
    len_i = areaList.length;
    
    for (i=0; i<len_i; i++) {
        if (areaList[i] != "") {
            sub_vals = areaList[i].split("-");
            len_j = sub_vals.length;
        
            if (len_j != 3) {
                if (badArea == false) {
                    alert("Invalid special area defined. Area will be ignored");
                    badArea = true;
                }
            } else {
                badSubset = false;
                for (j=0; j<3; j++) {
                    sub_vals[j] = Number(sub_vals[j]);
                    if (isNaN(sub_vals[i]) == true) {
                        if (badArea == false) {
                            alert("Non-numeric value entered in special areas field. Area will be ignored");
                            badArea = true;
                        }
                        badSubset = true;
                    }
                }
                if (badSubset == false) {
                    var test1 = (sub_vals[1] - sub_vals[0]) > 0;
                    var test2 = sub_vals[2] <= (sub_vals[1]-sub_vals[0]);
                    if (!test1 || !test2) {
                        badSubset = true;
                        if (badArea == false) {
                            alert("Invalid special area defined. Area will be ignored");
                            badArea = true;
                        }
                    }
                }
                if (badSubset == false) {
                    vals.push(sub_vals);
                }
            }
        }
    }
    return vals;
}

// These functions are used to reconcile the different point lists //

function generateArray(start, stop, step, skipFirst) {
    var newArray = [];
    var pointN = Math.floor((stop-start)/step);
    var newPt = start;
    if (skipFirst == false) {
        newArray.push(newPt);
    }
    for (var i=0; i<pointN; i++) {
        newPt = (i+1)*step + start;
        newArray.push(newPt);
    }
    return newArray;
}

function removeDuplicates(originalList) {
    originalList = originalList.sort(function(a,b){return a-b});
    var originalListClean = [originalList[0]];
    var len_k = originalList.length;
    for (var k=1; k<len_k; k++) {
        if (originalList[k] != originalList[k-1]) {
            originalListClean.push(originalList[k]);
        }
    }
    return originalListClean;
}

function mergeLists(originalList, newList) {
    var mergedList = originalList.slice();
    var len_i = originalList.length;
    var len_j = newList.length;
    var i,j = 0;
    var found = false;
    for (j=0; j<len_j; j++) {
        found = false;
        for (i=0; i<len_i; i++) {
            if (newList[j] == originalList[i]) {
                found = true;
            }
        }
        if (found == false) {
            mergedList.push(newList[j]);
        }
    }
    var mergedListClean = removeDuplicates(mergedList);
    return mergedListClean;
}

function pruneList(originalList, newList) {
    var prunedList = [];
    var len_i = originalList.length;
    var len_j = newList.length;
    var i,j = 0;
    var found = false;
    for (i=0; i<len_i; i++) {
        found = false;
        for (j=0; j<len_j; j++) {
            if (originalList[i] == newList[j]) {
                found = true;
            }
        }
        if (found == false) {
            prunedList.push(originalList[i]);
        }
    }
    var prunedListClean = removeDuplicates(prunedList);
    return prunedListClean;
}

function reconcileAreas(originalList, specialAreasList, skipFirst) {
    var reconciled = originalList.slice();
    var reconciled_new = [];
    var new_area = [];
    var i,j,start,end,step,len_j = 0;
    
    var len_i = specialAreasList.length;
    for (i=0; i<len_i; i++) {
        start = specialAreasList[i][0];
        end = specialAreasList[i][1];
        step = specialAreasList[i][2];
        new_area = generateArray(start, end, step, skipFirst);
        reconciled_new = [];
        len_j = reconciled.length;
        for (j=0; j<len_j; j++) {
            if ((reconciled[j] < start) || (reconciled[j] > end)) {
                reconciled_new.push(reconciled[j]);
            }
        }
        reconciled_new = reconciled_new.concat(new_area);
        reconciled = reconciled_new.slice();
    }
    var reconciledClean = removeDuplicates(reconciled);
    return reconciledClean;
}

// This function generates the appropriate pixel positions and dimensions for the pints in mm //

function generatePixelPositions(pointsInMM, geometry) {
    var pointsInPX = [];
    
    var coreWidthMM = geometry["crossCoreWidth"];
    var coreWidthPX = state_vals["coreRightPx"] - state_vals["coreLeftPx"];
    var coreLengthMM = geometry["downCoreLength"];
    var coreLengthPX = state_vals["coreBottomPx"] - state_vals["coreTopPx"];
    var spotWidthMM = geometry["crossCoreSpot"];
    var spotWidthPX = Math.round((coreWidthPX/coreWidthMM)*spotWidthMM);
    var spotLengthMM = geometry["downCoreSpot"];
    var spotLengthPX = Math.round((coreLengthPX/coreLengthMM)*spotLengthMM);
    
    var crossSlope = (coreWidthPX/coreWidthMM);
    var crossIntercept = (state_vals["coreRightPx"]-state_vals["coreLeftPx"])/2 + state_vals["coreLeftPx"] - (spotWidthPX/2);
    var downSlope = (coreLengthPX/coreLengthMM);
    var downIntercept = state_vals["coreTopPx"] - (spotLengthPX/2);
    
    var crossMM,downMM,crossPX,downPX = 0;
    var point = {};
    for (var i=0, len=pointsInMM.length; i<len; i++) {
        crossMM = pointsInMM[i]['crossMM'];
        crossPX = Math.round(crossSlope*crossMM + crossIntercept);
        downMM = pointsInMM[i]['downMM'];
        downPX = Math.round(downSlope*downMM + downIntercept);
        point = {'downMM':downMM,'crossMM':crossMM,'tlXpx':crossPX,'tlYpx':downPX,'delXpx':spotWidthPX,'delYpx':spotLengthPX};
        pointsInPX.push(point);
    }
    return pointsInPX;
}

// This gets the RGB values from each point //

function getRGB(pointsInPX) {
    var pointsRGB = [];
    
    var canvas = document.getElementById('img_canvas');
    var ctxCanvas = canvas.getContext('2d');
    var tlX,tlY,delX,delY = 0;
    var pixelArray = [];
    var aveRGB = {};
    var point = {};
    for (var i=0, len=pointsInPX.length; i<len; i++) {
        tlX = pointsInPX[i]['tlXpx'];
        tlY = pointsInPX[i]['tlYpx'];
        delX = pointsInPX[i]['delXpx'];
        delY = pointsInPX[i]['delYpx'];
        pixelArray = ctxCanvas.getImageData(tlX,tlY,delX,delY).data;
        aveRGB = averageRGB(pixelArray);
        point = {'downMM': pointsInPX[i]['downMM'], 'crossMM': pointsInPX[i]['crossMM']};
        point['tlXpx'] = pointsInPX[i]['tlXpx'];
        point['tlYpx'] = pointsInPX[i]['tlYpx'];
        point['delXpx'] = pointsInPX[i]['delXpx'];
        point['delYpx'] = pointsInPX[i]['delYpx'];
        point['R'] = aveRGB['R'];
        point['G'] = aveRGB['G'];
        point['B'] = aveRGB['B'];
        point['L*'] = aveRGB['L*'];
        point['a*'] = aveRGB['a*'];
        point['b*'] = aveRGB['b*'];
        pointsRGB.push(point);
    }
    return pointsRGB;
}

// This averages the RGB values over an entire spot //

function averageRGB(pixelArray) {
    var aveRGB = {'R':0,'G':0,'B':0,'L*':0,'a*':0,'b*':0};
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
    var RGBstar = XYZtoRGB(LabToXYZ([aveRGB['L*'],aveRGB['a*'],aveRGB['b*']]));
    aveRGB['R'] = RGBstar[0];
    aveRGB['G'] = RGBstar[1];
    aveRGB['B'] = RGBstar[2];
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

// This handles the test area in the methods //

function rgbTest() {
    var Rtxt = document.getElementById("Rtxt");
    var Gtxt = document.getElementById("Gtxt");
    var Btxt = document.getElementById("Btxt");
    var Xtxt = document.getElementById("Xtxt");
    var Ytxt = document.getElementById("Ytxt");
    var Ztxt = document.getElementById("Ztxt");
    var Ltxt = document.getElementById("Ltxt");
    var AStxt = document.getElementById("AStxt");
    var BStxt = document.getElementById("BStxt");
    var Rin = parseInt(Rtxt.value);
    var Gin = parseInt(Gtxt.value);
    var Bin = parseInt(Btxt.value);
    var XYZ = RGBtoXYZ([Rin,Gin,Bin]);
    var Lab = XYZtoLab(XYZ);
    Xtxt.value = XYZ[0];
    Ytxt.value = XYZ[1];
    Ztxt.value = XYZ[2];
    Ltxt.value = Lab[0];
    AStxt.value = Lab[1];
    BStxt.value = Lab[2];
    return;
}

function labTest() {
    var Rtxt = document.getElementById("Rtxt");
    var Gtxt = document.getElementById("Gtxt");
    var Btxt = document.getElementById("Btxt");
    var Xtxt = document.getElementById("Xtxt");
    var Ytxt = document.getElementById("Ytxt");
    var Ztxt = document.getElementById("Ztxt");
    var Ltxt = document.getElementById("Ltxt");
    var AStxt = document.getElementById("AStxt");
    var BStxt = document.getElementById("BStxt");
    var Lin = parseFloat(Ltxt.value);
    var ASin = parseFloat(AStxt.value);
    var BSin = parseFloat(BStxt.value);
    var XYZ = LabToXYZ([Lin,ASin,BSin]);
    var RGB = XYZtoRGB(XYZ);
    Xtxt.value = XYZ[0];
    Ytxt.value = XYZ[1];
    Ztxt.value = XYZ[2];
    Rtxt.value = RGB[0];
    Gtxt.value = RGB[1];
    Btxt.value = RGB[2];
    return;
}

// This plots the points as rectangles on the overlay canvas //

function drawPoints(points) {
    var fillPoints = document.getElementById("fillPoints").checked;
    
    var overlay = document.getElementById('overlay');
    var ctxOverlay = overlay.getContext('2d');
    var tlX,tlY,delX,delY,R,G,B = 0;
    var rgbStr = "";
    for (var i=0,len=points.length; i<len; i++) {
        tlX = points[i]['tlXpx'];
        tlY = points[i]['tlYpx'];
        delX = points[i]['delXpx'];
        delY = points[i]['delYpx'];
        R = points[i]['R'];
        G = points[i]['G'];
        B = points[i]['B'];
        rgbStr = "rgb(" + R + "," + G + "," + B + ")";
        if (fillPoints) {
            ctxOverlay.fillStyle = rgbStr;
            ctxOverlay.fillRect(tlX,tlY,delX,delY);
        }
        ctxOverlay.lineWidth="10";
        ctxOverlay.strokeStyle="white";
        ctxOverlay.strokeRect(tlX,tlY,delX,delY);
    }
    return;
}

// This clears the entire overlay canvas so that the points can be redrawn //

function clearOverlay() {
    var overlay = document.getElementById('overlay');
    var ctxOverlay = overlay.getContext('2d');
    ctxOverlay.clearRect(0,0,overlay.width,overlay.height);
}

// This prints an array to the results textarea //

function printResults(listToPrint, keys) {
    var resultsArea = document.getElementById("results");
    
    var resultsList = [];
    var resultsRow = [];
    var resultsRowStr = "";
    var len_i = listToPrint.length;
    var len_j = keys.length;
    
    for (var j=0; j<len_j; j++) {
        resultsRow.push(keys[j]);
    }
    resultsRowStr = resultsRow.join("  ");
    resultsList.push(resultsRowStr);
    for (var i=0; i<len_i; i++) {
        resultsRow = [];
        for (var j=0; j<len_j; j++) {
            resultsRow.push(listToPrint[i][keys[j]]);
        }
        resultsRowStr = resultsRow.join("  ");
        resultsList.push(resultsRowStr);
    }
    var results = resultsList.join("\n");
    resultsArea.value = results;
    return;
}
