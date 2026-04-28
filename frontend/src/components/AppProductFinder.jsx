import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function AppProductFinder() {
  const { addToCart, increaseQuantity, decreaseQuantity, getProductQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const questions = [
    {
      key: "gender",
      question: "What is your gender?",
      options: ["Male", "Female", "Prefer not to answer"]
    },
    {
      key: "age",
      question: "What is your age?",
      options: ["Below 20", "20-30", "31-40", "Above 40"]
    },
    {
      key: "skinConcern",
      question: "What is your primary Skin Concern?",
      options: ["Acne", "Blackheads", "Dark Spots", "Pores", "Wrinkles",{ label: "No specific concerns", value: "normal" }]
    },
    {
      key: "skinType",
      question: "What is your skin type?",
      options: ["Oily", "Dry", "Combination", "Normal", "Sensitive"]
    },
    {
      key: "sunExposure",
      question: "How often are you exposed to sunlight?",
      options: ["Rarely", "Occasionally", "Daily for 1-2 hours", "Daily for 3+ hours"]
    },
    {
      key: "makeup",
      question: "Do you wear makeup regularly?",
      options: ["Yes, daily", "Occasionally", "No"]
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    gender: "",
    age: "",
    skinConcern: "",
    skinType: "",
    sunExposure: "",
    makeup: ""
  });

  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [routine, setRoutine] = useState({ morning: [], evening: [] });
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");

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

  const handleAnswerClick = async (selectedOption) => {
    const currentQuestion = questions[currentStep];

    const updatedAnswers = {
      ...answers,
      [currentQuestion.key]: selectedOption
    };

    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    await fetchRecommendations(updatedAnswers);
  };

  const fetchRecommendations = async (finalAnswers) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/personalised-products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(finalAnswers)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recommendations");
      }

      setRecommendedProducts(data.recommended_products || []);
      setRoutine(data.routine || { morning: [], evening: [] });
      setShowResults(true);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetFinder = () => {
    setCurrentStep(0);
    setAnswers({
      gender: "",
      age: "",
      skinConcern: "",
      skinType: "",
      sunExposure: "",
      makeup: ""
    });
    setRecommendedProducts([]);
    setRoutine({ morning: [], evening: [] });
    setShowResults(false);
    setError("");
  };

  if (loading) {
    return (
      <Container className="product-finder-page">
        <div className="finder-loading-box">
          <Spinner animation="border" role="status" className="finder-spinner" />
          <h2 className="finder-loading-title">Preparing your personalised skincare picks...</h2>
          <p className="finder-loading-text">
            Sit back and relax while we choose the best cleanser, serum, moisturiser, and sunscreen for you.
          </p>
        </div>
      </Container>
    );
  }

  if (showResults) {
    return (
      <Container className="product-finder-page">
        <div className="finder-results-header">
          <h2 className="shop-heading">Your Personalised Recommendations</h2>
          <p className="finder-results-subtitle">
            One best product from each category, selected for your skin profile.
          </p>
        </div>

        {recommendedProducts.length === 0 ? (
          <h2>No personalised product recommendations fetched!</h2>
        ) : (
          <>
            <Row className="cards-row">
              {recommendedProducts.map((product) => {
                const quantity = getProductQuantity(product.id);

                return (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={4} xl={3}>
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

            <div className="finder-routine-box">
              <h3 className="finder-routine-title">Suggested Skincare Routine</h3>

              <div className="finder-routine-columns">
                <div className="finder-routine-card">
                  <h4>Morning</h4>
                  <ul>
                    {routine.morning?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="finder-routine-card">
                  <h4>Evening</h4>
                  <ul>
                    {routine.evening?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="finder-reset-wrap">
                <Button className="finder-reset-button" onClick={resetFinder}>
                  Start Again
                </Button>
              </div>
            </div>
          </>
        )}

        {error && <p className="text-danger mt-3">{error}</p>}
      </Container>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <Container className="product-finder-page">
      <div className="finder-question-box">
        <h1 className="finder-question-title">{currentQuestion.question}</h1>

        <div className="finder-options-wrap">
          {currentQuestion.options.map((option) => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return (
            <Button
              key={label}
              className="option-buttons finder-option-button"
              onClick={() => handleAnswerClick(value)}
            >{label}
            </Button>);
          })}
        </div>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}
    </Container>
  );
}