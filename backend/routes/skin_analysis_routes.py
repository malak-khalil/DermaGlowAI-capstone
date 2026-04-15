import os
import traceback
import numpy as np
import tensorflow as tf
from flask import Blueprint, jsonify, request

skin_analysis_bp = Blueprint("skin_analysis", __name__, url_prefix="/api/skin-analysis")

SKIN_CLASSES = ["acne", "blackheads", "dark spots", "pores", "wrinkles"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

MODEL_PATH = os.path.join(BACKEND_DIR, "models", "DermaGlow_model.keras")

print("MODEL PATH:", MODEL_PATH, flush=True)
print("MODEL EXISTS:", os.path.exists(MODEL_PATH), flush=True)

model = None
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully.", flush=True)
    print("MODEL INPUT SHAPE AT LOAD:", model.input_shape, flush=True)
except Exception as e:
    print("Failed to load model:", str(e), flush=True)


def predict_skin_concern(image_path):
    print("entered predict_skin_concern()", flush=True)

    if model is None:
        raise RuntimeError("Model is not loaded.")

    print("MODEL INPUT SHAPE:", model.input_shape, flush=True)

    input_h = model.input_shape[1]
    input_w = model.input_shape[2]

    img = tf.keras.utils.load_img(image_path, target_size=(input_h, input_w))
    img_array = tf.keras.utils.img_to_array(img).astype("float32")

    # Uncomment this ONLY if you trained with rescale=1./255
    # img_array = img_array / 255.0

    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_index = int(np.argmax(prediction, axis=1)[0])

    print("RAW PREDICTION:", prediction, flush=True)
    print("PREDICTED INDEX:", predicted_index, flush=True)
    print("CLASS ORDER:", SKIN_CLASSES, flush=True)

    return SKIN_CLASSES[predicted_index]


@skin_analysis_bp.route("/", methods=["POST"])
def skin_analysis():
    print("skin analysis route hit", flush=True)

    image_path = None

    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image = request.files["image"]
        print("received file:", image.filename, flush=True)

        upload_dir = os.path.join(BACKEND_DIR, "uploads")
        os.makedirs(upload_dir, exist_ok=True)

        image_path = os.path.join(upload_dir, image.filename)
        image.save(image_path)

        skin_concern = predict_skin_concern(image_path)
        print("FINAL SKIN CONCERN:", skin_concern, flush=True)

        return jsonify({"skin_concern": skin_concern}), 200

    except Exception as e:
        print("SKIN ANALYSIS ERROR:", str(e), flush=True)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        if image_path and os.path.exists(image_path):
            os.remove(image_path)