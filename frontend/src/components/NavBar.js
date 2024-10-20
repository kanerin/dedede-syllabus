import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap'; // React Bootstrapコンポーネントのインポート

function NavBar({ isLoggedIn, handleLogout }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Test Pages</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/regex">Regex Test</Nav.Link>
            <Nav.Link as={Link} to="/sql">SQL Test</Nav.Link>
            <Nav.Link as={Link} to="/ajax">AJAX Test</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" className="me-2">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="outline-light">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;