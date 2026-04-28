import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Cleanser",
    category: "cleanser",
    image: "/images/product1.png"
  },
  {
    id: 2,
    name: "Serum",
    category: "serum",
    image: "/images/product2.png"
  },
  {
    id: 3,
    name: "Moisturiser",
    category: "moisturiser",
    image: "/images/product3.png"
  },
  {
    id: 4,
    name: "Sunscreen",
    category: "sunscreen",
    image: "/images/product4.png"
  }
];

export default function AppShop() {
  const navigate = useNavigate();

  const goTo = (path) => {
    document.activeElement?.blur?.();
    navigate(path);
  };

  return (
    <section>
      <Container>
        <h2 className="shop-heading text-center">
          Customise Your Skincare Regimen
        </h2>

        <Row>
          {products.map((product) => (
            <Col key={product.id}>
              <Card.Body className="shop-products text-center">
                <Card.Title>{product.name}</Card.Title>

                <Card.Img src={product.image} alt={product.name} />

                <Button
                  className="shop-buttons"
                  variant="outline-dark"
                  onClick={() => goTo(`/shop/${product.category}`)}
                >
                  Shop Now
                </Button>
              </Card.Body>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}