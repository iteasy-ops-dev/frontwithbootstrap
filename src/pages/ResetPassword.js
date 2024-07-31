import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Spinner, InputGroup, Row, Col } from 'react-bootstrap';
import useApi from '../hooks/useApi';
import config from '../config';
import {
  validateEmail
} from "../utils/validators";

const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const [validationError, setValidationError] = useState('');
	const { data, loading, error, callApi } = useApi();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

    let v = validateEmail(email);
    if (!v.status) {
			setValidationError(v.message);
			return
		} else {
			setValidationError('');
			await callApi(
				config.api.path.resetPassword,
				config.api.method.POST,
				{ email }
			);
		}
	};

	useEffect(() => {
    if (data && data.status === 200) {
			alert('임시 비밀번호가 이메일로 전송되었습니다.');
			navigate('/login');
		}
  }, [data, navigate]);

	return (
		<>
			<h1 className="my-4">Reset Password</h1>
			<Form onSubmit={handleSubmit} className="mb-3">
				<Row className="mb-3">
					<Col>
						<InputGroup className="mb-3">
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
				<Button variant="primary" type="submit" disabled={loading}>
					{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Reset Password'}
				</Button>
				<Button variant="link" onClick={() => navigate('/login')}>
					Login
				</Button>
			</Form>
			{validationError && <Alert variant="danger" className="mt-3">{validationError}</Alert>}
			{error && <Alert variant="danger" className="mt-3">{error}</Alert>}
		</>
	);
};

export default ResetPassword;
