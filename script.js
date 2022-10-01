const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    clearAll = document.querySelector(".clear-canvas"),
    colorPicker = document.querySelector("#color-picker"),
saveImg = document.querySelector(".save-img")
        
    ctx = canvas.getContext("2d");


let prevMouseX, prevMouseY, snapShot,
    isDrawing = false,
    selectedTool = "brush"
brushWidth = 5,
    selectedColor = "#000";


const setCanvasColor = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}



window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight
    setCanvasColor();
})

const drawRect = (e) => {
    if (!fillColor.checked) {
       return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke()
} 

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke()
} 

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapShot, 0, 0)
    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "brush" ? selectedColor : "#fff"
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e)
    }
    else if (selectedTool === "circle") {
        drawCircle(e)
    }
    else if (selectedTool === "triangle") {
        drawTriangle(e)
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active")
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(btn.id)
    })
})

sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value
    console.log(sizeSlider.value)
})

colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected")
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
})
})

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click()
})

clearAll.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasColor();
})

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL();
    link.click();
    console.log("sAVED")
})

canvas.addEventListener("mousedown", startDraw, false);
canvas.addEventListener("mousemove", drawing, false);
canvas.addEventListener("mouseup", () => isDrawing = false), false;

console.log(canvas);







//let canvas = document.querySelector("canvas");
//     ctx = canvas.getContext("2d");
// ctx.strokeStyle = "#222222";
// ctx.lineWith = 5;
    
// Set up mouse events for draWing
var draWing = false;
var mousePos = { x:0, y:0 };
var lastPos = mousePos;
canvas.addEventListener("mousedown", function (e) {
        draWing = true;
  lastPos = getMousePos(canvas, e);
}, false);
canvas.addEventListener("mouseup", function (e) {
  draWing = false;
}, false);
canvas.addEventListener("mousemove", function (e) {
  mousePos = getMousePos(canvas, e);
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };
}

// Get a regular interval for draWing to the screen
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || 
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimaitonFrame ||
       function (callback) {
    window.setTimeout(callback, 1000/60);
       };
})();

// Draw to the canvas
function rendercanvas() {
    if (draWing) {
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      lastPos = mousePos;
    }
  }
  
// Set up touch events for mobile, etc
const html = document.querySelector("html")
canvas.addEventListener("touchstart", function (e) {
    mousePos = getTouchPos(canvas, e);
var touch = e.touches[0];
var mouseEvent = new MouseEvent("mousedown", {
clientX: touch.clientX,
clientY: touch.clientY
});
canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
var mouseEvent = new MouseEvent("mouseup", {});
canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
var touch = e.touches[0];
var mouseEvent = new MouseEvent("mousemove", {
clientX: touch.clientX,
clientY: touch.clientY
});
canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
var rect = canvasDom.getBoundingClientRect();
return {
x: touchEvent.touches[0].clientX - rect.left,
y: touchEvent.touches[0].clientY - rect.top
};
}

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
      html.style.overflowY = "hidden"
    }  else {
        html.style.overflowY = "scroll"
      }
  }, false);
  document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
        html.style.overflowY = "hidden"
      }
    else {
        html.style.overflowY = "scroll"
      }
  }, false);
  document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
        html.style.overflow = "hidden"
    }  else {
        html.style.overflowY = "scroll"
      }
  }, false);



