const colorMap = [
    [[0, 100, 100, 0], '2'],   // Red (C: 0%, M: 100%, Y: 100%, K: 0%)
    [[100, 100, 0, 0], '3'],   // Blue (C: 100%, M: 100%, Y: 0%, K: 0%)

];


function isMatchingColor(cmykColor, colorObj, tolerance) {
    if (tolerance === undefined) {
        tolerance = 1;
    }
    
    return (
        Math.abs(cmykColor[0] - colorObj.cyan) <= tolerance &&
        Math.abs(cmykColor[1] - colorObj.magenta) <= tolerance &&
        Math.abs(cmykColor[2] - colorObj.yellow) <= tolerance &&
        Math.abs(cmykColor[3] - colorObj.black) <= tolerance
    );
}

// Function to find the corresponding text for the stroke color
function getTextForStrokeColor(strokeColor) {
    for (var i = 0; i < colorMap.length; i++) {
        var cmykValue = colorMap[i][0];
        var textValue = colorMap[i][1];

        if (isMatchingColor(cmykValue, strokeColor)) {
            return textValue; 
        }
    }
    return null;
}

// Check if something is selected
if (app.selection.length > 0) {
    var itemsToRemove = [];

    for (var i = 0; i < app.selection.length; i++) {
        var selectedItem = app.selection[i];

        if (selectedItem.typename === "PathItem") {
            var strokeColor = selectedItem.strokeColor;
            var content = getTextForStrokeColor(strokeColor);

            if (!content) {
                //alert('Undefined color');
                continue;
            }

            var bounds = selectedItem.geometricBounds;
            var xLeft = bounds[0];
            var yTop = bounds[1];
            var xRight = bounds[2];
            var yBottom = bounds[3];

            var centerX = (xLeft + xRight) / 2;
            var centerY = (yTop + yBottom) / 2;

            var textWidth = 10;  // Width of the text box
            var textHeight = 10; // Height of the text box
            var textFrame = app.activeDocument.textFrames.add();

            textFrame.position = [centerX - textWidth / 2, centerY + textHeight / 2];
            textFrame.contents = content;
            textFrame.textRange.size = 12;  // Example font size

            itemsToRemove.push(selectedItem);
        } else {
            //alert("Selected item is not a path.");
            continue;
        }
    }

    for (var j = 0; j < itemsToRemove.length; j++) {
        itemsToRemove[j].remove();
    }

} else {
    alert("Please select one or more paths or brush strokes.");
}
