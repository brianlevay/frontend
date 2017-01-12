var state = {mouseHold: false};

function setup() {
    var clearBtn = document.getElementById("clearBtn");
    var canv = document.getElementById("pad");
    var ctx = canv.getContext("2d");
    var width = canv.width;
    var height = canv.height;
    
    // Mouse events for traditional desktop //
    canv.addEventListener("mousedown", function(e){
        state.mouseHold = true;
        return;
    });
    canv.addEventListener("mousemove", function(e){
        if (state.mouseHold) {
            drawFreeHand(ctx, "#0000FF", "circle", 12, getMousePosition(e,canv));
        }
        return;
    });
    canv.addEventListener("mouseup", function(e){
        state.mouseHold = false;
        return;
    });
    
    // Touch events - got the e.touches[0] from Stack Overflow! //
    canv.addEventListener("touchstart", function(e){
        state.mouseHold = true;
        return;
    });
    canv.addEventListener("touchmove", function(e){
        if (state.mouseHold) {
            drawFreeHand(ctx, "#0000FF", "circle", 12, getMousePosition(e.touches[0],canv));
        }
        return;
    });
    canv.addEventListener("touchend", function(e){
        state.mouseHold = false;
        return;
    });
    
    // Events for clearing the page //
    clearBtn.addEventListener("click", function(){
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.rect(0,0,width,height);
        ctx.closePath();
        ctx.fill();
        return;
    });
    
    return;
}

function getMousePosition(e, canvas) {
    var X = e.clientX - canvas.offsetLeft;
    var Y = e.clientY - canvas.offsetTop;
    return [X,Y];
}

function drawFreeHand(context, color, shape, thickness, center) {
    context.fillStyle = color;
    if (shape == "circle") {
        var rad = Math.round(thickness/2);
        context.beginPath();
        context.arc(center[0],center[1],rad,0,2.0*Math.PI);
        context.closePath();
        context.fill();
        return;
    }
    else if (shape == "square") {
        var cornerX = center[0] - Math.round(thickness/2);
        var cornerY = center[1] - Math.round(thickness/2);
        context.beginPath();
        context.rect(cornerX,cornerY,thickness,thickness);
        context.closePath();
        context.fill();
        return;
    }
    else {
        return;
    }
}

/* This binds the appropriate functions on page load */
setup();