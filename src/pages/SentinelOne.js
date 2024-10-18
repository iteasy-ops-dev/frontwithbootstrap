import React, { useState } from 'react';
import { Form, InputGroup, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useTheme } from '../ThemeContext';
import useApi from '../hooks/useApi';
import config from '../config';

import { validateSentinelOneKey } from "../utils/validators";

const SentinelOne = () => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

	const updateUser = useApi();
	const updateAppliation = useApi();

	const [apikey, setApikey] = useState('');
	const [type, setType] = useState('');

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	let v = validateSentinelOneKey(apikey)
	// 	if (!v.status) {
	// 		alert(v.message)
	// 		return;
	// 	}

	// 	await callApi(
	// 		config.api.path.sentinelone,
	// 		config.api.method.POST,
	// 		{ apikey }
	// 	)
	// }

	const handleUpdataUser = async () => {
		let v = validateSentinelOneKey(apikey)
		if (!v.status) {
			alert(v.message)
			return;
		}
		console.log(apikey)

		await updateUser.callApi(
			config.api.path.sentinelone.update,
			config.api.method.POST,
			{ apikey, type }
		)
	}

	const handleUpdataApplication = async () => {
		let v = validateSentinelOneKey(apikey)
		if (!v.status) {
			alert(v.message)
			return;
		}
		console.log(apikey)
		await updateAppliation.callApi(
			config.api.path.sentinelone.update,
			config.api.method.POST,
			{ apikey, type }
		)
	}

	return (
		<>
			<h1 className={`header-title ${textColorClass}`}>SentinelOne</h1>
			<p className={`header-description ${textColorClass}`}>센티넬원</p>

			<Form className="mb-3">
				<Row>
					<Col>
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
							<InputGroup.Text>Api Key</InputGroup.Text>
							<Form.Control
								type="text"
								placeholder="Enter SentinelOne Api Key"
								value={apikey}
								onChange={(e) => setApikey(e.target.value)}
							/>
						</InputGroup>
					</Col>
				</Row>
			</Form>
			<Row>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>Type</InputGroup.Text>
						<Form.Select
							value={type}
							onChange={(e) => setType(e.target.value)}
						>
							<option value=''>- 업데이트 타입을 선택하세요</option>
							<option value='sentinelone_agents'>Agents</option>
							<option value='sentinelone_applications'>Applications</option>
							<option value='sentinelone_applications_risk'>Applications Risk</option>
						</Form.Select>
					</InputGroup>
				</Col>
				<Col>
					<Button onClick={handleUpdataUser} variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} disabled={updateUser.loading}>
						{updateUser.loading ? <Spinner as="span" animation="border" size="sm" /> : 'Update User'}
					</Button>
				</Col>
			</Row>
			{/* <Row>
				<Col>
					<Button className="w-100" onClick={handleUpdataApplication} variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} disabled={updateAppliation.loading}>
						{updateAppliation.loading ? <Spinner as="span" animation="border" size="sm" /> : 'Update Application'}
					</Button>
				</Col>
			</Row> */}

		</>
	);
};

export default SentinelOne;