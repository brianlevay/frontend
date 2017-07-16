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
        var height = parseInt(imgNew.height);
        var width = parseInt(imgNew.width);
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
    return;
}

// TOP LEVEL FUNCTION //
// This function is the one bound to the onclick event for "Generate Points" //
// The button is only active once an image loaded //

function generatePoints() {
    var geometry = getCoreGeometryInputs();
    if (geometry["error"] == false) {
        var pointsInMM = generatePointsInMM(geometry);
        var keys = ['X','Y'];
        printResults(pointsInMM, keys);
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
        pointsInMM[i] = {'X': reconciledList[i], 'Y': geometry["crossCorePosition"]};
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
    var pointN = parseInt((stop-start)/step);
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
    var i,j,k = 0;
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
    var i,j,k = 0;
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

