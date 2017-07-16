// This maintains any state variables //

var state_vals = {
    fileName: null,
    coreTopPx: 0, coreBottomPx: 0, coreLeftPx: 0, coreRightPx: 0,
    boundThickness: 10
};

// TOP LEVEL FUNCTION //
// This function is called from the onchange for the file input //

function handleFile(files) {
    initializeImage(files);
    return;
}

// This function loads the image and resets the fields and sliders as needed //

function initializeImage(files) {
    var canvas = document.getElementById('img_canvas');
    var ctx = canvas.getContext('2d');
    var imgNew = new Image();
    imgNew.onload = function() {
        var height = parseInt(imgNew.height)
        var width = parseInt(imgNew.width)
        canvas.height = height;
        canvas.width = width;
        ctx.drawImage(imgNew, 0, 0);
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
        resetPointFields()
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
                state_vals[boundary] = parseInt(element.value);
            } else {
                state_vals[boundary] = state_vals[opposite];
            }
        } else if (constraint == "larger") {
            if (element.value > state_vals[opposite]) {
                state_vals[boundary] = parseInt(element.value);
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
    state_vals["pointsInMM"] = [];
    return;
}

// TOP LEVEL FUNCTION //
// This function is the one bound to the onclick event for "Generate Points" //

function generatePoints() {
    var pointsInMM = generatePointsInMM();
    return;
}

// This function reads the input text boxes and generates the list of body-centered points, in millimeters

function generatePointsInMM() {
    var pointsInMM = [];
    
    var downCoreLength = document.getElementById("lengthTxt").value;
    var downCoreSpacing = document.getElementById("spacingTxt").value;
    var crossCorePosition = document.getElementById("lateralTxt").value;
    var skipFirst = document.getElementById("skipFirstCheck").checked;
    
    var addedPoints = document.getElementById("addedPoints").value;
    var skippedPoints = document.getElementById("skippedPoints").value;
    var specialAreas = document.getElementById("specialAreas").value;
    
    var totalLength = Number(downCoreLength);
    var ptSpacing = Number(downCoreSpacing);
    var lateralPos = Number(crossCorePosition);
    
    if (isNaN(totalLength) || isNaN(ptSpacing) || isNaN(lateralPos)) {
        alert("Non-numeric values entered in length, spacing, or cross-core position field.");
        return [];
    }

    var initialList = generateArray(0,totalLength,ptSpacing,skipFirst);
    
    var addedListStr = addedPoints.split(/[\n,]+/);
    var addedList = convertPointsList(addedListStr, "extra points");
    addedList = addedList.sort();
    
    var skippedListStr = skippedPoints.split(/[\n,]+/);
    var skippedList = convertPointsList(skippedListStr, "skip points");
    skippedList = skippedList.sort();
    
    var specialListStr = specialAreas.split(/[\n,]+/);
    var specialList = convertAreaList(specialListStr);
    
    return pointsInMM;
}

// This function attempts to convert the user-entered extra and skip point lists into numbers //

function convertPointsList(ptsList, name) {
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


function convertAreaList(areaList) {
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

// This is a generic array generator //

function generateArray(start, stop, step, skipStart) {
    var newArray = [];
    var pointN = parseInt((stop-start)/step);
    var newPt = start;
    if (skipStart == false) {
        newArray.push(newPt);
    }
    for (var i=0; i<pointN; i++) {
        newPt = (i+1)*step + start;
        newArray.push(newPt);
    }
    return newArray;
}
