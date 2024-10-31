import React, { useState } from 'react';
import { Form, InputGroup, Accordion, Row, Col } from 'react-bootstrap';
import { useTheme } from '../../ThemeContext';

const ChangeSslForm = ({ handleOptionChange }) => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

	const handleLocalFileChange = (e) => {
		const files = Array.from(e.target.files);
		// TODO:
		// 파일의 갯수가 3개여야만 정상
		handleChange({
			target: {
				name: 'files',
				value: files
			}
		});
	}

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
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.change_ssl.git' target="_blank" rel="noreferrer">Repository</a>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<br />
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>도메인</InputGroup.Text>
						<Form.Control
							type="text"
							name="domain_name"
							onChange={handleChange}
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>재시작여부</InputGroup.Text>
						<Form.Select
							name="webserver_type"
							onChange={handleChange}
						>
							<option value="1">false</option>
							<option value="0">true</option>
						</Form.Select>
					</InputGroup>
				</Col>
			</Row>

			<Row>
				<Col>
					<Form.Group controlId="formFileMultiple" className="mb-3" data-bs-theme={`${theme}`}>
						<Form.Label className={`${textColorClass}`}><a href='https://www.sslcert.co.kr/guides/kb/54' target="_blank" rel="noreferrer">업로드 가능 파일: 도메인__<strong>key.pem</strong>, 도메인__<strong>crt.pem</strong>, 도메인__<strong>ca.pem</strong></a></Form.Label>
						<Form.Control type="file" name="files" onChange={handleLocalFileChange} multiple accept=".pem"/>
					</Form.Group>
				</Col>
			</Row>
		</>
	)
}

export default ChangeSslForm;