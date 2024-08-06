import React from 'react';
import { Form, InputGroup, Accordion, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';

const ChangeSshPortForm = ({handleOptionChange}) => {

	const handleChange = (e) => {
		const { name, value } = e.target;
		handleOptionChange(name, value);
	}

	return (
		<>
			<h4>Options</h4>
			<Accordion>
				<Accordion.Item>
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.change_ssh_port' target='_blank'>Repository</a>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<br />
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>변경할 포트</InputGroup.Text>
						<Form.Control
							type="text"
							name="new_port"
							onChange={handleChange}
						/>
					</InputGroup>
				</Col>
				<Col></Col>
			</Row>
		</>
	)
}

export default ChangeSshPortForm;