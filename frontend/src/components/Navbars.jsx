import { Navbar, Container, Nav } from "react-bootstrap";
import React from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const isShopPage = location.pathname.startsWith("/shop");
  

const goTo = (path, options) => {
  if (location.pathname === path && !options) {
    window.scrollTo(0, 0);
    return;
  }

  navigate(path, options);

  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
};

  return (
    <>
      <div className="site-navbar-fixed">
        <Navbar className="first-navbar" expand="md">
          <Container fluid></Container>
        </Navbar>

        <Navbar bg="white" data-bs-theme="light" className="second-navbar" expand="md">
          <Container>
            <Navbar.Brand onClick={() => goTo("/")}>
              <img
                alt="Brand Name"
                src="/images/DermaGlow-Name.png"
                className="d-inline-block align-top img-fluid brand-logo"
              />
            </Navbar.Brand>

            <Nav className="icon-nav">
              {isShopPage && (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new Event("toggleShopSearch"))}
    aria-label="Toggle shop search"
    title="Search products"
    style={{
      border: "none",
      background: "transparent",
      padding: "6px 10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <img
      src="/images/search-icon.png"
      alt="Search"
      className="user-icon"
    />
  </button>
)}  <Nav.Link
                onClick={() => goTo(user ? "/user-profile" : "/auth")}
              >
                <img
                  alt="User"
                  src="/images/User.png"
                  className="user-icon"
                />
              </Nav.Link>

              <Nav.Link
                onClick={() =>
                  goTo(
                    user ? "/checkout" : "/auth", 
                    user ? undefined
                    :{
                    state: {
                      from: "/checkout",
                      message: "Please log in or sign up to access your cart."
                    },
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

        <Navbar expand="lg" className="third-navbar">
          <Container fluid className="third-navbar-container">
            <Navbar.Toggle aria-controls="text-navbar-nav" className="third-navbar-toggle"/>
            <Navbar.Collapse id="text-navbar-nav" className="third-navbar-collapse">
         
              <Nav className="third-navbar-links ms-auto me-auto">
                <Nav.Link onClick={() => goTo("/")}>Home</Nav.Link>
                <Nav.Link onClick={() => goTo("/shop")}>Shop</Nav.Link>
                <Nav.Link onClick={() => goTo("/product-finder")}>Routine Assistant</Nav.Link>
                <Nav.Link onClick={() => goTo("/ai-analysis")}>AI Skin Analysis</Nav.Link>
                <Nav.Link onClick={() => goTo("/reviews")}>Reviews</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default AppNavbar;