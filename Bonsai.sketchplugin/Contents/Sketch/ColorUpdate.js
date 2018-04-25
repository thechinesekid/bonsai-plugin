@import 'colors.js'

var UI = require('sketch/ui')


function proccessColor(layer, colorMode){

  var sketchLayer = layer.sketchObject

  var layerClass = sketchLayer.class()

  if (layerClass == MSShapeGroup){

    var fill = sketchLayer.style().fills().firstObject()

    var border = sketchLayer.style().borders().firstObject()

    if (fill != null){

      var fillHex = fill.color().immutableModelObject().hexValue().toString()

      fill.color = switchColor(fillHex,colorMode)
    }
    if (border != null){

      var borderHex = border.color().immutableModelObject().hexValue().toString()

      border.color = switchColor(borderHex,colorMode)
    }

  } else if (layerClass == MSTextLayer){


    var fill = sketchLayer.style().fills().firstObject()

    if (fill != null){

      var fillHex = fill.color().immutableModelObject().hexValue().toString()

      fill.color = switchColor(fillHex,colorMode)

    }

  }

}

function traverse(layers, colorMode){

//  log("traverse called: "+ layers.sketchObject.class())

  if (layers.length == 0){
    log ("Error: layers.length == 0")
    return
  }
  else{
    log ("layers.length: "+layers.length)
  }
  if (Array.isArray(layers)){

    var arraryLength = layers.length

    for (var i=0; i<arraryLength; i++){

      var layer = layers[i];

      var type = layer.type

      // log ("name: "+layer.name)
      //
      // log ("type: "+type)

      if (type == 'Layer'){
        log(layer.style.toJSON())

      } else if (type == 'Shape'){
        log(layer.style.toJSON())
        proccessColor(layer,colorMode)

      } else if (type == 'Text'){
        proccessColor(layer,colorMode)

      } else if (type == 'Group'){
        log ("Group found")
        var g = layer.layers
        traverse(g, colorMode)
      } else{
        log ("Other type found.")
      }

    }

  } else{

    log ("Error: layers is not array anymore!")

  }

}

var onRun = function(context) {

  var doc = require('sketch/dom').getSelectedDocument()

  var app = [NSApplication sharedApplication];

  var pages = doc.pages

  var selection = doc.selectedLayers;

  if (selection.isEmpty){

    UI.alert("Select an artboard", "Please select an artboard for the color updater to work on.")

  }else{

    var firstElement = selection.layers[0];

    if (firstElement.type != "Artboard"){

      UI.alert("Buy me a Chick-fil-A Sandwich.", "Layer(s) update is not supported yet. Buy me a spicy chicken sandwich and I will consider it.")

    }
    else{

      log ("yay artboard selected")

      var artboardName = firstElement.name

      for (var i = 0; i<colorModes.length;i++){

        var colorMode = colorModes[i]

        var clone = firstElement.duplicate()

        var x = (clone.frame.width + 100)*(i+1)

        clone.frame = clone.frame.offset(x,0)

        var artboard = clone.sketchObject

        var subffix = ""

        if (colorMode == "WRGB"){
          subffix = "Eye Perception"
        } else if (colorMode == "RGB"){
          subffix = "Strict RGB"
        } else if (colorMode == "DELTAE"){
          subffix = "Delta E"
        } else if (colorMode == "DELTAH"){
          subffix = "Delta H"
        }

        artboard.name = artboardName + " "+subffix

        var hasBG = artboard.hasBackgroundColor()

        if (hasBG == true){

          // print(artboard.immutableBackgroundColor())

        }else{
          log("artboard has no background")
        }


        var cloneLayers = clone.layers

        traverse(cloneLayers, colorMode)

      }



    }

  }

}
