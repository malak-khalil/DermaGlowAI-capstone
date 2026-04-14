from flask import Blueprint, jsonify, request
from models import db, Review

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/reviews")


@reviews_bp.route("/", methods=["GET"])
def get_reviews():
    reviews = Review.query.order_by(Review.id.desc()).all()
    return jsonify([
        {
            "id": review.id,
            "name": review.name,
            "rating": review.rating,
            "title": review.title,
            "message": review.message,
            "created_at": review.created_at.strftime("%Y-%m-%d %H:%M") if review.created_at else None
        }
        for review in reviews
    ])


@reviews_bp.route("/", methods=["POST"])
def create_review():
    data = request.get_json()

    new_review = Review(
        name=data["name"],
        rating=int(data["rating"]),
        title=data["title"],
        message=data["message"]
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({"message": "Review added successfully"}), 201