import { Navbar, Container, Nav } from "react-bootstrap";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();

  return (
    <>
      <div className="site-navbar-fixed">
        <Navbar className="first-navbar" expand="md">
          <Container fluid></Container>
        </Navbar>

        <Navbar bg="white" data-bs-theme="light" className="second-navbar" expand="md">
          <Container>
            <Navbar.Brand onClick={() => navigate("/")}>
              <img
                alt="Brand Name"
                src="/images/DermaGlow-Name.png"
                className="d-inline-block align-top img-fluid brand-logo"
              />
            </Navbar.Brand>

            <Nav className="icon-nav">
              <Nav.Link
                onClick={() => navigate(user ? "/user-profile" : "/auth")}
              >
                <img
                  alt="User"
                  src="/images/User.png"
                  className="user-icon"
                />
              </Nav.Link>

              <Nav.Link
                onClick={() =>
                  navigate(user ? "/checkout" : "/auth", {
                    state: {
                      from: "/checkout",
                      message: "Please log in or sign up to access your cart."
                    }
                  })
                }
                className="cart-icon"
              >
                <img
                  alt="Cart"
                  src="/images/Cart.png"
                />
                {cart.length > 0 && (
                  <div className="cart-count">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </div>
                )}
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Navbar expand="md" className="third-navbar">
          <Container fluid>
            <Navbar.Toggle aria-controls="text-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="third-navbar-links">
                <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                <Nav.Link onClick={() => navigate("/shop")}>Shop</Nav.Link>
                <Nav.Link onClick={() => navigate("/product-finder")}>Product Finder</Nav.Link>
                <Nav.Link onClick={() => navigate("/ai-analysis")}>AI Skin Analysis</Nav.Link>
                <Nav.Link onClick={() => navigate("/reviews")}>Reviews</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default AppNavbar;