import React from 'react';
import { Form, InputGroup, Accordion } from 'react-bootstrap';
import { useTheme } from '../../ThemeContext';

const PackageManager = ({ handleOptionChange }) => {
	const { theme } = useTheme();
	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "packages_to_install" || name === "packages_to_remove") {
			// Split by comma and newline, then trim whitespace
			const arrayValue = value.split(/[\n,]+/).map(item => item.trim()).filter(item => item);
			handleOptionChange(name, arrayValue);
		} else if (name === "perform_update") {
			// Handle boolean conversion for the select field
			handleOptionChange(name, value === "true");
		} else {
			handleOptionChange(name, value);
		}
	};

	return (
		<>
			<h4>Options</h4>
			<Accordion data-bs-theme={`${theme}`}>
				<Accordion.Item>
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.package_manager' target='_blank'>Repository</a>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<br />
			<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
				<InputGroup.Text>설치 패키지</InputGroup.Text>
				<Form.Control
					as="textarea"
					name="packages_to_install"
					onChange={handleChange}
				/>
			</InputGroup>

			<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
				<InputGroup.Text>삭제 패키지</InputGroup.Text>
				<Form.Control
					as="textarea"
					name="packages_to_remove"
					onChange={handleChange}
				/>
			</InputGroup>

			<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
				<InputGroup.Text>Update</InputGroup.Text>
				<Form.Select
					name="perform_update"
					onChange={handleChange}
				>
					<option value="true">true</option>
					<option value="false">false</option>
				</Form.Select>
			</InputGroup>
		</>
	);
};

export default PackageManager;
