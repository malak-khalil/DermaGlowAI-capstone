from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from models import db
from routes.product_routes import products_bp
from routes.personalised_products_routes import personalised_products_bp
from routes.skin_analysis_routes import skin_analysis_bp
from routes.review_routes import reviews_bp
from routes.auth_routes import auth_bp
from routes.order_routes import orders_bp
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "connect_args": {"timeout": 30}}
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dermaglow-secret-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///skinai.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True
    )

    db.init_app(app)
    app.register_blueprint(products_bp)
    app.register_blueprint(personalised_products_bp)
    app.register_blueprint(skin_analysis_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(orders_bp)

    @app.route("/")
    def home():
        return "<h1>Backend Home Page</h1>"

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)