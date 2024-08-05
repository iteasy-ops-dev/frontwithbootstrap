import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputGroup, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';
import config from '../config'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data, loading, error, callApi } = useApi();
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (data && data.status === 200) {
      login();
      navigate('/home'); // Redirect to home after login
    }
  }, [data, login, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 (예: API 호출 후 성공 시)
    callApi(
      config.api.path.login,
      config.api.method.POST,
      { email, password }
    );
  };

  return (
    <>
      <h1 className="my-4">Login</h1>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Row className="mb-3">
          <Col>
            <InputGroup className="mb-3 login-form">
              <InputGroup.Text>Email</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <InputGroup className="mb-3 login-form">
              <InputGroup.Text>Password</InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Login'}
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <Button variant="link" onClick={() => navigate('/signup')}>
        Don't have an account? Sign up
      </Button>
      <Button variant="link" onClick={() => navigate('/reset-password')}>
        Forgot Password?
      </Button>
    </>
  );
};

export default Login;
