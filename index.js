let canvas = new fabric.Canvas("canvas", {
  width: 800,
  height: 600,
  backgroundColor: "#CDF5FD",
});

let lineLengthTexts = []; // Array to store length text objects

let addLineBtn = document.getElementById("adding-line");
let activateBtnClicked = false;
addLineBtn.addEventListener("click", activateAddingLine);
function activateAddingLine() {
  if (!activateBtnClicked) {
    activateBtnClicked = true;
    canvas.on("mouse:down", startAddingLine);
    canvas.on("mouse:move", startDrawingLine);
    canvas.on("mouse:up", stopDrawingLine);
    canvas.selection = false;
    canvas.hoverCursor = "auto";

    objectSelectable("added-line", false);
  }
}
let line;
let movePointer = false;

function startAddingLine(O) {
  movePointer = true;
  let pointer = canvas.getPointer(O.e);
  line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
    id: "added-line",
    stroke: "red",
    strokeWidth: 3,
    selectable: false,
  });
  canvas.add(line);
  canvas.renderAll();
  console.log(pointer);
}
function startDrawingLine(O) {
  if (movePointer) {
    let pointer = canvas.getPointer(O.e);
    line.set({
      x2: pointer.x,
      y2: pointer.y,
    });

    // Calculate the length of the line
    let length = calculateLineLength(line);
    console.log("length", length);

    // Calculate the midpoint of the line
    let midpoint = calculateMidpoint(line);
    console.log("midpoint", midpoint);

    // Display length value dynamically on the canvas
    displayLengthValue(length, midpoint, line);

    canvas.renderAll();
  }
}

// playground - started here
function calculateLineLength(line) {
  let p1 = line.get("x1");
  let p2 = line.get("y1");
  let q1 = line.get("x2");
  let q2 = line.get("y2");

  // Distance formula: sqrt((x2 - x1)^2 + (y2 - y1)^2)
  let length = Math.sqrt(Math.pow(q1 - p1, 2) + Math.pow(q2 - p2, 2));
  return length.toFixed(2); // Round to 2 decimal places
}

function calculateMidpoint(line) {
  let p1 = line.get("x1");
  let p2 = line.get("y1");
  let q1 = line.get("x2");
  let q2 = line.get("y2");

  // Midpoint formula: ((x1 + x2) / 2, (y1 + y2) / 2)
  let midpointX = (p1 + q1) / 2;
  let midpointY = (p2 + q2) / 2;

  return { x: midpointX, y: midpointY };
}

function displayLengthValue(length, midpoint, line) {
  debugger;
  // Check if text for this line already exists
  let textObject = line.textObject;

  if (!textObject) {
    // Create new text object for the line length
    let text = new fabric.Text(length, {
      id: "added-line",
      left: midpoint.x,
      top: midpoint.y,
      fontSize: 25,
      fontWeight: "bold",
      fill: "black",
      originX: "center",
      originY: "center",
      selectable: false,
    });
    line.textObject = text; // Associate the text object with the line
    canvas.add(text);
  } else {
    // Update existing text object
    textObject.set({
      text: length,
      left: midpoint.x,
      top: midpoint.y,
      selectable: false,
    });
    canvas.renderAll(); // Render canvas to reflect changes
  }
}

function getObjectById(id) {
  var objects = canvas.getObjects();
  for (var i = 0, len = objects.length; i < len; i++) {
    if (objects[i].id && objects[i].id === id) {
      return objects[i];
    }
  }
  return null;
}

// playground - ending here

function stopDrawingLine() {
  line.setCoords();
  movePointer = false;
}

let deActivateAddingBtnShape = document.getElementById("Deactivate-line");
deActivateAddingBtnShape.addEventListener("click", deActivate);

function deActivate() {
  canvas.off("mouse:down", startAddingLine);
  canvas.off("mouse:move", startDrawingLine);
  canvas.off("mouse:up", stopDrawingLine);

  objectSelectable("added-line", true);
  canvas.hoverCursor = "all-scroll";
  activateBtnClicked = false;
}
function objectSelectable(id, value) {
  debugger;
  canvas.getObjects().forEach((O) => {
    if (O.id === id) {
      console.log("selectable", O);
      O.set({
        selectable: value,
        // textLines: [],
      });
    }
  });
  console.log("canvas", canvas);
}

// below code for select and remove the point line - started here
document.addEventListener("keydown", function (event) {
  debugger;
  // Check if the pressed key is the delete key
  if (event.keyCode === 46 || event.key === "Delete") {
    // Get the selected object on the canvas
    var selectedObject = canvas.getActiveObject();

    // Check if there is a selected object
    if (selectedObject) {
      // Remove the selected object from the canvas
      canvas.remove(selectedObject);
      canvas.discardActiveObject(); // Deselect the object
      canvas.renderAll(); // Render the canvas after removing the object
    }
  }
});
// ending here - select and delete

// Add event listener to the reset button
document.getElementById("resetButton").addEventListener("click", function () {
  resetCanvas(); // Call the resetCanvas function
});
// Function to reset the canvas
function resetCanvas() {
  // Remove all objects from the canvas
  canvas.getObjects().forEach(function (object) {
    canvas.remove(object);
  });

  // Clear any additional arrays or variables you might have used
  lineLengthTexts = []; // Clear the array of text objects
}
