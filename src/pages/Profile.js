import React, { useState, useEffect } from 'react';
import { Spinner, Button, Form, Alert, Row, Col, InputGroup } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import useApi from '../hooks/useApi';
import config from '../config';
import {
	validatePassword,
	validateConfirmPassword,
} from "../utils/validators";
import { useTheme } from '../ThemeContext';

const Profile = () => {
	const { theme } = useTheme();
	const { getUserToken } = useAuth();
	const email = getUserToken().email;
	const name = getUserToken().name;
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

		v = validateConfirmPassword(password, confirmPassword);
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

	const handlerResetLockPassword = () => {
		localStorage.removeItem(config.localStorage.lockPassword)
		alert("잠금 비밀번호 초기화 완료.")
	}

	return (
		<>
			<h2>Profile</h2>
			<Form onSubmit={handleSubmit} className="mb-3">
				<Row className="mb-3">
					<Col>
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
							<InputGroup.Text>Name</InputGroup.Text>
							<Form.Control
								type="name"
								value={name}
								readOnly
								disabled
								required
							/>
						</InputGroup>
					</Col>
					<Col>
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
							<InputGroup.Text>Email</InputGroup.Text>
							<Form.Control
								type="email"
								value={email}
								readOnly
								disabled
								required
							/>
						</InputGroup>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col>
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
				<Row>
					<Col>
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
				<Row className="mb-3">
					<Col>
						<Button variant="primary" type="submit" className="mt-3" disabled={loading}>
							{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Update Password'}
						</Button>
					</Col>
					<Col>
						<Button variant="link" className="mt-3" onClick={handlerResetLockPassword}>Reset lock password</Button>
					</Col>
				</Row>
			</Form>
			{error && <Alert variant="danger" className="mt-3">{error}</Alert>}
			{validateErrors.length > 0 && validateErrors.map((err, index) => (
				<Alert key={index} variant="danger" className="mt-3">{err}</Alert>
			))}
			{data && data.status === 200 && <Alert variant="success" className="mt-3">비밀번호 업데이트 완료!</Alert>}
		</>
	);
};

export default Profile;
