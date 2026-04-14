from flask import Blueprint, jsonify, session, request
from models import db, Order, OrderItem, Product, User

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


@orders_bp.route("/my-orders", methods=["GET"])
def my_orders():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not authenticated."}), 401

    orders = (
        Order.query
        .filter_by(user_id=user_id)
        .order_by(Order.created_at.desc())
        .all()
    )

    results = []
    for order in orders:
        results.append({
            "id": order.id,
            "total": float(order.total),
            "status": order.status,
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "address": order.address,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": item.product.name if item.product else "Unknown Product",
                    "quantity": item.quantity,
                    "price": float(item.price)
                }
                for item in order.items
            ]
        })

    return jsonify(results), 200


@orders_bp.route("/checkout", methods=["POST"])
def checkout():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not authenticated."}), 401

    data = request.get_json() or {}
    cart = data.get("cart", [])
    address = (data.get("address") or "").strip()
    card_number = (data.get("card_number") or "").strip()

    if not cart:
        return jsonify({"error": "Your cart is empty."}), 400

    try:
        user = User.query.get(user_id)
        if not user:
            session.pop("user_id", None)
            return jsonify({"error": "User not found."}), 404

        if not address:
            address = user.address or ""

        payment_method = "Demo Card"
        if card_number and len(card_number) >= 4:
            payment_method = f"Demo Card ending in {card_number[-4:]}"

        order = Order(
            user_id=user_id,
            total=0,
            status="Placed",
            payment_method=payment_method,
            payment_status="Paid",
            address=address
        )

        db.session.add(order)
        db.session.flush()

        total = 0
        created_items = 0

        for entry in cart:
            product_id = entry.get("id")
            quantity = int(entry.get("quantity", 1))

            if quantity < 1:
                continue

            product = Product.query.get(product_id)
            if not product:
                continue

            unit_price = float(entry.get("price", product.price))
            total += unit_price * quantity

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                price=unit_price
            )

            db.session.add(order_item)
            created_items += 1

        if created_items == 0:
            db.session.rollback()
            return jsonify({"error": "No valid cart items were found."}), 400

        order.total = round(total, 2)
        db.session.commit()

        return jsonify({
            "message": "Order placed successfully.",
            "order_id": order.id,
            "total": round(total, 2)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        db.session.remove()