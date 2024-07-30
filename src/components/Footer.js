import React from 'react';
import { useTheme } from '../ThemeContext';
import { Navbar, Nav, Button } from 'react-bootstrap';

const Footer = () => {
  const adminEmail = "iteasy.ops.dev@gmail.com";
  const adminName = "ITEASY Service Ops Center";
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar bg={`${theme}`} variant={`${theme}`} className="footer justify-content-between">
      <Nav>
        <Nav.Item className={`text-${theme === "dark" ? "light" : "dark"}`}>
          <p>Contact Information:<br />
          {adminName} - <a href={`mailto:${adminEmail}`}><i class="bi bi-envelope"></i> {adminEmail}</a></p>
        </Nav.Item>
      </Nav>
        <Button variant="secondary" onClick={toggleTheme}>
        <i class="bi bi-arrow-repeat"></i> Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
    </Navbar>
  );
};

export default Footer;

