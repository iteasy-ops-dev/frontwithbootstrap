import React, { useState, useEffect } from 'react';
import { Spinner, Button, Form, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import useApi from '../hooks/useApi';
import config from '../config';
import {
	validatePassword,
	validateconfirmPassword,
} from "../utils/validators";

const Profile = () => {
	const { getUserEmail } = useAuth();
	const email = getUserEmail();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [validateErrors, setValidateError] = useState([]);
	const { data, loading, error, callApi } = useApi();

	useEffect(() => {
		setPassword('')
		setConfirmPassword('')
	}, [data]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		let errors = [];

		let v = validatePassword(password);
		if (!v.status) errors.push(v.message);

		v = validateconfirmPassword(password, confirmPassword);
		if (!v.status) errors.push(v.message);

		if (errors.length > 0) {
			setValidateError(errors);
		} else {
			setValidateError('');
			await callApi(
				config.api.path.updatePassword,
				config.api.method.POST,
				{ email, password }
			);
		}

	};

	return (
		<div className="container mt-4">
			<h2>Profile</h2>
			<Form onSubmit={handleSubmit}>
				<Row >
					<Col>
						<InputGroup >
							<InputGroup.Text>Email</InputGroup.Text>
							<Form.Control
								type="email"
								placeholder="Enter email"
								value={email}
								readOnly
								disabled
								required
							/>
						</InputGroup>
					</Col>
				</Row>
				<Row >
					<Col>
						<InputGroup >
							<InputGroup.Text>Change Password</InputGroup.Text>
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
				<Row >
					<Col>
						<InputGroup >
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
					{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Update Password'}
				</Button>
			</Form>
			{error && <Alert variant="danger" className="mt-3">{error}</Alert>}
			{validateErrors.length > 0 && validateErrors.map((err, index) => (
				<Alert key={index} variant="danger" className="mt-3">{err}</Alert>
			))}
			{data && data.status === 200 && <Alert variant="success" className="mt-3">비밀번호 업데이트 완료!</Alert>}
		</div>
	);
};

export default Profile;
