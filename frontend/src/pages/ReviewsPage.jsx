import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import "../App.css";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    title: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews/");
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      setFormData({
        name: "",
        rating: 5,
        title: "",
        message: ""
      });

      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <main className="reviews-page">
      <Container className="page-with-fixed-navbar reviews-page-container">
        <div className="reviews-hero">
          <h1 className="reviews-title">Customer Reviews</h1>
          <p className="reviews-subtitle">
            Discover what users think about DermaGlow and share your own experience.
          </p>

          <div className="reviews-summary">
            <div className="summary-box">
              <h3>{averageRating}/5</h3>
              <p>Average Rating</p>
            </div>
            <div className="summary-box">
              <h3>{reviews.length}</h3>
              <p>Total Reviews</p>
            </div>
          </div>
        </div>

        <Row className="g-4">
          <Col lg={5}>
            <Card className="review-form-card">
              <Card.Body>
                <h3 className="review-form-title">Leave Your Feedback</h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Fair</option>
                      <option value={1}>1 - Poor</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Review Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Your Feedback</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="review-submit-button"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7}>
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <Card className="single-review-card">
                  <Card.Body>
                    <p className="mb-0">No reviews yet. Be the first to share your feedback.</p>
                  </Card.Body>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="single-review-card mb-3">
                    <Card.Body>
                      <div className="review-top-row">
                        <div>
                          <h5 className="reviewer-name">{review.name}</h5>
                          <p className="review-title-text">{review.title}</p>
                        </div>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="review-message">{review.message}</p>
                      <small className="review-date">
                        {review.created_at || "Recently added"}
                      </small>
                    </Card.Body>
                  </Card>
                ))
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}