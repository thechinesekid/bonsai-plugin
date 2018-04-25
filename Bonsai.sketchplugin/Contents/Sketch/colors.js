var anc = [{"n":"White","c":"ffffff"},{"n":"Black","c":"000000"},
    {"n":"Bamboo1","c":"b8d94c"},{"n":"Bamboo2","c":"9cbe30"},{"n":"Bamboo3","c":"6ba410"},{"n":"Bamboo4","c":"42860e"},{"n":"Bamboo5","c":"356507"},
    {"n":"Coral1","c":"fcb7bd"},{"n":"Coral2","c":"f58888"},{"n":"Coral3","c":"f06158"},{"n":"Coral4","c":"c14139"},{"n":"Coral5","c":"871a13"},
    {"n":"Sakura1","c":"ffaddd"},{"n":"Sakura2","c":"ee7fc0"},{"n":"Sakura3","c":"cb478a"},{"n":"Sakura4","c":"a92c6c"},{"n":"Sakura5","c":"620e41"},
    {"n":"Fuji1","c":"bbb4cc"},{"n":"Fuji2","c":"9e95b3"},{"n":"Fuji3","c":"655586"},{"n":"Fuji4","c":"584d70"},{"n":"Fuji5","c":"3f314f"},
    {"n":"Jade1","c":"b1e2e2"},{"n":"Jade2","c":"68c2c2"},{"n":"Jade3","c":"489b9b"},{"n":"Jade4","c":"2c6965"},{"n":"Jade5","c":"204c49"},
    {"n":"Pebble1","c":"5e6770"},{"n":"Pebble2","c":"474d54"},{"n":"Pebble3","c":"3a3f45"},{"n":"Pebble4","c":"2d3136"},{"n":"Pebble5","c":"181a1c"},
    {"n":"Sand1","c":"f5f5f5"},{"n":"Sand2","c":"ececec"},{"n":"Sand3","c":"dedede"},{"n":"Sand4","c":"a9a9a9"},{"n":"Sand5","c":"777777"},
    {"n":"Sun1","c":"fdf29d"},{"n":"Sun2","c":"fded68"},{"n":"Sun3","c":"ffe300"},{"n":"Sun4","c":"ffcd00"},{"n":"Sun5","c":"ffb800"},
    {"n":"Orenji1","c":"ffb054"},{"n":"Orenji2","c":"ff8e00"},{"n":"Orenji3","c":"e3720f"},{"n":"Orenji4","c":"bf5500"},{"n":"Orenji5","c":"a94500"},
    {"n":"Wave1","c":"aee1f5"},{"n":"Wave2","c":"71b6ce"},{"n":"Wave3","c":"0079a3"},{"n":"Wave4","c":"005c7d"},{"n":"Wave5","c":"022e50"}
];

var colorModes = ["WRGB","RGB","DELTAE","DELTAH"]

function proximitySort(a,b) {
    if (a.p < b.p)
        return -1;
    if (a.p > b.p)
        return 1;
    return 0;
}

function findNearestColorByWeightedRGB(hex) {
    var p1 = splitRGB(hex);
    var closestWRGB = new Array();

    for(var i in anc) {
        var p2 = splitRGB(anc[i].c);
        var r_ = (p1['r'] + p2['r']) / 2.0;
        var dR = p1['r'] - p2['r'];
        var dG = p1['g'] - p2['g'];
        var dB = p1['b'] - p2['b'];
        var proximity = Math.sqrt(
            ( 2 * Math.pow(dR, 2) )
            +
            ( 4 * Math.pow(dG, 2) )
            +
            ( 3 * Math.pow(dB, 2) )
            +
            ( ( r_ * ( Math.pow(dR, 2) - Math.pow(dB, 2) ) ) / 256.0 )
        );
        closestWRGB.push({n: anc[i].n, c: anc[i].c, p: proximity});
        // console.log("Weighted RGB: "+anc[i].n+" prox="+proximity);
    }
    closestWRGB.sort(proximitySort);

    return closestWRGB[0].c

}


function findNearestColorByRGB(hex) {
    var p1 = splitRGB(hex);
    var closestRGB = new Array();

    for(var i in anc) {
        var p2 = splitRGB(anc[i].c);
        var proximity = Math.sqrt(
            Math.pow((p1['r'] - p2['r']), 2)
            +
            Math.pow((p1['g'] - p2['g']), 2)
            +
            Math.pow((p1['b'] - p2['b']), 2)
        );
        closestRGB.push({n: anc[i].n, c: anc[i].c, p: proximity});
    }

    closestRGB.sort(proximitySort);

    return closestRGB[0].c

}

function findNearestColorDeltaE(hex) {
    var p1 = splitRGB(hex);
    var xyz1 = getXYZ(p1);
    var cielab1 = getCIELab(xyz1);
    var closestDeltaE = new Array();

    for(var i in anc) {
        var p2 = splitRGB(anc[i].c);
        var xyz2 = getXYZ(p2);
        var cielab2 = getCIELab(xyz2);
        var proximity = Math.sqrt(
            Math.pow( ( cielab1['L'] - cielab2['L'] ), 2)
            +
            Math.pow( ( cielab1['a'] - cielab2['a'] ), 2)
            +
            Math.pow( ( cielab1['b'] - cielab2['b'] ), 2)
        );
        closestDeltaE.push({n: anc[i].n, c: anc[i].c, p: proximity});
        // console.log("deltaE: "+anc[i].n+" prox="+proximity);
    }
    closestDeltaE.sort(proximitySort);

    return closestDeltaE[0].c

}

