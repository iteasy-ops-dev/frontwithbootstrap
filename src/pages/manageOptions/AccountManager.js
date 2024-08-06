import React, { useState } from 'react';
import { Form, InputGroup, Accordion, Row, Col } from 'react-bootstrap';

const AccountManager = ({ handleOptionChange }) => {
	const [action, setAction] = useState("");

	const handleChange = (e) => {
		let { name, value } = e.target;
		if (name === 'action') {
			setAction(value)
		}
		if (name === "remove_home") {
			value = value === "true" ? true : false
		}

		handleOptionChange(name, value);
	}
	return (
		<>
			<h4>Options</h4>
			<Accordion>
				<Accordion.Item>
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.account_manager.git' target='_blank'>Repository</a>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<br />

			<OptionSelect
				action={action}
				onChange={handleChange}
			/>

			{action === "create" && <CreateFields onChange={handleChange} />}
			{action === "update" && <UpdateFields onChange={handleChange} />}
			{action === "delete" && <DeleteFields onChange={handleChange} />}
		</>
	)
}

export default AccountManager

const OptionSelect = ({ action, onChange }) => {
	return (
		<InputGroup className="mb-3">
			<InputGroup.Text>Type</InputGroup.Text>
			<Form.Select
				name="action"
				value={action}
				onChange={onChange}
			>
				<option value="">- Options</option>
				<option value="create">생성</option>
				<option value="update">수정</option>
				<option value="delete">삭제</option>
			</Form.Select>
		</InputGroup>
	);
};


const CreateFields = ({ onChange }) => {
	const [showOptions, setShowOptions] = useState(false);
	const handleOptionsToggle = () => setShowOptions(prev => !prev);

	return (
		<>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="username"
							onChange={onChange}
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>비밀번호</InputGroup.Text>
						<Form.Control
							type="text"
							name="password"
							onChange={onChange}
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Check
						type="checkbox"
						label="추가옵션보기"
						checked={showOptions}
						onChange={handleOptionsToggle}
					/>
				</Col>
			</Row>
			{showOptions && (
				<>
					<Row className="mb-3">
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>홈(option)</InputGroup.Text>
								<Form.Control
									type="text"
									name="home_dir"
									onChange={onChange}
									placeholder="/home/{username}"
								/>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>쉘(option)</InputGroup.Text>
								<Form.Control
									type="text"
									name="shell"
									onChange={onChange}
									placeholder="/bin/bash"
								/>
							</InputGroup>
						</Col>
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>그룹(option)</InputGroup.Text>
								<Form.Control
									type="text"
									name="group"
									onChange={onChange}
									placeholder="username"
								/>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>설명(option)</InputGroup.Text>
								<Form.Control
									as="textarea"
									name="comment"
									onChange={onChange}
								/>
							</InputGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	)
}

const UpdateFields = ({ onChange }) => {
	const [showOptions, setShowOptions] = useState(false);
	const handleOptionsToggle = () => setShowOptions(prev => !prev);

	return (
		<>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="username"
							onChange={onChange}
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>수정할 비밀번호</InputGroup.Text>
						<Form.Control
							type="text"
							name="password"
							onChange={onChange}
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Check
						type="checkbox"
						label="추가옵션보기"
						checked={showOptions}
						onChange={handleOptionsToggle}
					/>
				</Col>
			</Row>
			{showOptions && (
				<>
					<Row>
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>쉘(option)</InputGroup.Text>
								<Form.Control
									type="text"
									name="shell"
									onChange={onChange}
									placeholder="/bin/bash"
								/>
							</InputGroup>
						</Col>
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>그룹(option)</InputGroup.Text>
								<Form.Control
									type="text"
									name="group"
									onChange={onChange}
									placeholder="username"
								/>
							</InputGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	)
}
const DeleteFields = ({ onChange }) => {
	return (
		<>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="username"
							onChange={onChange}
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>홈디렉토리</InputGroup.Text>
						<Form.Select
							name="remove_home"
							onChange={onChange}
							defaultValue="true"
						>
							<option value="true">삭제</option>
							<option value="false">보존</option>
						</Form.Select>
					</InputGroup>
				</Col>
			</Row>
		</>
	)
}