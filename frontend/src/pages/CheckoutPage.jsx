import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Button, Image, Row, Col, Container, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        state: {
          from: location.pathname,
          message: "Please log in or sign up before checkout."
        }
      });
    }
  }, [user, navigate, location.pathname]);

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth", {
        state: {
          from: location.pathname,
          message: "Please log in or sign up before checkout."
        }
      });
      return;
    }

    navigate("/payment");
  };

  return (
    <main className="page-with-fixed-navbar">
      <Container>
        <div className="checkout-page">
          <h2>Your Shopping Cart</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty!</p>
          ) : (
            <>
              {cart.map((item) => (
                <Card className="checkout-products" key={`${item.id}-${item.category}`}>
                  <Row className="align-items-center">
                    <Col>
                      <Image src={item.image} alt={item.name} className="checkout-product-images" rounded fluid />
                    </Col>
                    <Col>
                      <strong>{item.name}</strong>
                      <p className="text-muted">{item.category}</p>
                    </Col>
                    <Col>
                      <div className="quantity-section">
                        <Button
                          className="quantity-change-button"
                          variant="outline-dark"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.category, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>

                        <span className="quantity-text">{item.quantity}</span>

                        <Button
                          className="quantity-change-button"
                          variant="outline-dark"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.category, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                        >
                          +
                        </Button>
                      </div>
                    </Col>
                    <Col>
                      <strong>{Number(item.price * item.quantity).toFixed(2)}</strong>
                    </Col>
                    <Col>
                      <Button
                        className="product-del-button"
                        size="sm"
                        onClick={() => removeFromCart(item.id, item.category)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}

              <Card className="checkout-section">
                <div className="checkout-summary-box">
                  <div className="checkout-summary-row">
                    <span className="checkout-summary-label">Order Total</span>
                    <span className="checkout-summary-price">${getTotal().toFixed(2)}</span>
                  </div>

                  <p className="checkout-summary-note">
                    Secure checkout with your selected items and quantities.
                  </p>

                  <Button
                    className="checkout-button"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Pay Securely
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}