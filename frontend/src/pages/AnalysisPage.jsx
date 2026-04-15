import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Alert, Spinner, Card } from "react-bootstrap";

export default function AnalysisPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const fetchSkinConcern = async () => {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://127.0.0.1:5000/api/skin-analysis/", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to analyse the image.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Unable to analyse, try uploading the image again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
  };

  return (
    <main className="page-with-fixed-navbar">
      <Container className="analysis-page">
        {!result ? (
          <Row className="align-items-center g-5">
            <Col md={6}>
              <div className="analysis-upload-card">
                <h2 className="analysis-title">AI Skin Analysis</h2>
                <p className="analysis-text">
                  Upload a clear, well-lit image of the skin area you want analysed.
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>

                {previewUrl && (
                  <div className="analysis-preview-wrap">
                    <img src={previewUrl} alt="Preview" className="analysis-preview-image" />
                  </div>
                )}

                <Button
                  className="analysis-button"
                  onClick={fetchSkinConcern}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Analysing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </Button>
              </div>
            </Col>

            <Col md={6}>
              <div className="analysis-info-card">
                <h2 className="analysis-title">Tips for better results</h2>
                <ul className="analysis-tips">
                  <li>Use natural or bright lighting.</li>
                  <li>Keep the image sharp and focused.</li>
                  <li>Avoid heavy makeup or filters.</li>
                  <li>Make sure the skin area is clearly visible.</li>
                </ul>
              </div>
            </Col>
          </Row>
        ) : (
          <Row className="align-items-center g-5">
            <Col md={6}>
              {previewUrl && (
                <img src={previewUrl} alt="Uploaded skin" className="analysis-result-image" />
              )}
            </Col>

            <Col md={6}>
              <div className="analysis-result-box">
                <h2 className="analysis-result-heading">
                  {result.skin_concern === "uncertain"
                    ? "We are not fully confident in this result"
                    : `Your primary skin concern is: ${String(result.skin_concern).toUpperCase()}`}
                </h2>


                {result.top_predictions?.length > 0 && (
                  <Card className="analysis-top-predictions-card">
                    <Card.Body>
                      <h5 className="analysis-top-title">Top Predictions</h5>
                      {result.top_predictions.map((item, index) => (
                        <p key={index} className="mb-2">
                          <strong>{item.label}</strong>: {Math.round(item.confidence * 100)}%
                        </p>
                      ))}
                    </Card.Body>
                  </Card>
                )}

                {result.skin_concern === "uncertain" && (
                  <p className="analysis-note">
                    Try uploading a clearer image with better lighting and a closer view of the skin concern.
                  </p>
                )}

                <Button className="analysis-button mt-3" onClick={resetAnalysis}>
                  Retry Taking the Analysis
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </main>
  );
}