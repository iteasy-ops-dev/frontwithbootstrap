import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useTheme } from '../ThemeContext';
import config from '../config'

const Footer = () => {
  const adminEmail = config.admin;
  const adminName = "ITEASY Service Ops Center";
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar bg={`${theme}`} variant={`${theme}`} className="footer justify-content-between">
      <Nav>
        <Nav.Item className={`text-${theme === "dark" ? "light" : "dark"}`}>
          <p>Contact Information:<br />
          {adminName} - <a href={`mailto:${adminEmail}`}><i className="bi bi-envelope"></i> {adminEmail}</a></p>
        </Nav.Item>
      </Nav>
        <Button variant="secondary" onClick={toggleTheme}>
        <i className="bi bi-arrow-repeat"></i> Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
    </Navbar>
  );
};

export default Footer;

