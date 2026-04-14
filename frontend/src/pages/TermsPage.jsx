import React from "react";
import { Container } from "react-bootstrap";
import "../App.css";

export default function TermsPage() {
  return (
    <main className="page-with-fixed-navbar info-page">
      <Container className="info-page-container">
        <h1 className="info-page-title">Terms & Conditions</h1>
        <p className="info-page-updated">Last updated: April 2026</p>

        <section className="info-section">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using DermaGlow, you agree to comply with these
            Terms & Conditions. If you do not agree, please do not use the
            website.
          </p>
        </section>

        <section className="info-section">
          <h3>2. Use of Website</h3>
          <p>
            You agree to use this website for lawful purposes only and not to
            engage in any activity that may damage, disrupt, or interfere with
            the platform or other users’ experience.
          </p>
        </section>

        <section className="info-section">
          <h3>3. Product Information</h3>
          <p>
            We strive to provide accurate product descriptions, pricing, and
            recommendations. However, we do not guarantee that all information
            will always be error-free, complete, or current.
          </p>
        </section>

        <section className="info-section">
          <h3>4. AI Recommendations</h3>
          <p>
            Our skincare suggestions and AI analysis are intended for general
            informational purposes only and do not replace professional medical
            advice or dermatological consultation.
          </p>
        </section>

        <section className="info-section">
          <h3>5. Orders and Payments</h3>
          <p>
            If purchases are enabled, users are responsible for providing
            accurate billing and shipping details. We reserve the right to
            cancel or refuse orders if necessary.
          </p>
        </section>

        <section className="info-section">
          <h3>6. Intellectual Property</h3>
          <p>
            All content on DermaGlow, including text, graphics, branding, and
            design elements, is protected by intellectual property rights and
            may not be copied or reused without permission.
          </p>
        </section>

        <section className="info-section">
          <h3>7. Limitation of Liability</h3>
          <p>
            DermaGlow is not liable for any direct or indirect damages arising
            from the use of the site, products, or recommendations provided on
            the platform.
          </p>
        </section>

        <section className="info-section">
          <h3>8. Changes to Terms</h3>
          <p>
            We may update these Terms & Conditions from time to time. Continued
            use of the website after updates means you accept the revised terms.
          </p>
        </section>

        <section className="info-section">
          <h3>9. Contact</h3>
          <p>
            For questions regarding these Terms & Conditions, contact us at
            <strong> aidermaglow@gmail.com</strong>.
          </p>
        </section>
      </Container>
    </main>
  );
}