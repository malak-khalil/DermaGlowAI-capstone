import re
from flask import Blueprint, jsonify, request, session
from models import db, Product, Order, OrderItem, User
from sqlalchemy.exc import OperationalError

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return None
    return User.query.get(user_id)


def serialize_order(order):
    return {
        "id": order.id,
        "total": float(order.total),
        "status": order.status,
        "payment_status": order.payment_status,
        "payment_method": order.payment_method,
        "address": order.address,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name if item.product else "Unknown Product",
                "quantity": item.quantity,
                "price": float(item.price),
            }
            for item in order.items
        ],
    }


@orders_bp.route("/checkout", methods=["POST"])
def checkout():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    data = request.get_json(silent=True) or {}

    items = data.get("items", [])
    address = (data.get("address") or "").strip()
    postal_code = (data.get("postal_code") or "").strip()
    payment_method = (data.get("payment_method") or "").strip()

    if not isinstance(items, list) or len(items) == 0:
        return jsonify({"error": "Cart items are required."}), 400

    if not address or len(address) < 5:
        return jsonify({"error": "Valid delivery address is required."}), 400

    if not postal_code or len(postal_code) < 3:
        return jsonify({"error": "Valid ZIP / postal code is required."}), 400

    if not payment_method:
        return jsonify({"error": "Payment method is required."}), 400

    # Never allow raw card numbers or CVV to be stored
    if re.search(r"\d{8,}", payment_method):
        return jsonify({"error": "Do not send full card details to the server."}), 400

    total = 0.0
    order_items = []

    for entry in items:
        product_id = entry.get("product_id")
        quantity = entry.get("quantity", 1)

        if not product_id or not isinstance(quantity, int) or quantity <= 0:
            return jsonify({"error": "Invalid product data in cart."}), 400

        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": f"Product with id {product_id} not found."}), 404

        line_price = float(product.price)
        total += line_price * quantity

        order_items.append({
            "product": product,
            "quantity": quantity,
            "price": line_price,
        })

    try:
        order = Order(
            user_id=user.id,
            total=total,
            status="Placed",
            payment_method=payment_method,
            payment_status="Paid",
            address=address,
        )

        db.session.add(order)
        db.session.flush()

        for item in order_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item["product"].id,
                quantity=item["quantity"],
                price=item["price"],
            )
            db.session.add(order_item)

        db.session.commit()

        return jsonify({
            "message": "Order placed successfully.",
            "order": serialize_order(order)
        }), 201

    except OperationalError:
        db.session.rollback()
        return jsonify({
            "error": "Database is locked. Close DB Browser for SQLite and try again."
        }), 500

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": str(e)
        }), 500


@orders_bp.route("/my-orders", methods=["GET"])
def my_orders():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    orders = (
        Order.query
        .filter_by(user_id=user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return jsonify({
        "orders": [serialize_order(order) for order in orders]
    }), 200