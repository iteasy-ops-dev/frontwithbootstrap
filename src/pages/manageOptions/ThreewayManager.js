import React, { useState, useEffect } from 'react';
import { Badge, Form, InputGroup, Accordion, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import config from '../../config';
import useApi from '../../hooks/useApi';
import { useTheme } from '../../ThemeContext';

const ThreewayManager = ({ handleOptionChange }) => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

	const [setupType, setSetupType] = useState("");
	const [url, setUrl] = useState('');
	const { data, loading, error, callApi } = useApi();
	const [formData, setFormData] = useState({});

	const handleButtonClick = async () => {
		await callApi(
			config.api.path.erpparser,
			config.api.method.POST,
			{ url }
		);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'setup') {
			setSetupType(value)
		}
		setFormData((prevData) => ({ ...prevData, [name]: value }));
		handleOptionChange(name, value);
	}

	useEffect(() => {
		if (data) {
			// console.log(data.data.Info)
			const {
				UserID,
				UserPass,
				DiskQuota,
				CbandLimit,
				VhostDomain,
				DBUser,
				DBName,
				DBPassword
			} = data.data.Info

			setFormData({
				user_id: UserID,
				user_pass: UserPass,
				disk_quota: DiskQuota,
				cband_limit: CbandLimit,
				vhost_domain: VhostDomain,
				db_user: DBUser,
				db_name: DBName,
				db_password: DBPassword,
			});
		}
	}, [data]);

	useEffect(() => {
		for (const [key, value] of Object.entries(formData)) {
			handleOptionChange(key, value);
		}
	}, [formData])

	return (
		<>
			<h4 className={`${textColorClass}`}>Options</h4>
			<Accordion defaultActiveKey="0" data-bs-theme={`${theme}`}>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.3way_manager' target="_blank" rel="noreferrer">Repository</a>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2">
					<Accordion.Header>ERP Parsing</Accordion.Header>
					<Accordion.Body>
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
							<InputGroup.Text>작업의뢰 URL</InputGroup.Text>
							<Form.Control
								type="text"
								onChange={(e) => setUrl(e.target.value)}
							/>
							<Button variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} onClick={handleButtonClick} disabled={loading}>
								{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Fetch'}
							</Button>
						</InputGroup>
						{error && <Alert variant="danger" className="mt-3">{error}</Alert>}
						{data && <Alert variant="success" className="mt-3"><i className="bi bi-arrow-down-circle-fill"></i> 하단의 타입을 누르고 내용을 확인하세요.</Alert>}
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<br />

			<OptionSelect
				setupType={setupType}
				onChange={handleChange}
			/>
			<br />
			{setupType === "create" && <SetupFields formData={formData} onChange={handleChange} />}
			{setupType === "update-cband" && <UpdateCbandFields formData={formData} onChange={handleChange} />}
			{setupType === "update-access" && <UpdateAccessFiels formData={formData} onChange={handleChange} />}
			{setupType === "remove" && <DeleteFields formData={formData} onChange={handleChange} />}
		</>
	)
}

export default ThreewayManager;

const OptionSelect = ({ setupType, onChange }) => {
	const { theme } = useTheme();
	return (
		<>
			<Row>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>Type</InputGroup.Text>
						<Form.Select
							name="setup"
							value={setupType}
							onChange={onChange}
						>
							<option value="">- Options</option>
							<option value="create">생성(계정,DB,conf)</option>
							<option value="update-cband">트래픽제한변경</option>
							<option value="update-access">접속환경변경(계정비밀번호,iptable)</option>
							<option value="remove">삭제(계정,DB,conf)</option>
						</Form.Select>
					</InputGroup>
				</Col>
				<Col>
					{setupType === "" ?
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
					}
				</Col>
			</Row>
		</>
	);
};

