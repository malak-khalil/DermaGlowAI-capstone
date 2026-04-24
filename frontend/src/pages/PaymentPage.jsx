import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function cleanCardNumber(value) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value) {
  return cleanCardNumber(value)
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectCardBrand(cardNumber) {
  const number = cleanCardNumber(cardNumber);

  if (/^4/.test(number)) return "visa";

  if (
    /^(5[1-5])/.test(number) ||
    /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(number)
  ) {
    return "mastercard";
  }

  if (/^3[47]/.test(number)) return "amex";

  if (/^6(?:011|5|4[4-9])/.test(number)) return "discover";

  return "unknown";
}

function getValidCardLengths(brand) {
  switch (brand) {
    case "visa":
      return [13, 16, 19];
    case "mastercard":
      return [16];
    case "amex":
      return [15];
    case "discover":
      return [16, 19];
    default:
      return [13, 14, 15, 16, 17, 18, 19];
  }
}

function isValidLuhn(cardNumber) {
  const digits = cleanCardNumber(cardNumber);

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(digits[i], 10);

    if (Number.isNaN(digit)) return false;

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function isRepeatedDigits(cardNumber) {
  const digits = cleanCardNumber(cardNumber);
  return /^(\d)\1+$/.test(digits);
}

function validateExpiryDate(expiryDate) {
  const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);

  if (!match) return "Use MM/YY format.";

  const month = parseInt(match[1], 10);
  const year = parseInt(`20${match[2]}`, 10);

  if (month < 1 || month > 12) {
    return "Enter a valid month.";
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card is expired.";
  }

  return "";
}

function validateCVV(cvv, brand) {
  if (!/^\d{3,4}$/.test(cvv)) {
    return "CVV must be 3 or 4 digits.";
  }

  if (brand === "amex" && !/^\d{4}$/.test(cvv)) {
    return "American Express CVV must be 4 digits.";
  }

  if (brand !== "amex" && !/^\d{3}$/.test(cvv)) {
    return "CVV must be 3 digits for this card type.";
  }

  return "";
}

function validatePaymentForm(values) {
  const errors = {};
  const number = cleanCardNumber(values.cardNumber);
  const brand = detectCardBrand(values.cardNumber);

  if (!values.cardholderName.trim()) {
    errors.cardholderName = "Cardholder name is required.";
  } else if (!/^[A-Za-z\s'-]{2,}$/.test(values.cardholderName.trim())) {
    errors.cardholderName = "Enter a valid cardholder name.";
  }

  if (!number) {
    errors.cardNumber = "Card number is required.";
  } else {
    const validLengths = getValidCardLengths(brand);

    if (brand === "unknown") {
      errors.cardNumber = "Unsupported card type.";
    } else if (!validLengths.includes(number.length)) {
      errors.cardNumber = `Invalid card length for ${brand}.`;
    } else if (isRepeatedDigits(values.cardNumber)) {
      errors.cardNumber = "Enter a valid card number.";
    } else if (!isValidLuhn(values.cardNumber)) {
      errors.cardNumber = "Invalid card number.";
    }
  }

  const expiryError = validateExpiryDate(values.expiryDate);
  if (expiryError) {
    errors.expiryDate = expiryError;
  }

  if (!values.cvv.trim()) {
    errors.cvv = "CVV is required.";
  } else {
    const cvvError = validateCVV(values.cvv, brand);
    if (cvvError) errors.cvv = cvvError;
  }

  if (!values.address.trim()) {
    errors.address = "Delivery address is required.";
  } else if (values.address.trim().length < 5) {
    errors.address = "Enter a more complete address.";
  }

  if (!values.postalCode.trim()) {
    errors.postalCode = "ZIP / postal code is required.";
  } else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(values.postalCode.trim())) {
    errors.postalCode = "Enter a valid ZIP / postal code.";
  }

  return errors;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        state: {
          from: "/payment",
          message: "Please log in or sign up to complete payment.",
        },
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        cardholderName: prev.cardholderName || user.name || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/checkout");
    }
  }, [cart, navigate]);

  const total = useMemo(() => getTotal(), [getTotal]);
  const cardBrand = detectCardBrand(formData.cardNumber);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === "cardNumber") {
      nextValue = formatCardNumber(value);
    }

    if (name === "expiryDate") {
      nextValue = formatExpiry(value);
    }

    if (name === "cvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    const updated = { ...formData, [name]: nextValue };
    setFormData(updated);

    if (touched[name]) {
      setErrors(validatePaymentForm(updated));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validatePaymentForm(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setServerError("");

    const newErrors = validatePaymentForm(formData);
    setErrors(newErrors);
    setTouched({
      cardholderName: true,
      cardNumber: true,
      expiryDate: true,
      cvv: true,
      address: true,
      postalCode: true,
    });

    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);

    try {
      const last4 = cleanCardNumber(formData.cardNumber).slice(-4);
      const brand = detectCardBrand(formData.cardNumber);

      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          address: formData.address.trim(),
          postal_code: formData.postalCode.trim(),
          payment_method: `${brand.toUpperCase()} ending in ${last4}`,
        }),
      });

      const text = await response.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Payment failed.");
      }

      setMessage("Payment validated and order placed successfully.");
      setFormData({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        address: "",
        postalCode: "",
      });
      setErrors({});
      setTouched({});
      clearCart();

      setTimeout(() => {
        navigate("/user-profile");
      }, 1200);
    } catch (error) {
      setServerError(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-with-fixed-navbar payment-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={7} md={9}>
            <Card className="payment-card">
              <Card.Body className="p-4">
                <h2 className="payment-title">Secure Payment</h2>
                <p className="payment-subtitle">
                  Demo validation only. No real money is charged.
                </p>

                {message && <Alert variant="success">{message}</Alert>}
                {serverError && <Alert variant="danger">{serverError}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label>Cardholder Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!(touched.cardholderName && errors.cardholderName)}
                      placeholder="Enter cardholder name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cardholderName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!(touched.cardNumber && errors.cardNumber)}
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cardNumber}
                    </Form.Control.Feedback>

                    {cardBrand !== "unknown" && (
                      <small className="text-muted d-block mt-1">
                        Detected card type: {cardBrand.toUpperCase()}
                      </small>
                    )}
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!(touched.expiryDate && errors.expiryDate)}
                          placeholder="MM/YY"
                          inputMode="numeric"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.expiryDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="password"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!(touched.cvv && errors.cvv)}
                          placeholder={cardBrand === "amex" ? "1234" : "123"}
                          inputMode="numeric"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.cvv}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Delivery Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!(touched.address && errors.address)}
                      placeholder="Enter delivery address"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>ZIP / Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!(touched.postalCode && errors.postalCode)}
                      placeholder="Enter ZIP / postal code"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.postalCode}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="payment-total-text">Total: ${total.toFixed(2)}</div>

                  <Button type="submit" className="checkout-button w-100" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Payment"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}