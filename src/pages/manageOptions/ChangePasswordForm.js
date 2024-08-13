import React from 'react';
import { Form, InputGroup, Row, Col, Accordion } from 'react-bootstrap';
import { useTheme } from '../../ThemeContext';

const ChangePasswordForm = ({ handleOptionChange }) => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';
	
	const handleChange = (e) => {
		handleOptionChange(e.target.name, e.target.value);
	};

	return (
		<>
			<h4 className={`${textColorClass}`}>Options</h4>
			<Accordion data-bs-theme={`${theme}`}>
				<Accordion.Item>
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
					👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.change_password' target='_blank'>Repository</a>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<br />
			<Row>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>Account</InputGroup.Text>
						<Form.Control
							type="text"
							name="account"
							placeholder='ex) root'
							onChange={handleChange}
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>Change Password</InputGroup.Text>
						<Form.Control
							type="text"
							name="change_password"
							onChange={handleChange}
						/>
					</InputGroup>
				</Col>
			</Row>
		</>
	);
};

export default ChangePasswordForm;
