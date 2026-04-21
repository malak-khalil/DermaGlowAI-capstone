import { Navbar, Nav, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function AppFooter() {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    if (location.pathname === path) {
      window.scrollTo(0, 0);
      return;
    }

    navigate(path);

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  };

  return (
    <Container fluid>
      <div>
        <Nav className="footer-text">
          <Nav.Item>
            <Nav.Link href="mailto:aidermaglow@gmail.com">Contact</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link onClick={() => goTo("/privacy-policy")}>
              Privacy Policy
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link onClick={() => goTo("/terms-and-conditions")}>
              Terms & Conditions
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link onClick={() => goTo("/faqs")}>FAQs</Nav.Link>
          </Nav.Item>

          <Nav.Link
            href="https://www.instagram.com/aidermaglow?igsh=MWRnOHF5b3ZhYXg1dA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </Nav.Link>

          <Nav.Item>
            <Nav.Link
              href="https://www.facebook.com/profile.php?id=61570862728089"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Navbar className="footer-navbar">
          <div>Copyright © 2026 DermaGlow</div>
        </Navbar>
      </div>
    </Container>
  );
}