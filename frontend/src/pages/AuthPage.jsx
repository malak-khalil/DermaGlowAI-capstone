import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

import React, { useState } from "react";
import { Card, Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: ""
  });

  const from = location.state?.from || "/user-profile";
  const message = location.state?.message || "";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await signup(formData);
      }

      navigate(from);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="page-with-fixed-navbar">
      <Container className="auth-page">
        <Card className="auth-card">
          <Card.Body>
            <div className="auth-toggle-wrap">
              <Button
                className={mode === "login" ? "auth-tab active" : "auth-tab"}
                onClick={() => setMode("login")}
              >
                Login
              </Button>
              <Button
                className={mode === "signup" ? "auth-tab active" : "auth-tab"}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </Button>
            </div>

            <h2 className="auth-title">
              {mode === "login" ? "Welcome Back" : "Create Your Account"}
            </h2>

            {message && <Alert variant="warning">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      name="contact"
                      type="text"
                      value={formData.contact}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>

              {mode === "login" && (
                <div className="forgot-password-text">
                    <span
                        className="forgot-password-link"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </span>
                </div>
              )}
              
              <Button className="auth-submit-button" type="submit">
                {mode === "login" ? "Login" : "Create Account"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}