from flask import Blueprint, jsonify, request
import tensorflow as tf
import numpy as np
import os

skin_analysis_bp = Blueprint("skin_analysis", __name__, url_prefix="/api/skin-analysis")

SKIN_CLASSES = ["acne", "blackheads", "dark spots", "pores", "wrinkles"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "DermaGlow_model.keras")
MODEL_PATH = os.path.abspath(MODEL_PATH)

model = None
if os.path.exists(MODEL_PATH):
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"Model loaded from: {MODEL_PATH}")
    except Exception as e:
        print(f"Failed to load model: {e}")
else:
    print(f"Model file not found: {MODEL_PATH}")


def predict_skin_concern(image_path):
    if model is None:
        raise RuntimeError("Model is not loaded.")

    img = tf.keras.utils.load_img(image_path, target_size=(256, 256))
    img_array = tf.keras.utils.img_to_array(img).astype("float32")
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_index = np.argmax(prediction)

    return SKIN_CLASSES[predicted_index]


@skin_analysis_bp.route("/", methods=["POST"])
def skin_analysis():
    print("skin analysis route hit")

    if "image" not in request.files:
        print("no image uploaded")
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    print("received file:", image.filename)

    return jsonify({"skin_concern": "acne"})