import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
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

  const handleSignup = () => {
    navigate('/signup'); // Redirect to signup page
  };

  return (
    <>
      <h1 className="my-4">Login</h1>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Login'}
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {data && (
        <div className="mt-3">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      <Button variant="link" onClick={handleSignup}>
        Don't have an account? Sign up
      </Button>
    </>
  );
};

export default Login;
