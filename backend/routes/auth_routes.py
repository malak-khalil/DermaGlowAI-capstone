from flask import Blueprint, request, jsonify, session
from models import db, User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()
    contact = (data.get("contact") or "").strip()
    address = (data.get("address") or "").strip()

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required."}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already exists."}), 409

    user = User(
        name=name,
        email=email,
        contact=contact,
        address=address
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    session["user_id"] = user.id

    return jsonify({
        "message": "Account created successfully.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "contact": user.contact,
            "address": user.address
        }
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    session["user_id"] = user.id

    return jsonify({
        "message": "Login successful.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "contact": user.contact,
            "address": user.address
        }
    }), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out successfully."}), 200


@auth_bp.route("/me", methods=["GET"])
def get_me():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not authenticated."}), 401

    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"error": "User not found."}), 404

    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "contact": user.contact,
            "address": user.address
        }
    }), 200


@auth_bp.route("/me", methods=["PUT"])
def update_me():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not authenticated."}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json()

    user.name = (data.get("name") or user.name).strip()
    user.contact = (data.get("contact") or user.contact or "").strip()
    user.address = (data.get("address") or user.address or "").strip()

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "contact": user.contact,
            "address": user.address
        }
    }), 200
