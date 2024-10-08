import React, { useState } from 'react';
import { Badge, Form, InputGroup, Accordion, Row, Col } from 'react-bootstrap';
import { useTheme } from '../../ThemeContext';

const AccountManager = ({ handleOptionChange }) => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

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
			<h4 className={`${textColorClass}`}>Options</h4>
			<Accordion data-bs-theme={`${theme}`}>
				<Accordion.Item>
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.account_manager.git' target="_blank" rel="noreferrer">Repository</a>
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
	const { theme } = useTheme();
	return (
		<Row>
			<Col>
				<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
			</Col>
			<Col>
				{action === "" ?
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>
							<i className="bi bi-arrow-left-circle-fill"></i>
							<Badge pill bg={`${theme === 'light' ? 'dark' : 'light'}`} text={`${theme}`}>1</Badge>
						</InputGroup.Text>
						<Form.Control
							type="text"
							value="작업 타입을 선택합니다."
							readOnly
							disabled
							required
						/>
					</InputGroup>
					:
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>
							<i className="bi bi-arrow-down-circle-fill"></i>
							<Badge pill bg={`${theme === 'light' ? 'dark' : 'light'}`} text={`${theme}`}>2</Badge>
						</InputGroup.Text>
						<Form.Control
							type="text"
							value="작업 옵션 정보를 기입합니다."
							readOnly
							disabled
							required
						/>
					</InputGroup>
				}</Col>

		</Row>

	);
};


const CreateFields = ({ onChange }) => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

	const [showOptions, setShowOptions] = useState(false);
	const handleOptionsToggle = () => setShowOptions(prev => !prev);

	return (
		<>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="username"
							onChange={onChange}
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
						className={`${textColorClass}`}
					/>
				</Col>
			</Row>
			{showOptions && (
				<>
					<Row className="mb-3">
						<Col>
							<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
							<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
							<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
							<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

	const [showOptions, setShowOptions] = useState(false);
	const handleOptionsToggle = () => setShowOptions(prev => !prev);

	return (
		<>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="username"
							onChange={onChange}
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
						className={`${textColorClass}`}
					/>
				</Col>
			</Row>
			{showOptions && (
				<>
					<Row>
						<Col>
							<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
							<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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
	const { theme } = useTheme();

	return (
		<>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="username"
							onChange={onChange}
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
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