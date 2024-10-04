// Function to check if the stroke color is red (#FF0000)
function isRed(color) {
    if (color.typename === "SpotColor") {
        var spot = color.spot;
        return spot.color.red == 255 && spot.color.green == 0 && spot.color.blue == 0;
    } else if (color.typename === "RGBColor") {
        return color.red == 255 && color.green == 0 && color.blue == 0;
    } else if (color.typename === "CMYKColor") {
        return color.cyan == 0 && color.magenta == 100 && color.yellow == 100 && color.black == 0;
    }
    return false;
}

// Function to check if the stroke color is blue (#0000FF)
function isBlue(color) {
    if (color.typename === "SpotColor") {
        var spot = color.spot;
        return spot.color.red == 0 && spot.color.green == 0 && spot.color.blue == 255;
    } else if (color.typename === "RGBColor") {
        return color.red == 0 && color.green == 0 && color.blue == 255;
    } else if (color.typename === "CMYKColor") {
        return color.cyan == 100 && color.magenta == 100 && color.yellow == 0 && color.black == 0;
    }
    return false;
}
// Check if something is selected
if (app.selection.length > 0) {
    // Store items to be removed later
    var itemsToRemove = [];

    // Loop through the selected items
    for (var i = 0; i < app.selection.length; i++) {
        var selectedItem = app.selection[i];

        // Check if the selected item is a path (i.e., brush stroke, dot, or any other path)
        if (selectedItem.typename === "PathItem") {

            // Get the stroke color of the path (dot)
            var strokeColor = selectedItem.strokeColor;

            // Initialize the content (number) to be inserted
            var content = "";

            // Check if the stroke color is red or blue, and map the number
            if (isRed(strokeColor)) {
                content = "2";  // Red -> 2
            } else if (isBlue(strokeColor)) {
                content = "3";  // Blue -> 3
            } else {
                // Skip if the color is neither red nor blue
                alert("Skipping item with unrecognized stroke color.");
                continue;
            }

            // Get the geometric bounds of the path (left, top, right, bottom)
            var bounds = selectedItem.geometricBounds;
            var xLeft = bounds[0];
            var yTop = bounds[1];
            var xRight = bounds[2];
            var yBottom = bounds[3];

            // Calculate the center of the path
            var centerX = (xLeft + xRight) / 2;
            var centerY = (yTop + yBottom) / 2;

            // Create a new text frame at the center of each selected item
            var textWidth = 10;  // Width of the text box
            var textHeight = 10; // Height of the text box
            var textFrame = app.activeDocument.textFrames.add();

            // Set the position of the text frame (adjust position to center it)
            textFrame.position = [centerX - textWidth / 2, centerY + textHeight / 2];

            // Set the text content based on the color
            textFrame.contents = content;

            // Set the text size and font
            textFrame.textRange.size = 12;  // Example font size

            // Add the path to the list of items to remove
            itemsToRemove.push(selectedItem);
        } else {
            // Notify the user if a selected item is not a path
            alert("Selected item is not a path.");
        }
    }

    // Remove the original path items after processing all selections
    for (var j = 0; j < itemsToRemove.length; j++) {
        itemsToRemove[j].remove();
    }

} else {
    // Notify the user if nothing is selected
    alert("Please select one or more paths or brush strokes.");
}
 
