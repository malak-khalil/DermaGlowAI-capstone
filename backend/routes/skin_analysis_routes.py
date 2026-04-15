import os
import traceback
import numpy as np
import tensorflow as tf
from flask import Blueprint, jsonify, request

skin_analysis_bp = Blueprint("skin_analysis", __name__, url_prefix="/api/skin-analysis")

# IMPORTANT:
# This order MUST match the exact order used during training.
SKIN_CLASSES = ["acne", "blackheads", "dark spots", "pores", "wrinkles"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
MODEL_PATH = os.path.join(BACKEND_DIR, "models", "DermaGlow_model.keras")

# IMPORTANT:
# Set this to True only if your training used rescale=1./255
TRAIN_USED_RESCALE_255 = True

# Confidence threshold for returning "uncertain"
CONFIDENCE_THRESHOLD = 0.60

print("MODEL PATH:", MODEL_PATH, flush=True)
print("MODEL EXISTS:", os.path.exists(MODEL_PATH), flush=True)

model = None
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully.", flush=True)
    print("MODEL INPUT SHAPE:", model.input_shape, flush=True)
except Exception as e:
    print("Failed to load model:", str(e), flush=True)


def preprocess_image(image_path):
    if model is None:
        raise RuntimeError("Model is not loaded.")

    input_h = model.input_shape[1]
    input_w = model.input_shape[2]

    img = tf.keras.utils.load_img(image_path, target_size=(input_h, input_w))
    img_array = tf.keras.utils.img_to_array(img).astype("float32")

    if TRAIN_USED_RESCALE_255:
        img_array = img_array / 255.0

    img_array = np.expand_dims(img_array, axis=0)
    return img_array


def predict_skin_concern(image_path):
    if model is None:
        raise RuntimeError("Model is not loaded.")

    img_array = preprocess_image(image_path)
    prediction = model.predict(img_array, verbose=0)[0]

    predicted_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))
    predicted_label = SKIN_CLASSES[predicted_index]

    top_indices = np.argsort(prediction)[::-1][:3]
    top_predictions = [
        {
            "label": SKIN_CLASSES[int(i)],
            "confidence": round(float(prediction[int(i)]), 4)
        }
        for i in top_indices
    ]

    print("RAW PREDICTION:", prediction, flush=True)
    print("PREDICTED INDEX:", predicted_index, flush=True)
    print("PREDICTED LABEL:", predicted_label, flush=True)
    print("CONFIDENCE:", confidence, flush=True)
    print("TOP 3:", top_predictions, flush=True)

    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "skin_concern": "uncertain",
            "confidence": round(confidence, 4),
            "top_predictions": top_predictions
        }

    return {
        "skin_concern": predicted_label,
        "confidence": round(confidence, 4),
        "top_predictions": top_predictions
    }


@skin_analysis_bp.route("/", methods=["POST"])
def skin_analysis():
    print("skin analysis route hit", flush=True)
    image_path = None

    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image = request.files["image"]

        if not image.filename:
            return jsonify({"error": "No selected file"}), 400

        print("received file:", image.filename, flush=True)

        upload_dir = os.path.join(BACKEND_DIR, "uploads")
        os.makedirs(upload_dir, exist_ok=True)

        image_path = os.path.join(upload_dir, image.filename)
        image.save(image_path)

        result = predict_skin_concern(image_path)

        return jsonify(result), 200

    except Exception as e:
        print("SKIN ANALYSIS ERROR:", str(e), flush=True)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        if image_path and os.path.exists(image_path):
            os.remove(image_path)