import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import useApi from '../hooks/useApi';
import config from '../config'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    // 회원가입 로직 (예: API 호출 후 성공 시)
    if (password === confirmPassword) {
      // 가입 성공 후 로그인 페이지로 이동
      await callApi(
        config.api.path.signup,
        config.api.method.POST,
        { email, password }
      );
    } else {
      // 비밀번호 불일치 처리
      alert("Passwords do not match");
    }
  };

  return (
    <>
      <h1 className="my-4">Signup</h1>
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

        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Signup'}
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </>
  );
};

export default Signup;
