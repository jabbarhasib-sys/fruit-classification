# 🍓 Fruit & Vegetable AI Classifier

An AI-powered web application built with **Flask** and **TensorFlow** that classifies **232 produce categories** in real time using a Convolutional Neural Network (CNN).

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15+-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)

---

## ✨ Features

- **232 Produce Categories**: High-resolution classification across apples, bananas, citrus, berries, exotic fruits, and root vegetables.
- **Top 5 Probability Breakdown**: Displays primary prediction alongside animated confidence distribution for top 5 matches.
- **Modern Glassmorphism UI**: High-end translucent dark design with fluid background animations and Google Fonts (`Outfit` & `Inter`).
- **Drag & Drop Uploads**: Interactive dropzone with preview, metadata display, and file validation (JPG, PNG, WEBP).
- **Quick Sample Testing**: One-click sample test buttons for instant prediction testing without uploading external images.

---

## 📁 Project Structure

```
fruit-classifier-app/
├── app.py                      # Flask API backend & Keras model inference
├── fruit_classifier_model.keras # Pre-trained Keras CNN model weights
├── class_labels.json           # 232 Class index mapping dictionary
├── requirements.txt            # Python dependencies
├── static/
│   ├── style.css               # Glassmorphism design system & micro-animations
│   └── script.js               # Frontend drag & drop, AJAX, & UI rendering
├── templates/
│   └── index.html              # Main application template
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start

### 1. Clone & Navigate
```bash
git clone https://github.com/your-username/fruit-classifier-app.git
cd fruit-classifier-app
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Application
```bash
python app.py
```
Open your browser at **http://localhost:5000**.

---

## ⚡ API Endpoint

### `POST /predict`
Uploads an image file for classification.

**Request Body:** `multipart/form-data` with `image` field.

**Response Example:**
```json
{
  "success": true,
  "fruit": "Apple Red 1",
  "confidence": 98.45,
  "top_predictions": [
    { "fruit": "Apple Red 1", "confidence": 98.45 },
    { "fruit": "Apple Granny Smith", "confidence": 1.12 },
    { "fruit": "Peach 1", "confidence": 0.23 },
    { "fruit": "Plum 1", "confidence": 0.11 },
    { "fruit": "Nectarine 1", "confidence": 0.09 }
  ]
}
```

---

## 🛠️ Built With

- **Backend**: Python 3.11, Flask, TensorFlow / Keras, Pillow, NumPy
- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), ES6 JavaScript, FontAwesome

Developed by **Team Jabbar**.
