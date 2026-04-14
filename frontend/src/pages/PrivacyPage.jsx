import React from "react";
import { Container } from "react-bootstrap";
import "../App.css";

export default function PrivacyPage() {
  return (
    <main className="info-page page-with-fixed-navbar">
      <Container className="info-page-container">
        <h1 className="info-page-title">Privacy Policy</h1>
        <p className="info-page-updated">Last updated: April 2026</p>

        <section className="info-section">
          <h3>1. Introduction</h3>
          <p>
            At DermaGlow, we value your privacy and are committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, and safeguard your data when you use our website.
          </p>
        </section>

        <section className="info-section">
          <h3>2. Information We Collect</h3>
          <p>
            We may collect basic information such as your name, email address,
            order details, and any information you voluntarily provide when
            contacting us or using our services.
          </p>
        </section>

        <section className="info-section">
          <h3>3. How We Use Your Information</h3>
          <p>
            We use your information to improve your experience, process orders,
            respond to inquiries, provide customer support, and enhance our
            skincare recommendations and website functionality.
          </p>
        </section>

        <section className="info-section">
          <h3>4. Data Protection</h3>
          <p>
            We take reasonable technical and organizational measures to protect
            your information against unauthorized access, misuse, alteration, or
            disclosure.
          </p>
        </section>

        <section className="info-section">
          <h3>5. Third-Party Services</h3>
          <p>
            Some services on our site may rely on third-party providers such as
            payment processors, analytics tools, or social media platforms.
            These providers may handle your data according to their own privacy
            policies.
          </p>
        </section>

        <section className="info-section">
          <h3>6. Cookies</h3>
          <p>
            Our website may use cookies and similar technologies to improve
            usability, remember preferences, and better understand how visitors
            interact with our platform.
          </p>
        </section>

        <section className="info-section">
          <h3>7. Your Rights</h3>
          <p>
            You may request access to, correction of, or deletion of your
            personal information by contacting us at
            <strong> aidermaglow@gmail.com</strong>.
          </p>
        </section>

        <section className="info-section">
          <h3>8. Contact</h3>
          <p>
            If you have any questions about this Privacy Policy, you can contact
            us at <strong>aidermaglow@gmail.com</strong>.
          </p>
        </section>
      </Container>
    </main>
  );
}