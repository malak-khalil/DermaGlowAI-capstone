import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserProfilePage() {
  const { user, logout, fetchMe } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        state: {
          from: location.pathname,
          message: "Please log in to access your profile.",
        },
      });
      return;
    }

    setProfile({
      name: user.name || "",
      email: user.email || "",
      contact: user.contact || "",
      address: user.address || "",
    });

    fetchOrders();
  }, [user, navigate, location.pathname]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/my-orders", {
        credentials: "include",
      });

      if (!res.ok) {
        setOrders([]);
        return;
      }

      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: profile.name,
          contact: profile.contact,
          address: profile.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setMessage("");
      setShowSuccessToast(true);
      await fetchMe();
    } catch (err) {
      setMessage(err.message);
      setShowSuccessToast(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <main className="page-with-fixed-navbar">
      <Container className="profile-page">
        <Row className="g-4 align-items-stretch">
          <Col md={5} className="d-flex">
            <Card className="profile-card profile-left-card w-100">
              <Card.Body className="profile-card-body">
                <h2 className="profile-title">Personal Information</h2>

                {message && <p className="profile-message">{message}</p>}

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      value={profile.email}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      name="contact"
                      value={profile.contact}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="profile-actions">
                    <Button
                      type="button"
                      className="profile-save-button"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>

                    <Button
                      type="button"
                      className="profile-logout-button"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right profile-btn-icon"></i>
                      Logout
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={7} className="d-flex">
            <Card className="profile-card profile-orders-card w-100">
              <Card.Body className="profile-card-body">
                <h2 className="profile-title">Orders & Payment History</h2>

                <div className="orders-scroll-box">
                  {orders.length === 0 ? (
                    <p>No orders yet.</p>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="order-history-box">
                        <h5>Order #{order.id}</h5>
                        <p><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Payment:</strong> {order.payment_status}</p>
                        <p><strong>Method:</strong> {order.payment_method || "Online Payment"}</p>

                        <ul>
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.product_name} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="bottom-center" className="p-3 profile-toast-wrap">
        <Toast
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          delay={2200}
          autohide
          className="profile-toast"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">DermaGlow</strong>
          </Toast.Header>
          <Toast.Body>Profile updated successfully.</Toast.Body>
        </Toast>
      </ToastContainer>
    </main>
  );
}