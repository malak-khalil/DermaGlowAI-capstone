import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cart, clearCart, getTotal } = useCart();

  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: ""
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        state: {
          from: location.pathname,
          message: "Please log in or sign up before payment."
        }
      });
      return;
    }

    if (cart.length === 0) {
      navigate("/checkout");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      cardholderName: user.name || "",
      address: user.address || ""
    }));
  }, [user, cart, navigate, location.pathname]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleConfirmPayment = async () => {
    setError("");
    setSuccessMessage("");

    if (!formData.cardholderName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      setError("Please fill in all payment fields.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          cart,
          address: formData.address,
          card_number: formData.cardNumber
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      clearCart();
      setSuccessMessage(`Order #${data.order_id} placed successfully.`);

      setTimeout(() => {
        navigate("/user-profile");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong while placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-with-fixed-navbar">
      <Container className="payment-page">
        <Card className="payment-card">
          <Card.Body>
            <h2 className="payment-title">Secure Payment</h2>
        

            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Cardholder Name</Form.Label>
                <Form.Control
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  placeholder="Enter cardholder name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </Form.Group>

              <div className="payment-total-text">
                Total: ${getTotal().toFixed(2)}
              </div>

              <Button
                className="checkout-button"
                type="button"
                onClick={handleConfirmPayment}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Confirming...
                  </>
                ) : (
                  "Confirm Payment"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}