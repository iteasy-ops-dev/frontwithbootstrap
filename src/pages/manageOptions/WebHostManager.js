import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Accordion, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import config from '../../config';
import useApi from '../../hooks/useApi';

const WebHostManager = ({ handleOptionChange }) => {
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
			console.log(data.data.Info)
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
			<h4>Options</h4>
			<Accordion>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Info</Accordion.Header>
					<Accordion.Body>
						👋 <a href='https://github.com/iteasy-ops-dev/ansible.roles.webhost_manager' target='_blank'>Repository</a>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header>TEST</Accordion.Header>
					<Accordion.Body>
						<InputGroup className="mb-3">
							<InputGroup.Text>작업의뢰 URL</InputGroup.Text>
							<Form.Control
								type="text"
								onChange={(e) => setUrl(e.target.value)}
							/>
						</InputGroup>
						<Button variant="primary" onClick={handleButtonClick} disabled={loading}>
							{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Fetch'}
						</Button>
						{error && <Alert variant="danger" className="mt-3">{error}</Alert>}
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<br />

			<OptionSelect
				setupType={setupType}
				onChange={handleChange}
			/>

			{setupType === "true" && <SetupFields formData={formData} onChange={handleChange} />}
			{setupType === "false" && <DeleteFields formData={formData} onChange={handleChange} />}
		</>
	)
}

export default WebHostManager;

const OptionSelect = ({ setupType, onChange }) => {
	return (
		<InputGroup className="mb-3">
			<InputGroup.Text>Type</InputGroup.Text>
			<Form.Select
				name="setup"
				value={setupType}
				onChange={onChange}
			>
				<option value="">Options</option>
				<option value="true">생성</option>
				<option value="false">삭제</option>
			</Form.Select>
		</InputGroup>
	);
};

const SetupFields = ({ formData, onChange }) => {
	const [showDbOptions, setShowDbOptions] = useState(false);
	const [showQuotaOptions, setShowQuotaOptions] = useState(false);
	const [showCbandOptions, setShowCbandOptions] = useState(false);

	// Handler for toggling options visibility
	const handleDbOptionsToggle = () => setShowDbOptions(prev => !prev);
	const handleQuotaOptionsToggle = () => setShowQuotaOptions(prev => !prev);
	const handleCbandOptionsToggle = () => setShowCbandOptions(prev => !prev);

	return (
		<Form>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>생성 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_id"
							value={formData.user_id || ""}
							onChange={onChange}
							placeholder="iteasy"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>계정 비밀번호</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_pass"
							value={formData.user_pass || ""}
							onChange={onChange}
							placeholder="iteasy"
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>vhost</InputGroup.Text>
						<Form.Control
							type="text"
							name="vhost_domain"
							value={formData.vhost_domain || ""}
							onChange={onChange}
							placeholder="example.com"
						/>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>listen Port</InputGroup.Text>
						<Form.Control
							type="text"
							name="listen_port"
							onChange={onChange}
							placeholder="80"
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
					/>
					{showCbandOptions && (
						<InputGroup className="mb-3">
							<InputGroup.Text>Cband_limit</InputGroup.Text>
							<Form.Control
								type="text"
								name="cband_limit"
								value={formData.cband_limit || ""}
								onChange={onChange}
								placeholder="3"
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
					/>
					{showQuotaOptions && (
						<InputGroup className="mb-3">
							<InputGroup.Text>Quota Limit</InputGroup.Text>
							<Form.Control
								type="text"
								name="disk_quota"
								value={formData.disk_quota || ""}
								onChange={onChange}
								placeholder="unlimited"
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
					/>
					{showDbOptions && (
						<>
							<Row className="mb-3">
								<Col>
									<InputGroup className="mb-3">
										<InputGroup.Text>db admin</InputGroup.Text>
										<Form.Control
											type="text"
											name="mysql_root_user"
											onChange={onChange}
											placeholder="root"
										/>
									</InputGroup>
								</Col>
								<Col>
									<InputGroup className="mb-3">
										<InputGroup.Text>db admin 비밀번호</InputGroup.Text>
										<Form.Control
											type="text"
											name="mysql_root_password"
											onChange={onChange}
											placeholder="mysql_root_password"
										/>
									</InputGroup>
								</Col>
							</Row>
							<Row className="mb-3">
								<Col>
									<InputGroup className="mb-3">
										<InputGroup.Text>db 계정</InputGroup.Text>
										<Form.Control
											type="text"
											name="db_user"
											value={formData.db_user || ""}
											onChange={onChange}
											placeholder="db_user"
										/>
									</InputGroup>
								</Col>
								<Col>
									<InputGroup className="mb-3">
										<InputGroup.Text>db 계정 비밀번호</InputGroup.Text>
										<Form.Control
											type="text"
											name="db_password"
											value={formData.db_password || ""}
											onChange={onChange}
											placeholder="db_password"
										/>
									</InputGroup>
								</Col>

							</Row>
							<Row>
								<Col>
									<InputGroup className="mb-3">
										<InputGroup.Text>db 이름</InputGroup.Text>
										<Form.Control
											type="text"
											name="db_name"
											value={formData.db_name || ""}
											onChange={onChange}
											placeholder="db_name"
										/>
									</InputGroup>
								</Col>
							</Row>
						</>
					)}
				</Col>
			</Row>
		</Form>
	);
};

const DeleteFields = ({ formData, onChange }) => {
	const [showDbOptions, setShowDbOptions] = useState(false);

	// Handler for toggling database options visibility
	const handleDbOptionsToggle = () => setShowDbOptions(prev => !prev);

	return (
		<Form>
			<Alert key="warning" variant="warning">
				WARM: 수동으로 생성된 계정에 대해서 오류가 날 수 있습니다.
			</Alert>
			<Row className="mb-3">
				<Col>
					<InputGroup className="mb-3">
						<InputGroup.Text>삭제할 계정</InputGroup.Text>
						<Form.Control
							type="text"
							name="user_id"
							value={formData.user_id || ""}
							onChange={onChange}
							placeholder="iteasy"
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
					/>
				</Col>
			</Row>

			{showDbOptions && (
				<>
					<Row className="mb-3">
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>db admin</InputGroup.Text>
								<Form.Control
									type="text"
									name="mysql_root_user"
									onChange={onChange}
									placeholder="root"
								/>
							</InputGroup>
						</Col>
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>db admin 비밀번호</InputGroup.Text>
								<Form.Control
									type="text"
									name="mysql_root_password"
									onChange={onChange}
									placeholder="mysql_root_password"
								/>
							</InputGroup>
						</Col>
					</Row>
					<Row className="mb-3">
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>db 계정</InputGroup.Text>
								<Form.Control
									type="text"
									name="db_user"
									value={formData.db_user || ""}
									onChange={onChange}
									placeholder="db_user"
								/>
							</InputGroup>
						</Col>
						<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text>db 이름</InputGroup.Text>
								<Form.Control
									type="text"
									name="db_name"
									value={formData.db_name || ""}
									onChange={onChange}
									placeholder="db_name"
								/>
							</InputGroup>
						</Col>
					</Row>
				</>
			)}
		</Form>
	);
};
