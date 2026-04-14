import React from "react";
import { Container, Accordion } from "react-bootstrap";
import "../App.css";

export default function FAQPage() {
  const faqs = [
    {
      question: "1. What is DermaGlow?",
      answer:
        "DermaGlow is a skincare platform that helps users discover suitable skincare products, explore routines, and use AI-powered tools for personalized beauty and skincare support."
    },
    {
      question: "2. Are the product recommendations personalized?",
      answer:
        "Yes. Some recommendations are based on your selected concerns, skin type, and answers in the product finder or AI analysis features."
    },
    {
      question: "3. Does DermaGlow replace a dermatologist?",
      answer:
        "No. DermaGlow is designed to support skincare exploration and product discovery. It does not replace professional medical advice or diagnosis."
    },
    {
      question: "4. How does the AI skin analysis work?",
      answer:
        "The AI analysis feature processes an uploaded image and predicts a likely skin concern category such as acne, blackheads, dark spots, pores, or wrinkles."
    },
    {
      question: "5. Can I trust the product suggestions?",
      answer:
        "The suggestions are intended to be helpful and relevant, but skincare results vary from person to person. Always patch test and consult a specialist when needed."
    },
    {
      question: "6. Do I need an account to use the website?",
      answer:
        "Some parts of the website may be explored without an account, while certain features or future services may require user login or saved profile information."
    },
    {
      question: "7. How do I add products to the cart?",
      answer:
        "You can click the Add to Cart button on any product card. Once added, you can increase or decrease quantity directly from the product card."
    },
    {
      question: "8. Are product images and descriptions exact brand listings?",
      answer:
        "Some product data may be curated for the platform experience. Product information should be reviewed carefully before purchase or use."
    },
    {
      question: "9. How can I contact DermaGlow?",
      answer:
        "You can reach us through the email link in the footer or by emailing aidermaglow@gmail.com directly."
    },
    {
      question: "10. Is my personal information safe?",
      answer:
        "We take privacy seriously and use reasonable measures to protect user data. Please read our Privacy Policy for full details."
    }
  ];

  return (
    <main className="page-with-fixed-navbar info-page">
      <Container className="info-page-container">
        <h1 className="info-page-title">Frequently Asked Questions</h1>
        <p className="info-page-updated">Find answers to common questions about DermaGlow.</p>

        <Accordion className="faq-accordion">
          {faqs.map((faq, index) => (
            <Accordion.Item eventKey={String(index)} key={index} className="faq-item">
              <Accordion.Header>{faq.question}</Accordion.Header>
              <Accordion.Body>{faq.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </main>
  );
}