import {Navbar, Nav, Container} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function AppFooter(){
    const navigate = useNavigate();
    return(
        
            <Container fluid>
                <div>
                    <Nav className="footer-text">
                        <Nav.Item>
                            <Nav.Link href="mailto:aidermaglow@gmail.com">Contact</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => {
                                navigate("/privacy-policy");
                                window.scrollTo(0, 0);
                            }}>Privacy Policy</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => {
                                navigate("/terms-and-conditions");
                                window.scrollTo(0, 0);
                            }}>Terms & Conditions</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => {
                                navigate("/faqs");
                                window.scrollTo(0, 0);
                            }}>FAQs</Nav.Link>
                        </Nav.Item>
                        <Nav.Link href="https://www.instagram.com/aidermaglow?igsh=MWRnOHF5b3ZhYXg1dA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram</Nav.Link>
                        <Nav.Item>
                         <Nav.Link href="https://www.facebook.com/profile.php?id=61570862728089" target="_blank" rel="noopener noreferrer">Facebook</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Navbar className="footer-navbar">
                        <div>Copyright © 2026 DermaGlow</div>
                    </Navbar>          
                </div>
            </Container>
   
        
    )
}

    