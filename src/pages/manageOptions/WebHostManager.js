import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Accordion, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import config from '../../config';
import useApi from '../../hooks/useApi';
import { useTheme } from '../../ThemeContext';

const WebHostManager = ({ handleOptionChange }) => {
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
					<Accordion.Header>❗️ 필독</Accordion.Header>
					<Accordion.Body>
						1. 현재 테스트 중입니다.<br />
						2. 범용적으로 사용가능하나 쓰리웨이 작업의뢰에 적합합니다.<br />
						3. 범용적으로 사용가능하나 RedHat계열만 가능합니다.<br />
						4. 쓰리웨이 한정으로 아래 ERP 파싱이 가능합니다.<br />
						5. 고객의 실서버에 테스트하기 전, 아래와 같은 내용으로 테스트가 가능합니다.<br />
						<br />
						- Test Server Info<br />
						- Test Server IP ➡️ 10.10.30.212<br />
						- Test Server Port ➡️ 22<br />
						- Test Server Account ➡️ ksidc<br />
						- Test Server Password ➡️ 범용비번<br />
						- Test Server DB Root ➡️ root<br />
						- Test Server DB Password ➡️ 범용비번<br />
						- Test Erp Paring URL <br />
						➡️ https://admin.ksidc.net/service/request_info/?mem_idx=40396&idx=226533<br />
						<br />
						6. 문의사항, 버그, 이슈에 대해서는 아래 메일로 문의해주세요.<br />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.webhost_manager' target='_blank'>Repository</a>
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
			{setupType === "true" && <SetupFields formData={formData} onChange={handleChange} />}
			{setupType === "false" && <DeleteFields formData={formData} onChange={handleChange} />}
		</>
	)
}

export default WebHostManager;

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
							<option value="true">생성</option>
							<option value="false">삭제</option>
						</Form.Select>
					</InputGroup>
				</Col>
				<Col>
					{setupType === "" ?
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
							<InputGroup.Text><i className="bi bi-arrow-left-circle-fill"></i></InputGroup.Text>
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
							<InputGroup.Text><i className="bi bi-arrow-down-circle-fill"></i></InputGroup.Text>
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
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';
	const [showDbOptions, setShowDbOptions] = useState(false);
	const [showQuotaOptions, setShowQuotaOptions] = useState(false);
	const [showCbandOptions, setShowCbandOptions] = useState(false);

	// Handler for toggling options visibility
	const handleDbOptionsToggle = () => setShowDbOptions(prev => !prev);
	const handleQuotaOptionsToggle = () => setShowQuotaOptions(prev => !prev);
	const handleCbandOptionsToggle = () => setShowCbandOptions(prev => !prev);

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
							placeholder="Enter Account"
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
							placeholder="Enter Password"
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>vhost</InputGroup.Text>
						<Form.Control
							type="text"
							name="vhost_domain"
							value={formData.vhost_domain || ""}
							onChange={onChange}
							placeholder="Enter vhost"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>listen Port</InputGroup.Text>
						<Form.Control
							type="text"
							name="listen_port"
							onChange={onChange}
							placeholder="Default Port: 80"
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<Form.Check
						type="checkbox"
						label="Cband옵션"
						checked={showCbandOptions}
						onChange={handleCbandOptionsToggle}
						className={`${textColorClass}`}
					/>
					{showCbandOptions && (
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
							<InputGroup.Text>Cband_limit</InputGroup.Text>
							<Form.Control
								type="text"
								name="cband_limit"
								value={formData.cband_limit || ""}
								onChange={onChange}
								placeholder="Enter Cband limit(GB)"
							/>
						</InputGroup>
					)}
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<Form.Check
						type="checkbox"
						label="Quota옵션"
						checked={showQuotaOptions}
						onChange={handleQuotaOptionsToggle}
						className={`${textColorClass}`}
					/>
					{showQuotaOptions && (
						<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
							<InputGroup.Text>Quota Limit</InputGroup.Text>
							<Form.Control
								type="text"
								name="disk_quota"
								value={formData.disk_quota || ""}
								onChange={onChange}
								placeholder="Enter Qouta(GB)"
							/>
						</InputGroup>
					)}
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<Form.Check
						type="checkbox"
						label="DB옵션"
						checked={showDbOptions}
						onChange={handleDbOptionsToggle}
						className={`${textColorClass}`}
					/>
					{showDbOptions && (
						<>
							<Row className="mb-3">
								<Col>
									<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
										<InputGroup.Text>db admin</InputGroup.Text>
										<Form.Control
											type="text"
											name="mysql_root_user"
											onChange={onChange}
											placeholder="Enter Root Account"
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
											placeholder="Enter Root Password"
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
											placeholder="Enter Create DB Account"
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
											placeholder="Enter Create DB Account Password"
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
											placeholder="Enter Create DB Name"
										/>
									</InputGroup>
								</Col>
							</Row>
						</>
					)}
				</Col>
			</Row>
		</>
	);
};

const DeleteFields = ({ formData, onChange }) => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

	const [showDbOptions, setShowDbOptions] = useState(false);

	// Handler for toggling database options visibility
	const handleDbOptionsToggle = () => setShowDbOptions(prev => !prev);

	return (
		<>
			<Alert key="warning" variant="warning">
				WARM: 수동으로 생성된 계정에 대해서 오류가 날 수 있습니다.
			</Alert>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text>삭제할 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_id"
							value={formData.user_id || ""}
							onChange={onChange}
							placeholder="Enter Account"
						/>
					</InputGroup>
				</Col>
			</Row>

			<Row className="mb-3">
				<Col>
					<Form.Check
						type="checkbox"
						label="DB옵션"
						checked={showDbOptions}
						onChange={handleDbOptionsToggle}
						className={`${textColorClass}`}
					/>
				</Col>
			</Row>

			{showDbOptions && (
				<>
					<Row className="mb-3">
						<Col>
							<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
								<InputGroup.Text>db admin</InputGroup.Text>
								<Form.Control
									type="text"
									name="mysql_root_user"
									onChange={onChange}
									placeholder="Enter DB Root Account"
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
									placeholder="Enter DB Root Password"
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
									placeholder="Enter DB User"
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
									placeholder="Enter DB Name"
								/>
							</InputGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};
