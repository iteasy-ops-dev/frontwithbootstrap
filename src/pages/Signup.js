import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Spinner, InputGroup, Row, Col } from 'react-bootstrap';
import useApi from '../hooks/useApi';
import config from '../config';
import {
  validateKoreanName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators";
import { useTheme } from '../ThemeContext';

const Signup = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validateErrors, setValidateError] = useState([]);
  const { data, loading, error, callApi } = useApi();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (data && data.status === 201) {
      alert("회원 가입 성공. 이메일 인증 후 로그인해주세요.");
      navigate('/login');
    }
  }, [data, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = [];

    let v = validateEmail(email);
    if (!v.status) errors.push(v.message);

    v = validateKoreanName(name);
    if (!v.status) errors.push(v.message);

    v = validatePassword(password);
    if (!v.status) errors.push(v.message);

    v = validateConfirmPassword(password, confirmPassword);
    if (!v.status) errors.push(v.message);

    if (errors.length > 0) {
      setValidateError(errors);
    } else {
      setValidateError('');
      // console.log({ name, email, password })

      await callApi(
        config.api.path.signup,
        config.api.method.POST,
        { name, email, password }
      );
    }
  };

  return (
    <>
      <img
        alt=""
        height="20px"
        width="120px"
        src="/logo_iteasy.png"
      />{' '}
      <span className={`${textColorClass}`}>Service Ops Center</span>
      <h1 className={`my-4 ${textColorClass}`}>Signup</h1>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Row className="mb-3">
          <Col>
            <InputGroup className="mb-3 login-form" data-bs-theme={`${theme}`}>
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
            <InputGroup className="mb-3 login-form" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Name</InputGroup.Text>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <InputGroup className="mb-3 login-form" data-bs-theme={`${theme}`}>
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
        <Row className="mb-3">
          <Col>
            <InputGroup className="mb-3 login-form" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Confirm Password</InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Signup'}
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {validateErrors.length > 0 && validateErrors.map((err, index) => (
        <Alert key={index} variant="danger" className="mt-3">{err}</Alert>
      ))}
      <Button variant="link" onClick={() => navigate('/login')}>
        Back to Login
      </Button>
    </>
  );
};

export default Signup;