function switchColor(color, mode){

  print ("color in hex: "+color)

  var newColor = ""

  if (mode == "RGB"){
    newColor = findNearestColorByRGB(color)

  } else if (mode == "WRGB"){
    newColor = findNearestColorByWeightedRGB(color)

  } else if (mode == "DELTAH"){
    newColor = findNearestColorDeltaH(color)

  } else if (mode == "DELTAE"){
    newColor = findNearestColorDeltaE(color)

  }


  print ("newColor: "+newColor)

  return MSColorFromString("#"+newColor)

}


function MSColorFromString(color) {
    return MSImmutableColor.colorWithSVGString(color).newMutableCounterpart()
}


function splitRGB(hexcolor) {
    var rgb = new Array();
    if(hexcolor.length==3){
        hexcolor = hexcolor.substr(0,1) + hexcolor.substr(0,1)
            + hexcolor.substr(1,1) + hexcolor.substr(1,1)
            + hexcolor.substr(2,1) + hexcolor.substr(2,1);
    }
    rgb['r'] = parseInt(hexcolor.substring(0, 2), 16);
    rgb['g'] = parseInt(hexcolor.substring(2, 4), 16);
    rgb['b'] = parseInt(hexcolor.substring(4, 6), 16);
    return rgb;
}

function getXYZ(p) {
    var xyz = new Array();
    //sR, sG and sB (Standard RGB) input range = 0 ÷ 255
    //X, Y and Z output refer to a D65/2° standard illuminant.

    var var_R = ( p['r'] / 255.0 );
    var var_G = ( p['g'] / 255.0 );
    var var_B = ( p['b'] / 255.0 );

    if ( var_R > 0.04045 ) { var_R = Math.pow( ( ( var_R + 0.055 ) / 1.055 ), 2.4); }
    else                   { var_R = var_R / 12.92; }
    if ( var_G > 0.04045 ) { var_G = Math.pow( ( ( var_G + 0.055 ) / 1.055 ), 2.4); }
    else                   { var_G = var_G / 12.92; }
    if ( var_B > 0.04045 ) { var_B = Math.pow( ( ( var_B + 0.055 ) / 1.055 ), 2.4); }
    else                   { var_B = var_B / 12.92; }

    var_R = var_R * 100.0;
    var_G = var_G * 100.0;
    var_B = var_B * 100.0;

    xyz['x'] = (var_R * 0.4124) + (var_G * 0.3576) + (var_B * 0.1805);
    xyz['y'] = (var_R * 0.2126) + (var_G * 0.7152) + (var_B * 0.0722);
    xyz['z'] = (var_R * 0.0193) + (var_G * 0.1192) + (var_B * 0.9505);
    return xyz;
}

function getCIELab(xyz) {
    var cielab = new Array();
    //Reference-X, Y and Z refer to specific illuminants and observers.
    //Common reference values are available below in this same page.

    var Reference_X = 100.000;//C: Old daylight
    var Reference_Y = 100.000;//C: Old daylight
    var Reference_Z = 100.000;//C: Old daylight

    var var_X = xyz['x'] / Reference_X;
    var var_Y = xyz['y'] / Reference_Y;
    var var_Z = xyz['z'] / Reference_Z;

    if ( var_X > 0.008856 ) { var_X = Math.pow( var_X, ( 1/3 ) ); }
    else                    { var_X = ( 7.787 * var_X ) + ( 16 / 116 ); }
    if ( var_Y > 0.008856 ) { var_Y = Math.pow( var_Y, ( 1/3 ) ); }
    else                    { var_Y = ( 7.787 * var_Y ) + ( 16 / 116 ); }
    if ( var_Z > 0.008856 ) { var_Z = Math.pow( var_Z, ( 1/3 ) ); }
    else                    { var_Z = ( 7.787 * var_Z ) + ( 16 / 116 ); }

    cielab['L'] = ( 116 * var_Y ) - 16;
    cielab['a'] = 500 * ( var_X - var_Y );
    cielab['b'] = 200 * ( var_Y - var_Z );
    return cielab;
}

function findNearestColorDeltaH(hex) {
    var p1 = splitRGB(hex);
    var xyz1 = getXYZ(p1);
    var cielab1 = getCIELab(xyz1);
    var closestDeltaH = new Array();

    for(var i in anc) {
        var p2 = splitRGB(anc[i].c);
        var xyz2 = getXYZ(p2);
        var cielab2 = getCIELab(xyz2);
        var xDE = Math.sqrt(
            Math.pow( cielab2['a'], 2 )
            +
            Math.pow( cielab2['b'], 2 )
        )
        -
        Math.sqrt(
            Math.pow( cielab1['a'], 2 )
            +
            Math.pow( cielab1['b'], 2 )
        );
        var proximity = Math.sqrt(
            Math.pow( ( cielab2['a'] - cielab1['a'] ), 2)
            +
            Math.pow( ( cielab2['b'] - cielab1['b'] ), 2)
            -
            Math.pow(xDE, 2)
        );
        closestDeltaH.push({n: anc[i].n, c: anc[i].c, p: proximity});
        // console.log("deltaH: "+anc[i].n+" prox="+proximity);
    }
    closestDeltaH.sort(proximitySort);

    return closestDeltaH[0].c

}
