/* global self */
// This maintains color reference variables //

var ref_vals = {
    D65: {'Xref':95.047,'Yref':100.000,'Zref':108.883}
};

// This handles the web worker aspect //
self.addEventListener("message", run);

function run(message) {
    var type = message.data.contents.type;
    if (type=="rgbSpots") {
        getRGBspots(message);
    } else if (type=="RGBtoLab") {
        getRGBtoLab(message);
    } else if (type=="LabToRGB") {
        getLabToRGB(message);
    }
}
// point = {'downMM','crossMM','tlX','tlY','delX','delY'}; //
// rgb spot format: {'tlX','tlY','delX','delY','aveRGB':{'R','G','B','X','Y','Z','L*','a','b'} //

function getRGBspots(message) {
    var pts = message.data.contents.pts;
    var imgData = message.data.contents.imgData;
    var pixels = imgData.data;
    var width = message.data.contents.width;
    
    var rgbSpots = [];
    var rgbSpot = {};
    var aveRGB = [];
    
    var nSpots = pts.length;
    var downMM, crossMM, tlX, tlY, delX, delY;
    for (var n = 0; n < nSpots; n++) {
        downMM = pts[n]['downMM'];
        crossMM = pts[n]['crossMM'];
        tlX = pts[n]['tlX'];
        tlY = pts[n]['tlY'];
        delX = pts[n]['delX'];
        delY = pts[n]['delY'];
        aveRGB = averageRGB(pixels, width, tlX, tlY, delX, delY);
        rgbSpot = {'downMM': downMM, 'crossMM': crossMM, 'tlX': tlX, 'tlY': tlY, 'delX': delX, 'delY': delY, 'aveRGB': aveRGB};
        rgbSpots.push(rgbSpot);
    }
    self.postMessage({
        "command": "rgbSpots",
        "rgbSpots": rgbSpots
    });
    return;
}

function getRGBtoLab(message) {
    var RGB = message.data.contents.RGB;
    var XYZ = RGBtoXYZ(RGB);
    var Lab = XYZtoLab(XYZ);
    var colors = {'R':RGB[0],'G':RGB[1],'B':RGB[2],'X':XYZ[0],'Y':XYZ[1],'Z':XYZ[2],'L*':Lab[0],'a*':Lab[1],'b*':Lab[2]};
    self.postMessage({
        "command": "colors",
        "colors": colors
    });
}

function getLabToRGB(message) {
    var Lab = message.data.contents.Lab;
    var XYZ = LabToXYZ(Lab);
    var RGB = XYZtoRGB(XYZ);
    var colors = {'R':RGB[0],'G':RGB[1],'B':RGB[2],'X':XYZ[0],'Y':XYZ[1],'Z':XYZ[2],'L*':Lab[0],'a*':Lab[1],'b*':Lab[2]};
    self.postMessage({
        "command": "colors",
        "colors": colors
    });
}

// This averages the RGB values over an entire spot //

function averageRGB(pixels, width, tlX, tlY, delX, delY) {
    var aveRGB = {'R':0,'G':0,'B':0,'X':0,'Y':0,'Z':0,'L*':0,'a*':0,'b*':0};
    var RGB, XYZ, Lab = [];
    var x, y, i, R, G, B;
    var nPixelsTot = pixels.length;
    for (var r = 0; r < delY; r++) {
        for (var c = 0; c < delX; c++) {
            x = tlX + c;
            y = tlY + r;
            i = ((y * width) + x) * 4;
            if ((i+2) < nPixelsTot) {
                RGB = [pixels[i+0],pixels[i+1],pixels[i+2]];
                XYZ = RGBtoXYZ(RGB);
                Lab = XYZtoLab(XYZ);
                aveRGB['L*'] += Lab[0];
                aveRGB['a*'] += Lab[1];
                aveRGB['b*'] += Lab[2];
            }
        }
    }
    var nPixelsSpot = delX*delY;
    aveRGB['L*'] = aveRGB['L*']/nPixelsSpot;
    aveRGB['a*'] = aveRGB['a*']/nPixelsSpot;
    aveRGB['b*'] = aveRGB['b*']/nPixelsSpot;
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

// This converts the sRGB value to CIE XYZ (with D65 illumination) and back //

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
    var X = xn * 100.0;
    var Y = yn * 100.0;
    var Z = zn * 100.0;
    return [X,Y,Z];
}

function XYZtoRGB([X,Y,Z]) {
    var xn = X / 100.0;
    var yn = Y / 100.0;
    var zn = Z / 100.0;
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

// This converts the CIE XYZ (D65) to Lab and back //

function XYZtoLab([X,Y,Z]) {
    var xn = X / ref_vals['D65']['Xref'];
    var yn = Y / ref_vals['D65']['Yref'];
    var zn = Z / ref_vals['D65']['Zref'];
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
    var X = xn * ref_vals['D65']['Xref'];
    var Y = yn * ref_vals['D65']['Yref'];
    var Z = zn * ref_vals['D65']['Zref'];
    return[X,Y,Z];
}
