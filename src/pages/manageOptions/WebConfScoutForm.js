import React, { useState } from 'react';
import { Form, InputGroup, Accordion, Row, Col } from 'react-bootstrap';
import { useTheme } from '../../ThemeContext';

const WebConfScoutForm = ({ handleOptionChange }) => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

	const handleChange = (e) => {
		const { name, value } = e.target;
		handleOptionChange(name, value)
	}

	return (
		<>
			<h4 className={`${textColorClass}`}>Options</h4>
			<Accordion data-bs-theme={`${theme}`}>
				<Accordion.Item>
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.web_conf_scout.git' target="_blank" rel="noreferrer">Repository</a>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<br />
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>Domain</InputGroup.Text>
						<Form.Control
							type="text"
							name="domain_name"
							onChange={handleChange}
						/>
					</InputGroup>
				</Col>
			</Row>
		</>
	)
}

export default WebConfScoutForm;