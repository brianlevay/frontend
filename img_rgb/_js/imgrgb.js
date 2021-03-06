/* global Image */
// This maintains any state variables //

var state_vals = {
    worker: null,
    fileName: null,
    imgOrig: null,
    imgDisplay: null,
    canvas: null,
    context: null,
    coreTopPx: 0, coreBottomPx: 0, coreLeftPx: 0, coreRightPx: 0,
    boundThickness: 10
};

// This handles the web worker events //

window.onload = function(){
    var worker = new Worker("_js/imgrgb_calc.js");
    state_vals['worker'] = worker;
    state_vals['worker'].addEventListener("message", workerCompletion, false);
    state_vals['canvas'] = document.createElement('canvas');
    state_vals['context'] = state_vals['canvas'].getContext('2d');
    state_vals['imgDisplay'] = document.getElementById("img_display");
};

function workerCompletion(message) {
    if (message.data.command == "rgbSpots") {
        drawPoints(message.data.rgbSpots);
        printResults(message.data.rgbSpots);
    } else if (message.data.command == "colors") {
        updateTestSection(message.data.colors);
    }
    return;
}

// This function is called from the onchange for the file input //

function handleFile(files) {
    initializeImage(files);
    return;
}

// This function loads the image and resets the fields and sliders as needed //

function initializeImage(files) {
    state_vals["imgOrig"] = null;
    state_vals["imgOrig"] = new Image();
    state_vals["imgOrig"].onload = function() {
        var height = state_vals["imgOrig"].height;
        var width = state_vals["imgOrig"].width;
        var displayArea = document.getElementById('displayArea');
        
        state_vals['canvas'].height = height;
        state_vals['canvas'].width = width;
        displayArea.style.height = height + "px";
        displayArea.style.width = width + "px";
        state_vals['context'].drawImage(state_vals["imgOrig"], 0, 0);

        state_vals["fileName"] = files[0]["name"];
        state_vals["coreTopPx"] = 0;
        state_vals["coreBottomPx"] = height;
        state_vals["coreLeftPx"] = 0;
        state_vals["coreRightPx"] = width;
        updateDivBounds();
        updateTxts();
        attachBoundListeners();
        resetPointFields();
        var generateBtn = document.getElementById('generatePts');
        generateBtn.disabled = false;
    };
    state_vals["imgOrig"].src = window.URL.createObjectURL(files[0]);
    state_vals["imgDisplay"].src = window.URL.createObjectURL(files[0]);
    return;
}

// These functions update the text boxes and divs for the core boundary based on the state values //

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

// This function attaches the event handlers so that any text change updates all boundary DOM elements as well as the state //

function attachBoundListeners() {
    var topTxt = document.getElementById('topTxt');
    var bottomTxt = document.getElementById('bottomTxt');
    var leftTxt = document.getElementById('leftTxt');
    var rightTxt = document.getElementById('rightTxt');
    
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
    updateTxts();
    updateDivBounds();
    return;
}

// This clears out all text areas when a new image is loaded //

function resetPointFields() {
    var addedPoints = document.getElementById("addedPoints");
    var results = document.getElementById("results");
    addedPoints.value = "";
    results.value = "";
    return;
}

// TOP LEVEL FUNCTION //
// This function is the one bound to the onclick event for "Generate Points" //
// The button is only active once an image loaded //

function generatePoints() {
    var generateBtn = document.getElementById("generatePts");
    generateBtn.disabled = true;
    
    var geometry = getCoreGeometryInputs();
    if (geometry["error"] == false) {
        var pointsInMM = generatePointsInMM(geometry);
        var pointsInPX = generatePixelPositions(pointsInMM, geometry);
        var imgData = state_vals['context'].getImageData(0, 0, state_vals['canvas'].width, state_vals['canvas'].height);
        var contents = {'type': 'rgbSpots', 'pts': pointsInPX, 'imgData': imgData, 'width': state_vals['canvas'].width, 'height': state_vals['canvas'].height};
        state_vals['worker'].postMessage({"contents": contents});
    } else {
        generateBtn.disabled = false;
    }
    return;
}

// This validates the core geometry inputs and converts to numbers //

function getCoreGeometryInputs() {
    var geometry = {};
    var hasError = false;
    var numeric = 0;
    geometry["downCoreLength"] = document.getElementById("lengthTxt").value;
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

// These functions convert the user entered information to a list of X,Y points in millimeters //

function generatePointsInMM(geometry) {
    var pointsInMM = [];
    var addedPoints = document.getElementById("addedPoints").value;
    var addedList = getPointsList(addedPoints);
    var len = addedList.length;
    for (var i=0; i<len; i++) {
        pointsInMM[i] = {'downMM': addedList[i], 'crossMM': geometry["crossCorePosition"]};
    }
    return pointsInMM;
}

function getPointsList(ptsRaw) {
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
                    alert("Non-numeric value(s) entered in list of points. Point(s) will be ignored");
                    badPts = true;
                }
            } else {
                vals.push(ptsList[i]);
            }
        }
    }
    return vals;
}

