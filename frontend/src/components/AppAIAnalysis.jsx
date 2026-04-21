import { Container, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AppAIAnalysis() {
  const navigate = useNavigate();

  return (
    <section className="home-ai-section">
      <Container>
        <Row className="home-ai-row align-items-center g-4">
          <Col lg={6} className="ai-analysis-image">
            <Image
              src="images/ai-skin.png"
              rounded
              fluid
              className="home-ai-image"
            />
          </Col>

          <Col lg={6} className="home-ai-content-col">
            <div className="home-ai-content">
              <Image
                src="images/AI-Analysis.png"
                rounded
                fluid
                className="home-ai-text-image"
              />

              <button
                type="button"
                className="home-ai-cta"
                onClick={() => navigate("/ai-analysis")}
              >
                Try Now
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}