const SetupFields = ({ formData, onChange }) => {
	const { theme } = useTheme();

	return (
		<>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>생성 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_id"
							value={formData.user_id || ""}
							onChange={onChange}
						// placeholder="Enter Account"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>계정 비밀번호</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_pass"
							value={formData.user_pass || ""}
							onChange={onChange}
						// placeholder="Enter Password"
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db admin</InputGroup.Text>
						<Form.Control
							type="text"
							name="mysql_root_user"
							// value="root"
							onChange={onChange}
						// placeholder="Enter Root Account"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db admin 비밀번호</InputGroup.Text>
						<Form.Control
							type="text"
							name="mysql_root_password"
							onChange={onChange}
						// placeholder="Enter Root Password"
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="db_user"
							value={formData.db_user || ""}
							onChange={onChange}
						// placeholder="Enter Create DB Account"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db 계정 비밀번호</InputGroup.Text>
						<Form.Control
							type="text"
							name="db_password"
							value={formData.db_password || ""}
							onChange={onChange}
						// placeholder="Enter Create DB Account Password"
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db 이름</InputGroup.Text>
						<Form.Control
							type="text"
							name="db_name"
							value={formData.db_name || ""}
							onChange={onChange}
						// placeholder="Enter Create DB Name"
						/>
					</InputGroup>
				</Col>
			</Row>
		</>
	);
};

const UpdateCbandFields = ({ formData, onChange }) => {
	const { theme } = useTheme();

	return (
		<>
			<Row className='mb-3'>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>변경할 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_id"
							value={formData.user_id || ""}
							onChange={onChange}
						// placeholder="Enter Account"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>트래픽제한량(GB)</InputGroup.Text>
						<Form.Control
							type="text"
							name="cband_limit"
							value={formData.cband_limit || ""}
							onChange={onChange}
						// placeholder="Enter Cband limit(GB)"
						/>
					</InputGroup>
				</Col>
			</Row>
		</>
	)
}
const UpdateAccessFiels = ({ formData, onChange }) => {
	const { theme } = useTheme();

	return (
		<>
			<Row className='mb-3'>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>변경할 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_id"
							value={formData.user_id || ""}
							onChange={onChange}
						// placeholder="Enter Account"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>변경할 비밀번호</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_pass"
							value={formData.user_pass || ""}
							onChange={onChange}
						// placeholder="Enter Password"
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>IP관리</InputGroup.Text>
						<Form.Control
							type="text"
							// name="user_pass"
							// value={formData.user_pass || ""}
							onChange={onChange}
							placeholder="구현중. 아직 안되요"
							disabled
						/>
					</InputGroup>
				</Col>
			</Row>
		</>
	)
}

const DeleteFields = ({ formData, onChange }) => {
	const { theme } = useTheme();

	return (
		<>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>삭제할 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_id"
							value={formData.user_id || ""}
							onChange={onChange}
						// placeholder="Enter Account"
						/>
					</InputGroup>
				</Col>
				{/* <Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>삭제할 도메인</InputGroup.Text>
						<Form.Control
							type="text"
							name="domain"
							value={formData.domain || ""}
							onChange={onChange}
							placeholder="도메인 한개만 적으세요!"
						/>
					</InputGroup>
				</Col> */}
			</Row>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db admin</InputGroup.Text>
						<Form.Control
							type="text"
							name="mysql_root_user"
							// value="root"
							onChange={onChange}
						// placeholder="Enter DB Root Account"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db admin 비밀번호</InputGroup.Text>
						<Form.Control
							type="text"
							name="mysql_root_password"
							onChange={onChange}
						// placeholder="Enter DB Root Password"
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="db_user"
							value={formData.db_user || ""}
							onChange={onChange}
						// placeholder="Enter DB User"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>db 이름</InputGroup.Text>
						<Form.Control
							type="text"
							name="db_name"
							value={formData.db_name || ""}
							onChange={onChange}
						// placeholder="Enter DB Name"
						/>
					</InputGroup>
				</Col>
			</Row>
		</>
	);
};
