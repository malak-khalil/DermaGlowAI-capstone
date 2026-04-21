import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Container, Card, Button, Spinner, Col, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import RevealOnScroll from "../components/RevealOnScroll";

export default function ProductFinderPage() {
  const { addToCart, increaseQuantity, decreaseQuantity, getProductQuantity } = useCart();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    gender: "",
    age: "",
    skinConcern: "",
    skinType: "",
    sunExposure: "",
    makeup: ""
  });

  const [isComplete, setIsComplete] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [routine, setRoutine] = useState({ morning: [], evening: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const questions = [
    { key: "gender", question: "What is your gender?", options: ["Male", "Female", "Prefer not to answer"] },
    { key: "age", question: "What is your age?", options: ["Below 20", "20-30", "31-40", "Above 40"] },
    { key: "skinConcern", question: "What is your primary Skin Concern?", options: ["Acne", "Blackheads", "Dark Spots", "Pores", "Wrinkles"] },
    { key: "skinType", question: "What is your skin type?", options: ["Oily", "Dry", "Combination", "Normal", "Sensitive"] },
    { key: "sunExposure", question: "How often are you exposed to sunlight?", options: ["Rarely", "Occasionally", "Daily for 1-2 hours", "Daily for 3+ hours"] },
    { key: "makeup", question: "Do you wear makeup regularly?", options: ["Yes, daily", "Occasionally", "No"] }
  ];

  const current = questions[step];

  const handleAnswers = async (value) => {
    const key = current.key;
    const finalAnswers = { ...answers, [key]: value };
    setAnswers(finalAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
      await fetchPersonalisedProducts(finalAnswers);
    }
  };

  const fetchPersonalisedProducts = async (finalAnswers) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/personalised-products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch personalised products");
      }

      setRecommendedProducts(data.recommended_products || []);
      setRoutine(data.routine || { morning: [], evening: [] });
    } catch (err) {
      console.error("Error fetching personalised products", err);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetFinder = () => {
    setStep(0);
    setAnswers({
      gender: "",
      age: "",
      skinConcern: "",
      skinType: "",
      sunExposure: "",
      makeup: ""
    });
    setIsComplete(false);
    setRecommendedProducts([]);
    setRoutine({ morning: [], evening: [] });
    setError("");
  };

  const handleProtectedAddToCart = (product) => {
  if (!user) {
    navigate("/auth", {
      state: {
        from: location.pathname,
        message: "Please log in or sign up to add products to your cart."
      }
    });
    return;
  }

  addToCart(product);
};

  return (
    <main className="page-with-fixed-navbar">
      <Container className="product-finder-page">
    {!isComplete ? (
  <RevealOnScroll>
    <>
      <h2 className="questions">{current.question}</h2>

      {current.options.map((option, index) => (
        <Button
          className="option-buttons"
          key={index}
          onClick={() => handleAnswers(option)}
        >
          {option}
        </Button>
      ))}
    </>
  </RevealOnScroll>
) : (
  <>
    {loading ? (
      <RevealOnScroll>
        <div className="finder-loading-box">
          <Spinner />
          <h3>
            Sit back & relax.. <br />
            while our AI tool fetches the perfect products for you <br />
            and a bonus skincare routine!
          </h3>
        </div>
      </RevealOnScroll>
    ) : (
      <>
        <RevealOnScroll>
          <Button className="top-heading-button">
            AI - Generated Personalised Product Recommendations
          </Button>
        </RevealOnScroll>

        {recommendedProducts.length > 0 ? (
          <>
            <RevealOnScroll delay={100}>
              <Row className="cards-row">
                {recommendedProducts.map((product) => {
                  const quantity = getProductQuantity(product.id);

                  return (
                    <Col key={product.id}>
                      <Card className="shop-page-cards">
                        <Card.Body>
                          <Card.Title>{product.skin_concern}</Card.Title>

                          <div className="product-image-wrapper">
                            <Card.Img
                              src={product.image}
                              alt={product.name}
                              className="product-image"
                            />
                          </div>

                          <Card.Subtitle>{product.name}</Card.Subtitle>
                          <Card.Text>{product.description}</Card.Text>
                          <Card.Title>${Number(product.price).toFixed(2)}</Card.Title>

                          {quantity === 0 ? (
                            <Button
                              className="shop-page-buttons"
                              size="lg"
                              onClick={() => handleProtectedAddToCart(product)}
                            >
                              Add to Cart
                            </Button>
                          ) : (
                            <div className="quantity-controls">
                              <Button
                                className="qty-btn"
                                onClick={() => decreaseQuantity(product.id)}
                              >
                                -
                              </Button>

                              <span className="qty-number">{quantity}</span>

                              <Button
                                className="qty-btn"
                                onClick={() => increaseQuantity(product)}
                              >
                                +
                              </Button>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <Button className="heading-button">Suggested Routine</Button>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <Row className="recommendations">
                <Col md={6}>
                  <Card className="routine">
                    <Card.Subtitle className="pt-2">
                      <u>Morning Routine</u>
                    </Card.Subtitle>
                    <Card.Text>
                      <ul>
                        {routine.morning.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </Card.Text>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="routine">
                    <Card.Subtitle className="pt-2">
                      <u>Evening Routine</u>
                    </Card.Subtitle>
                    <Card.Text>
                      <ul>
                        {routine.evening.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </Card.Text>
                  </Card>
                </Col>
              </Row>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Button className="recommend-button" onClick={resetFinder}>
                  Start Again
                </Button>
              </div>
            </RevealOnScroll>
          </>
        ) : (
          <p>No personalised product recommendations fetched!</p>
        )}

        {error && <p className="text-danger mt-3">{error}</p>}
      </>
    )}
  </>
)}
      </Container>
    </main>
  );
}