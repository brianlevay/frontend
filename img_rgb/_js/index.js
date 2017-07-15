var state_vals = {
    fileName: null,
    coreTop: 0, coreBottom: 0, coreLeft: 0, coreRight: 0,
    boundThickness: 10
}

function handleFile(files) {
    drawImage(files);
}

function drawImage(files) {
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
        state_vals["coreBottom"] = height;
        state_vals["coreRight"] = width;
        setSliderRanges();
        updateDivBounds();
        updateSliders();
        updateTxts();
        attachBoundListeners();
    };
    imgNew.src = window.URL.createObjectURL(files[0]);
}

function setSliderRanges() {
    var topSlider = document.getElementById('topSlider');
    var bottomSlider = document.getElementById('bottomSlider');
    var leftSlider = document.getElementById('leftSlider');
    var rightSlider = document.getElementById('rightSlider');
    topSlider.max = state_vals["coreBottom"];
    bottomSlider.max = state_vals["coreBottom"];
    leftSlider.max = state_vals["coreRight"];
    rightSlider.max = state_vals["coreRight"];
}

function updateDivBounds() {
    var topDiv = document.getElementById('imgTop');
    var bottomDiv = document.getElementById('imgBottom');
    var leftDiv = document.getElementById('imgLeft');
    var rightDiv = document.getElementById('imgRight');
    
    var width = state_vals["coreRight"] - state_vals["coreLeft"];
    var height = state_vals["coreBottom"] - state_vals["coreTop"];
    
    topDiv.style.width = (width+2*state_vals["boundThickness"]) + "px";
    topDiv.style.height = state_vals["boundThickness"] + "px";
    bottomDiv.style.width = (width+2*state_vals["boundThickness"]) + "px";
    bottomDiv.style.height = state_vals["boundThickness"] + "px";
    leftDiv.style.width = state_vals["boundThickness"] + "px";
    leftDiv.style.height = (height+2*state_vals["boundThickness"]) + "px";
    rightDiv.style.width = state_vals["boundThickness"] + "px";
    rightDiv.style.height = (height+2*state_vals["boundThickness"]) + "px";
    
    topDiv.style.left = (state_vals["coreLeft"]-state_vals["boundThickness"]) + "px";
    topDiv.style.top = (state_vals["coreTop"]-state_vals["boundThickness"]) + "px";
    bottomDiv.style.left = (state_vals["coreLeft"]-state_vals["boundThickness"]) + "px";
    bottomDiv.style.top = state_vals["coreBottom"] + "px";
    leftDiv.style.left = (state_vals["coreLeft"]-state_vals["boundThickness"]) + "px";
    leftDiv.style.top = (state_vals["coreTop"]-state_vals["boundThickness"]) + "px";
    rightDiv.style.left = state_vals["coreRight"] + "px";
    rightDiv.style.top = (state_vals["coreTop"]-state_vals["boundThickness"]) + "px";
}

function updateSliders() {
    var topSlider = document.getElementById('topSlider');
    var bottomSlider = document.getElementById('bottomSlider');
    var leftSlider = document.getElementById('leftSlider');
    var rightSlider = document.getElementById('rightSlider');
    topSlider.value = state_vals["coreTop"];
    bottomSlider.value = state_vals["coreBottom"];
    leftSlider.value = state_vals["coreLeft"];
    rightSlider.value = state_vals["coreRight"];
}

function updateTxts() {
    var topTxt = document.getElementById('topTxt');
    var bottomTxt = document.getElementById('bottomTxt');
    var leftTxt = document.getElementById('leftTxt');
    var rightTxt = document.getElementById('rightTxt');
    topTxt.value = state_vals["coreTop"];
    bottomTxt.value = state_vals["coreBottom"];
    leftTxt.value = state_vals["coreLeft"];
    rightTxt.value = state_vals["coreRight"];
}

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
        updateFunction(topSlider, "coreTop", "coreBottom", "smaller");
    };
    bottomSlider.onchange = function(){
        updateFunction(bottomSlider, "coreBottom", "coreTop", "larger");
    };
    leftSlider.onchange = function(){
        updateFunction(leftSlider, "coreLeft", "coreRight", "smaller");
    };
    rightSlider.onchange = function(){
        updateFunction(rightSlider, "coreRight", "coreLeft", "larger");
    };
    topTxt.onchange = function(){
        updateFunction(topTxt, "coreTop", "coreBottom", "smaller");
    };
    bottomTxt.onchange = function(){
        updateFunction(bottomTxt, "coreBottom", "coreTop", "larger");
    };
    leftTxt.onchange = function(){
        updateFunction(leftTxt, "coreLeft", "coreRight", "smaller");
    };
    rightTxt.onchange = function(){
        updateFunction(rightTxt, "coreRight", "coreLeft", "larger");
    };
}

function updateFunction(element, boundary, opposite, constraint) {
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
    updateSliders();
    updateTxts();
    updateDivBounds();
}