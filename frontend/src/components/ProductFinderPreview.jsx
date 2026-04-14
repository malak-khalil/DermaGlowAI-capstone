import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ProductFinderPreview() {
  const navigate = useNavigate();

  return (
    <section className="product-finder-preview-section">
      <Container>
        <Row className="align-items-center product-finder-preview-row">
          <Col md={6} className="product-finder-preview-text">
            <h2 className="product-finder-preview-title">Product Finder</h2>
            <p className="product-finder-preview-subtitle">
              Find what your skin will love.
            </p>
            <p className="product-finder-preview-description">
              Answer a few simple questions and let DermaGlow recommend the best
              cleanser, serum, moisturiser, and sunscreen for your skin needs.
            </p>

            <Button
              className="product-finder-preview-button"
              onClick={() => navigate("/product-finder")}
            >
              Find My Products
            </Button>
          </Col>

          <Col md={6} className="text-center">
            <Image
              src="/images/product-finder-preview.jpg"
              alt="Product Finder Preview"
              fluid
              className="product-finder-preview-image"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}