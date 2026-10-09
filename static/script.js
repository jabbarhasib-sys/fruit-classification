let selectedFile = null;

// Fruit to Emoji Helper Dictionary
const FRUIT_EMOJIS = {
    apple: "🍎", banana: "🍌", orange: "🍊", lemon: "🍋",
    grape: "🍇", strawberry: "🍓", tomato: "🍅", potato: "🥔",
    pepper: "🫑", peach: "🍑", cherry: "🍒", pineapple: "🍍",
    watermelon: "🍉", mango: "🥭", avocado: "🥑", corn: "🌽",
    eggplant: "🍆", cucumber: "🥒", pear: "🍐", kiwi: "🥝",
    onion: "🧅", garlic: "🧄", carrot: "🥕", broccoli: "🥦"
};

function getEmoji(fruitName) {
    if (!fruitName) return "🥗";
    const lower = fruitName.toLowerCase();
    for (const [key, emoji] of Object.entries(FRUIT_EMOJIS)) {
        if (lower.includes(key)) return emoji;
    }
    return "🍇";
}

// Drag and Drop Listeners Setup
document.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById("dropzone");

    ["dragenter", "dragover"].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove("dragover");
        }, false);
    });

    dropzone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            processSelectedFile(files[0]);
        }
    });
});

function triggerFileInput() {
    document.getElementById("imageInput").click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processSelectedFile(file);
    }
}

function processSelectedFile(file) {
    if (!file.type.startsWith("image/")) {
        showError("Please select a valid image file (JPG, PNG, WEBP).");
        return;
    }

    selectedFile = file;
    hideError();

    // Show Image Preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImage = document.getElementById("previewImage");
        previewImage.src = e.target.result;
        
        document.getElementById("dropzoneContent").style.display = "none";
        document.getElementById("previewContainer").style.display = "flex";
        
        // Show metadata
        const sizeKB = (file.size / 1024).toFixed(1);
        document.getElementById("imageMeta").innerText = `${file.name} (${sizeKB} KB)`;
        
        // Enable Predict Button
        document.getElementById("predictBtn").disabled = false;
    };
    reader.readAsDataURL(file);
}

function clearSelection(event) {
    if (event) event.stopPropagation();
    selectedFile = null;
    document.getElementById("imageInput").value = "";
    document.getElementById("dropzoneContent").style.display = "block";
    document.getElementById("previewContainer").style.display = "none";
    document.getElementById("predictBtn").disabled = true;
    document.getElementById("resultsCard").style.display = "none";
    hideError();
}

// Sample Produce Generator for Instant Testing
function loadSample(type) {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    // Draw realistic colored shape background
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, 300, 300);

    ctx.font = "140px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let emoji = "🍎";
    if (type === "banana") emoji = "🍌";
    if (type === "orange") emoji = "🍊";
    if (type === "lemon") emoji = "🍋";

    ctx.fillText(emoji, 150, 150);

    canvas.toBlob((blob) => {
        const file = new File([blob], `sample_${type}.png`, { type: "image/png" });
        processSelectedFile(file);
    });
}

function uploadImage() {
    if (!selectedFile) {
        showError("Please select or drop an image first.");
        return;
    }

    hideError();
    document.getElementById("loadingStatus").style.display = "flex";
    document.getElementById("predictBtn").disabled = true;

    const formData = new FormData();
    formData.append("image", selectedFile);

    fetch("/predict", {
        method: "POST",
        body: formData
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => { throw new Error(data.error || "Prediction failed"); });
        }
        return res.json();
    })
    .then(data => {
        document.getElementById("loadingStatus").style.display = "none";
        document.getElementById("predictBtn").disabled = false;
        renderResults(data);
    })
    .catch(err => {
        document.getElementById("loadingStatus").style.display = "none";
        document.getElementById("predictBtn").disabled = false;
        showError(err.message || "An error occurred while analyzing the image.");
    });
}

function renderResults(data) {
    const resultsCard = document.getElementById("resultsCard");
    resultsCard.style.display = "flex";

    // Set Emoji & Main Title
    const emoji = getEmoji(data.fruit);
    document.getElementById("resultEmoji").innerText = emoji;
    document.getElementById("predictedFruit").innerText = data.fruit;
    document.getElementById("predictedConfidence").innerText = `${data.confidence}%`;
    document.getElementById("predictionTimestamp").innerText = new Date().toLocaleTimeString();

    // Confidence pill color tuning
    const confPill = document.getElementById("confidencePill");
    if (data.confidence > 70) {
        confPill.style.color = "#4ade80";
    } else if (data.confidence > 40) {
        confPill.style.color = "#facc15";
    } else {
        confPill.style.color = "#f87171";
    }

    // Render Top 5 Breakdown
    const listContainer = document.getElementById("probabilityList");
    listContainer.innerHTML = "";

    if (data.top_predictions && data.top_predictions.length > 0) {
        data.top_predictions.forEach(item => {
            const itemEmoji = getEmoji(item.fruit);
            const probItem = document.createElement("div");
            probItem.className = "prob-item";

            probItem.innerHTML = `
                <div class="prob-header">
                    <span class="prob-name">${itemEmoji} ${item.fruit}</span>
                    <span class="prob-val">${item.confidence}%</span>
                </div>
                <div class="prob-bar-track">
                    <div class="prob-bar-fill" style="width: 0%"></div>
                </div>
            `;
            listContainer.appendChild(probItem);

            // Animate bar width
            setTimeout(() => {
                const fill = probItem.querySelector(".prob-bar-fill");
                if (fill) fill.style.width = `${Math.max(item.confidence, 2)}%`;
            }, 50);
        });
    }

    // Scroll smoothly to results card
    resultsCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showError(msg) {
    const errBanner = document.getElementById("errorMessage");
    document.getElementById("errorText").innerText = msg;
    errBanner.style.display = "flex";
}

function hideError() {
    document.getElementById("errorMessage").style.display = "none";
}

