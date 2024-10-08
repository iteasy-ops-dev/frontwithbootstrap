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
			<Accordion defaultActiveKey="0" data-bs-theme={`${theme}`}>
				<Accordion.Item eventKey="0">
					<Accordion.Header>❗️ 계정에 Root 권한이 없는 경우.</Accordion.Header>
					<Accordion.Body>
						1. 서버에 root로 로그인합니다.<br />
						2. 아래 명령어를 사용하여 스크립트를 다운 받습니다.<br />
						<strong>wget</strong> https://raw.githubusercontent.com/iteasy-ops-dev/ansible.roles.web_conf_scout/refs/heads/main/file/web_conf_scout.sh<br />
						3. 아래 명령어를 사용하여 정보를 얻습니다.<br />
						4. (가능하면)해당 쉘 스크립트를 삭제합니다.<br />
					</Accordion.Body>
				</Accordion.Item>
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