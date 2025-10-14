const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const shapeButtons = document.querySelectorAll(".shape-btn");
const saveBtn = document.getElementById("saveBtn");
const colorButtons = document.querySelectorAll(".color-btn");

let drawing = false;
let erasing = false;
let shapeMode = "pen";

// When child clicks a shape button

document.querySelectorAll(".shape-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        
        shapeMode = btn.dataset.shape; // e.g., "circle", "rectangle", etc.
    });
});

canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    ctx.fillStyle = colorPicker.value; // use selected color

    switch (shapeMode) {
        case "circle":
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.fill();
            break;

        case "rectangle":
            ctx.fillRect(x - 40, y - 25, 80, 50);
            break;

        case "triangle":
            ctx.beginPath();
            ctx.moveTo(x, y - 40);
            ctx.lineTo(x - 40, y + 40);
            ctx.lineTo(x + 40, y + 40);
            ctx.closePath();
            ctx.fill();
            break;

        case "star":
            drawStar(x, y, 5, 30, 15);
            break;

        case "ellipse":
            ctx.beginPath();
            ctx.ellipse(x, y, 60, 40, 0, 0, 2 * Math.PI);
            ctx.fill();
            break;
    }
});

// Helper for star shape
function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.closePath();
    ctx.fill();
}

// 🎨 Freehand Drawing
canvas.addEventListener("mousedown", (e) => {
    if (shapeMode !== "pen") return; // only freehand in pen mode
    drawing = true;

    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = erasing ? "#fff" : colorPicker.value; // set color when starting
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath(); // reset path
});

canvas.addEventListener("mouseout", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing || shapeMode !== "pen") return;

    ctx.strokeStyle = erasing ? "#fff" : colorPicker.value; // always current color
    ctx.lineWidth = brushSize.value;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

// Select all color buttons

colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Get the background color of the button
        const color = window.getComputedStyle(btn).backgroundColor;

        // Update the color picker value
        colorPicker.value = rgbToHex(color);

        // Turn off eraser
        erasing = false;
        eraserBtn.classList.remove("bg-red-700");

        // Highlight selected color
        colorButtons.forEach(c => c.classList.remove("selected"));
        btn.classList.add("selected");
    });
});

// Helper function to convert rgb() to hex
function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result) return "#000000";
    return (
        "#" +
        ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2]))
            .toString(16)
            .slice(1)
    );
}


// 🧽 Eraser toggle
eraserBtn.addEventListener("click", () => {
    erasing = !erasing;
    eraserBtn.classList.toggle("bg-purple-700", erasing);
});

// 🔄 Clear canvas
clearBtn.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// 💾 Save as PNG
saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "my_drawing.png";
    link.href = canvas.toDataURL();
    link.click();
});

// // 🎨 Preset Colors
// colorButtons.forEach(btn => {
//     btn.addEventListener("click", () => {
//         colorPicker.value = btn.style.backgroundColor;
//         erasing = false;
//         eraserBtn.classList.remove("bg-red-700");

//         // highlight selected color
//         colorButtons.forEach(c => c.classList.remove("selected"));
//         btn.classList.add("selected");
//     });
//});
