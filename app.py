import os
import json
import numpy as np
from PIL import Image
from flask import Flask, render_template, request, jsonify

# Suppress TensorFlow log noise
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
import tensorflow as tf

app = Flask(__name__)

# ---------------- LOAD MODEL ----------------
MODEL_PATH = "fruit_classifier_model.keras"
IMG_SIZE = 100

print("Loading Keras Model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully.")

# ---------------- LOAD CLASS LABELS ----------------
with open("class_labels.json", "r") as f:
    class_indices = json.load(f)

# Reverse mapping: index → class name
index_to_class = {v: k for k, v in class_indices.items()}

# ---------------- ROUTES ----------------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided in request"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Load and convert image safely (handles PNG transparency, RGBA, CMYK, etc.)
        img = Image.open(file)
        if img.mode != "RGB":
            img = img.convert("RGB")
        
        img_resized = img.resize((IMG_SIZE, IMG_SIZE))
        img_array = np.array(img_resized, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Run Prediction
        prediction = model.predict(img_array, verbose=0)[0]
        
        # Calculate Top 1
        class_index = int(np.argmax(prediction))
        fruit = index_to_class[class_index]
        confidence = float(np.max(prediction) * 100)

        # Top 5 breakdown
        top5_indices = np.argsort(prediction)[-5:][::-1]
        top5 = [
            {
                "fruit": index_to_class[idx],
                "confidence": round(float(prediction[idx] * 100), 2)
            }
            for idx in top5_indices
        ]

        return jsonify({
            "success": True,
            "fruit": fruit,
            "confidence": round(confidence, 2),
            "top_predictions": top5
        })

    except Exception as e:
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

# ---------------- RUN APP ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

