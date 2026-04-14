import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Password reset by email will be available soon. Please contact support for now.");
  };

  return (
    <main className="page-with-fixed-navbar">
      <Container className="auth-page">
        <Card className="auth-card">
          <Card.Body>
            <h2 className="auth-title">Forgot Password</h2>

            {message && <Alert variant="info">{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </Form.Group>

              <Button className="auth-submit-button" type="submit">
                Send Reset Request
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}