// This function generates the appropriate pixel positions and dimensions for the pints in mm //

function generatePixelPositions(pointsInMM, geometry) {
    var pointsInPX = [];
    
    var coreLengthMM = geometry["downCoreLength"];
    var spotWidthMM = geometry["crossCoreSpot"];
    var spotLengthMM = geometry["downCoreSpot"];
    var coreLengthPX = state_vals["coreBottomPx"] - state_vals["coreTopPx"];
    
    var slope = (coreLengthPX/coreLengthMM);
    var spotWidthPX = Math.round(slope*spotWidthMM);
    var spotLengthPX = Math.round(slope*spotLengthMM);
    var crossInt = (state_vals["coreRightPx"]-state_vals["coreLeftPx"])/2 + state_vals["coreLeftPx"] - (spotWidthPX/2);
    var downInt = state_vals["coreTopPx"] - (spotLengthPX/2);
    
    var crossMM,downMM,crossPX,downPX = 0;
    var point = {};
    for (var i=0, len=pointsInMM.length; i<len; i++) {
        crossMM = pointsInMM[i]['crossMM'];
        crossPX = Math.round(slope*crossMM + crossInt);
        downMM = pointsInMM[i]['downMM'];
        downPX = Math.round(slope*downMM + downInt);
        point = {'downMM':downMM,'crossMM':crossMM,'tlX':crossPX,'tlY':downPX,'delX':spotWidthPX,'delY':spotLengthPX};
        pointsInPX.push(point);
    }
    return pointsInPX;
}

// This plots the points as rectangles on the core image //
// Note that it first overwrites the entire canvas with current image //

function drawPoints(points) {
    var lineRtxt = document.getElementById("lineRtxt").value;
    var lineBtxt = document.getElementById("lineBtxt").value;
    var lineGtxt = document.getElementById("lineGtxt").value;
    var lineWidthTxt = document.getElementById("lineWidthTxt").value;
    var fillPoints = document.getElementById("fillPoints").checked;

    var lineR = 255;
    var lineB = 255;
    var lineG = 255;
    var lineWidth = 10;
    if (isNaN(Number(lineRtxt))==false) {
        lineR = Math.round(Number(lineRtxt));
    }
    if (isNaN(Number(lineGtxt))==false) {
        lineG = Math.round(Number(lineGtxt));
    }
    if (isNaN(Number(lineBtxt))==false) {
        lineB = Math.round(Number(lineBtxt));
    } 
    if (isNaN(Number(lineWidthTxt))==false) {
        lineWidth = Math.round(Number(lineWidthTxt));
    }
    var rgbLineStr = "rgb(" + lineR + "," + lineG + "," + lineB + ")";
    
    // Refresh of canvas not needed in current iteration; keep line for debugging //
    //state_vals['context'].drawImage(state_vals["imgOrig"],0,0);
    
    var tlX,tlY,delX,delY,R,G,B = 0;
    var rgbFillStr = "";
    for (var i=0,len=points.length; i<len; i++) {
        tlX = points[i]['tlX'];
        tlY = points[i]['tlY'];
        delX = points[i]['delX'];
        delY = points[i]['delY'];
        R = points[i]['aveRGB']['R'];
        G = points[i]['aveRGB']['G'];
        B = points[i]['aveRGB']['B'];
        rgbFillStr = "rgb(" + R + "," + G + "," + B + ")";
        if (fillPoints) {
            state_vals['context'].fillStyle = rgbFillStr;
            state_vals['context'].fillRect(tlX,tlY,delX,delY);
        }
        state_vals['context'].lineWidth=lineWidth;
        state_vals['context'].strokeStyle=rgbLineStr;
        state_vals['context'].strokeRect(tlX,tlY,delX,delY);
    }
    state_vals["imgDisplay"].src = state_vals["canvas"].toDataURL("image/jpeg");
    
    var generateBtn = document.getElementById("generatePts");
    generateBtn.disabled = false;
    return;
}

// This prints an array to the results textarea //

function printResults(listToPrint) {
    var resultsArea = document.getElementById("results");
    var resultsList = [];
    var resultsRowList = [];
    var resultsRowStr = "";
    
    var len_i = listToPrint.length;
    var val;
    var colors = ["L*","a*","b*","X","Y","Z","R","G","B"];
    var len_j = colors.length;
    
    if (resultsArea.value == "") {
        resultsList.push(state_vals["fileName"]);
        resultsRowStr = "Top: " + state_vals["coreTopPx"] + ", Bottom: " + state_vals["coreBottomPx"];
        resultsList.push(resultsRowStr);
        resultsRowStr = "Left: " + state_vals["coreLeftPx"] + ", Right: " + state_vals["coreRightPx"];
        resultsList.push(resultsRowStr);
        
        resultsRowList.push("downMM");
        resultsRowList.push("crossMM");
        for (var j=0; j<len_j; j++) {
            resultsRowList.push(colors[j]);
        }
        resultsRowStr = resultsRowList.join("  ");
        resultsList.push(resultsRowStr);
    }
        
    for (var i=0; i<len_i; i++) {
        resultsRowList = [];
        resultsRowList.push(listToPrint[i]["downMM"]);
        resultsRowList.push(listToPrint[i]["crossMM"]);
        for (var j=0; j<len_j; j++) {
            val = listToPrint[i]["aveRGB"][colors[j]];
            if ((colors[j]=="L*")||(colors[j]=="a*")||(colors[j]=="b*")||(colors[j]=="X")||(colors[j]=="Y")||(colors[j]=="Z")){
                val = val.toFixed(4);
            } else {
                val = val.toFixed(0);
            }
            resultsRowList.push(val);
        }
        resultsRowStr = resultsRowList.join("  ");
        resultsList.push(resultsRowStr);
    }
    var results = resultsList.join("\n");
    if (resultsArea.value != "") {
        resultsArea.value = resultsArea.value + "\n" + results;
    } else {
        resultsArea.value = results;
    }
    return;
}

