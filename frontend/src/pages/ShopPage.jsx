import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";
import RevealOnScroll from "../components/RevealOnScroll";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Button,
  Navbar,
  Card,
  Modal
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ShopPage() {
  const { homeCategoryClicked } = useParams();
  const { addToCart, increaseQuantity, decreaseQuantity, getProductQuantity} = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Cleanser");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (homeCategoryClicked) {
      const formattedCategory =
        homeCategoryClicked.charAt(0).toUpperCase() +
        homeCategoryClicked.slice(1).toLowerCase();
      setActiveCategory(formattedCategory);
    }
  }, [homeCategoryClicked]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products/");
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const categories = [
  ...new Set(
    products.map((p) => p.category?.toLowerCase().trim()).filter(Boolean)
  )
];
  const filteredProducts = products.filter(
    (p) => p.category?.toLowerCase().trim() === activeCategory?.toLowerCase().trim()
  );

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

const handleCategoryClick = (category) => {
  setActiveCategory(category);
  window.history.replaceState({}, "", `/shop/${category.toLowerCase()}`);
};
  const { user } = useAuth();
  const location = useLocation();

  const handleProtectedAddToCart = (product) => {
  if (!user) {
    navigate("/auth", {
      state: {
        from: location.pathname,
        message: "Please log in or sign up to add products to your cart."
      }
    });
    return;
  }
    addToCart(product);
};

  return (
    <>
      <main className="page-with-fixed-navbar">
        <Container>
<RevealOnScroll>
  <Navbar className="shop-page-navbar">
    {categories.map((category) => (
      <Button
        key={category}
        className="shop-page-navbar-buttons"
        active={activeCategory === category}
        onClick={() => handleCategoryClick(category)}
      >
        {category}
      </Button>
    ))}
  </Navbar>
</RevealOnScroll>

<RevealOnScroll delay={120}>
  <div>
    <Row className="cards-row">
      {filteredProducts.map((product) => (
        <Col key={product.id} xs={12} sm={6} md={4} lg={4} xl={3}>
          <Card
            className="shop-page-cards"
            onClick={() => setSelectedProduct(product)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <div className="product-image-wrapper">
                <Card.Img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>

              <Card.Subtitle>{product.name}</Card.Subtitle>
              <Card.Title>${Number(product.price).toFixed(2)}</Card.Title>

              {getProductQuantity(product.id) === 0 ? (
                <Button
                  className="shop-page-buttons"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProtectedAddToCart(product);
                  }}
                >
                  Add to Cart
                </Button>
              ) : (
                <div
                  className="quantity-controls"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button className="qty-btn" onClick={() => decreaseQuantity(product.id)}>
                    -
                  </Button>

                  <span className="qty-number">{getProductQuantity(product.id)}</span>

                  <Button className="qty-btn" onClick={() => increaseQuantity(product)}>
                    +
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
</RevealOnScroll>
        </Container>
              <Modal
  show={!!selectedProduct}
  onHide={() => setSelectedProduct(null)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>{selectedProduct?.name}</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {selectedProduct && (
      <>
        <div className="product-image-wrapper">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="product-image"
          />
        </div>

        <p><strong>Category:</strong> {selectedProduct.category}</p>
        <p><strong>Description:</strong> {selectedProduct.description}</p>
        <p><strong>Price:</strong> ${Number(selectedProduct.price).toFixed(2)}</p>
      </>
    )}
  </Modal.Body>
</Modal>
      </main>
    </>
  );
}