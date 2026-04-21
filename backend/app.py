import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from models import db
from routes.product_routes import products_bp
from routes.personalised_products_routes import personalised_products_bp
from routes.skin_analysis_routes import skin_analysis_bp
from routes.review_routes import reviews_bp
from routes.auth_routes import auth_bp
from routes.order_routes import orders_bp

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_BUILD = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "build"))


def create_app():
    app = Flask(
        __name__,
        static_folder=FRONTEND_BUILD,
        static_url_path="/"
    )

    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"connect_args": {"timeout": 30}}
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dermaglow-secret-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///skinai.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # If Flask serves the frontend too, CORS is usually not needed.
    # For demo purposes, you can remove this block entirely.
    CORS(app, supports_credentials=True)

    db.init_app(app)

    app.register_blueprint(products_bp)
    app.register_blueprint(personalised_products_bp)
    app.register_blueprint(skin_analysis_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(orders_bp)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        if path.startswith("api/"):
            return {"error": "API route not found"}, 404

        full_path = os.path.join(app.static_folder, path)

        if path and os.path.exists(full_path):
            return send_from_directory(app.static_folder, path)

        return send_from_directory(app.static_folder, "index.html")

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)