// These functions handle the drag events for the core boundaries //

function dragstart_handler(ev) {
    var id = ev.target.id;
    var div = document.getElementById(ev.target.id);
    var top = div.style.top;
    var left = div.style.left;
    var data = id + "," + top + "," + left;
    ev.dataTransfer.setData("text", data);
    return;
}

function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
    return;
}

function drop_handler(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text").split(",");
    var origDiv = document.getElementById(data[0]);
    var leftX = ev.offsetX;
    var rightX = ev.offsetX + state_vals['boundThickness'];
    var topY = ev.offsetY;
    var bottomY = ev.offsetY + state_vals['boundThickness'];
    if (data[0] == "imgTop") {
        if (bottomY > state_vals['coreBottomPx']) {
            origDiv.style.top = (state_vals['coreBottomPx']-state_vals['boundThickness']) + "px";
            state_vals['coreTopPx'] = state_vals['coreBottomPx'];
        } else {
            origDiv.style.top = topY + "px";
            state_vals['coreTopPx'] = bottomY;
        }
    } else if (data[0] == "imgBottom") {
        if (topY < state_vals['coreTopPx']) {
            origDiv.style.top = state_vals['coreTopPx'] + "px";
            state_vals['coreBottomPx'] = state_vals['coreTopPx'];
        } else {
            origDiv.style.top = topY + "px";
            state_vals['coreBottomPx'] = topY;
        }
    } else if (data[0] == "imgLeft") {
        if (rightX > state_vals['coreRightPx']) {
            origDiv.style.left = (state_vals['coreRightPx']-state_vals['boundThickness']) + "px";
            state_vals['coreLeftPx'] = state_vals['coreRightPx'];
        } else {
            origDiv.style.left = leftX + "px";
            state_vals['coreLeftPx'] = rightX;
        }
    } else {
        if (leftX < state_vals['coreLeftPx']) {
            origDiv.style.left = state_vals['coreLeftPx'] + "px";
            state_vals['coreRightPx'] = state_vals['coreLeftPx'];
        } else {
            origDiv.style.left = leftX + "px";
            state_vals['coreRightPx'] = leftX;
        }
    }
    updateTxts();
    updateDivBounds();
    return;
}

// This handles the test area in the methods //

function rgbTest() {
    var Rtxt = document.getElementById("Rtxt");
    var Gtxt = document.getElementById("Gtxt");
    var Btxt = document.getElementById("Btxt");
    var Rin = parseInt(Rtxt.value, 10);
    var Gin = parseInt(Gtxt.value, 10);
    var Bin = parseInt(Btxt.value, 10);
    var contents = {'type': 'RGBtoLab', 'RGB': [Rin,Gin,Bin]};
    state_vals['worker'].postMessage({"contents": contents});
    return;
}

function labTest() {
    var Ltxt = document.getElementById("Ltxt");
    var AStxt = document.getElementById("AStxt");
    var BStxt = document.getElementById("BStxt");
    var Lin = parseFloat(Ltxt.value);
    var ASin = parseFloat(AStxt.value);
    var BSin = parseFloat(BStxt.value);
    var contents = {'type': 'LabToRGB', 'Lab': [Lin,ASin,BSin]};
    state_vals['worker'].postMessage({"contents": contents});
    return;
}

function updateTestSection(colors) {
    var Rtxt = document.getElementById("Rtxt");
    var Gtxt = document.getElementById("Gtxt");
    var Btxt = document.getElementById("Btxt");
    var Xtxt = document.getElementById("Xtxt");
    var Ytxt = document.getElementById("Ytxt");
    var Ztxt = document.getElementById("Ztxt");
    var Ltxt = document.getElementById("Ltxt");
    var AStxt = document.getElementById("AStxt");
    var BStxt = document.getElementById("BStxt");
    Rtxt.value = colors["R"];
    Gtxt.value = colors["G"];
    Btxt.value = colors["B"];
    Xtxt.value = colors["X"];
    Ytxt.value = colors["Y"];
    Ztxt.value = colors["Z"];
    Ltxt.value = colors["L*"];
    AStxt.value = colors["a*"];
    BStxt.value = colors["b*"];
    return;
}