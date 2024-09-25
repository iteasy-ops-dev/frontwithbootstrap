import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip, Stack, InputGroup, Table, Row, Col, Button, Alert, Spinner, Form } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import usePushNotification from '../hooks/usePushNotification';  // 알림 훅 추가
import { useTheme } from '../ThemeContext';

const ERP_URL = 'https://admin.ksidc.net';

const WorkMonitor = () => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';
	const { data = [], loading, error, callApi } = useApi(); // data 초기값 빈 배열
	const { fireNotification } = usePushNotification(); // 알림 훅에서 알림 함수 호출
	const [hasData, setHasData] = useState(false);
	// const [excludedCompanies, setExcludedCompanies] = useState([
	// 	"주식회사 쓰리웨이",
	// 	"(주)웹모아",
	// ]); // 알림을 제외할 업체 리스트
	// const [newExcludedCompany, setNewExcludedCompany] = useState(""); // 신규 제외할 업체 입력 값
	// const [alertThreshold, setAlertThreshold] = useState(10); // 알림 트리거 시간을 상태로 관리 (기본값: 10분)
	// const [intervalMinutes, setIntervalMinutes] = useState(1); // API 호출 시간 간격(분단위)

	const [excludedCompanies, setExcludedCompanies] = useState(() => {
		const defaultValue = [
			"주식회사 쓰리웨이",
			"(주)웹모아",
		];

		// localStorage에서 데이터를 가져옴
		let saved = localStorage.getItem(config.localStorage.monitor.excludedCompanies);

		// 저장된 데이터가 없으면 기본값을 저장
		if (!saved) {
			localStorage.setItem(config.localStorage.monitor.excludedCompanies, JSON.stringify(defaultValue));
			saved = JSON.stringify(defaultValue); // saved에 기본값을 할당
		}

		// 배열로 변환
		return JSON.parse(saved)
	});
	// 알림을 제외할 업체 리스트

	const [newExcludedCompany, setNewExcludedCompany] = useState(""); // 신규 제외할 업체 입력 값
	const [alertThreshold, setAlertThreshold] = useState(() => {
		const defaultValue = 10
		// localStorage에서 데이터를 가져옴
		let saved = localStorage.getItem(config.localStorage.monitor.alertThreshold);

		// 저장된 데이터가 없으면 기본값을 저장
		if (!saved) {
			localStorage.setItem(config.localStorage.monitor.alertThreshold, JSON.stringify(defaultValue));
			saved = JSON.stringify(defaultValue); // saved에 기본값을 할당
		}

		// 배열로 변환
		return Number(saved)
	}); // 알림 트리거 시간을 상태로 관리 (기본값: 10분)

	const [intervalMinutes, setIntervalMinutes] = useState(() => {
		const defaultValue = 1
		// localStorage에서 데이터를 가져옴
		let saved = localStorage.getItem(config.localStorage.monitor.intervalMinutes);

		// 저장된 데이터가 없으면 기본값을 저장
		if (!saved) {
			localStorage.setItem(config.localStorage.monitor.intervalMinutes, JSON.stringify(defaultValue));
			saved = JSON.stringify(defaultValue); // saved에 기본값을 할당
		}

		// 배열로 변환
		return Number(saved)
	}); // API 호출 시간 간격(분단위)

	// API 데이터 호출 함수
	const handleFetchData = async () => {
		setHasData(false);
		try {
			await callApi(config.api.path.workhistory, config.api.method.GET);
			setHasData(true);
		} catch (err) {
			console.error("Failed to fetch data", err);
		}
	};

	// 날짜 문자열 파싱 함수
	const parseDateString = (dateString) => {
		const [full_day, time] = dateString.split(' ');
		const [year, month, day] = full_day.split('-');
		const full_year = parseInt(year, 10) + 2000;

		const formattedDate = `${full_year}-${month}-${day}T${time}:00`;
		return new Date(formattedDate);
	};

	const dateDiff = (dateString) => {
		const now = new Date();
		const rdate = parseDateString(dateString);
		const timeDiff = (now - rdate) / 1000 / 60; // 차이를 분 단위로 계산
		return parseInt(timeDiff);
	};

	const checkDateDiff = () => {
		// 알림을 모을 배열
		const alerts = [];

		// 데이터 순회
		data.data.forEach((item) => {
			// Worker가 없고 제외된 업체가 아닌 경우
			if (item.Worker === "" && !excludedCompanies.includes(item.CompanyName) && item.RequestLink) {
				const timeDiff = dateDiff(item.RegistrationDate);
				if (timeDiff > alertThreshold) {
					// 알림 메시지를 배열에 추가
					alerts.push(`${item.CompanyName}: ${parseInt(timeDiff)}분 지났습니다.`);
					// fireNotification(`작업 지연 알림`, { body: `${item.CompanyName}: ${parseInt(timeDiff)}분 지났습니다.` });
				}
			}
		});

		// 알림 배열에 내용이 있으면 브라우저 알림을 한 번에 출력
		if (alerts.length > 0) {
			fireNotification("작업 요청 알림", { body: alerts.join("\n") }); // 알림 훅 사용
		}
	};

	// 신규 제외할 업체 추가
	const handleAddExcludedCompany = () => {
		if (newExcludedCompany && !excludedCompanies.includes(newExcludedCompany)) {
			setExcludedCompanies([...excludedCompanies, newExcludedCompany]);
		}
		setNewExcludedCompany("");
	};

	// 업체명 클릭 시 제외 리스트에 추가
	const handleExcludeCompany = (company) => {
		if (!excludedCompanies.includes(company)) {
			setExcludedCompanies([...excludedCompanies, company]);
		}
	};

	// 제외할 업체 삭제
	const handleRemoveExcludedCompany = (company) => {
		setExcludedCompanies(excludedCompanies.filter((comp) => comp !== company));
	};

	// // 컴포넌트가 마운트되면 데이터를 가져오고, 주기적으로 API 호출
	useEffect(() => {
		handleFetchData(); // 첫 번째 호출
		const interval = setInterval(() => {
			handleFetchData();
		}, intervalMinutes * 60 * 1000); // 분단위

		return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
	}, [intervalMinutes]); // intervalMinutes가 변경될 때마다 새 인터벌 설정

	// 데이터를 받아올 때마다 5분 이상 지난 항목을 체크
	useEffect(() => {
		if (hasData) {
			// console.log(data)
			checkDateDiff();
			localStorage.setItem(config.localStorage.monitor.excludedCompanies, JSON.stringify(excludedCompanies));
			localStorage.setItem(config.localStorage.monitor.alertThreshold, JSON.stringify(alertThreshold));
			localStorage.setItem(config.localStorage.monitor.intervalMinutes, JSON.stringify(intervalMinutes));
		}
	}, [data, hasData, alertThreshold, excludedCompanies]); // alertThreshold, excludedCompanies

	const deleteTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			제외 업체 삭제!
		</Tooltip>
	);
	const addTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			제외 업체 추가!
		</Tooltip>
	);
	const moveTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			작업의뢰 페이지로 이동!
		</Tooltip>
	);

	return (
		<>
			<h1 className={`header-title ${textColorClass}`}>Work History Monitor</h1>
			<p className={`header-description ${textColorClass}`}>You can monitor your work requests here.</p>

			<Row className="mb-3" md="auto">
				<p className={`header-description ${textColorClass}`}><strong>Options</strong></p>
			</Row>
			{/* 알림 기준 시간 및 API 호출 시간 설정 */}
			<Row className="mb-3" md="auto">
				<Col>
					{/* 알림 기준 시간 설정 */}
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text><i className="bi bi-alarm"></i>  지연알람(분)</InputGroup.Text>
						<Form.Control
							type="number"
							value={alertThreshold}
							onChange={(e) => setAlertThreshold(Number(e.target.value))}
						/>
					</InputGroup>
				</Col>
				<Col>
					{/* API 호출 시간 주기 설정 */}
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text><i className="bi bi-clock"></i>  반복주기(분)</InputGroup.Text>
						<Form.Control
							type="number"
							value={intervalMinutes}
							onChange={(e) => setIntervalMinutes(Number(e.target.value))}
							placeholder="API 호출 간격 (분 단위)"
						/>
					</InputGroup>
				</Col>
				<Col>
					{/* 업체명 제외 관리 UI */}
					<InputGroup className="mb-3" data-bs-theme={`${theme}`}>
						<InputGroup.Text><i className="bi bi-building-x"></i></InputGroup.Text>
						<Form.Control
							type="text"
							placeholder="제외할 업체명 입력"
							value={newExcludedCompany}
							onChange={(e) => setNewExcludedCompany(e.target.value)}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Button onClick={handleAddExcludedCompany} className="w-100" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`}>업체 추가</Button>
				</Col>
				<Col>
					<Button onClick={handleFetchData} className="w-100" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`}>
						<i className="bi bi-arrow-clockwise"></i>
					</Button>
				</Col>
			</Row>
			<Row className="mb-3" md="auto">
				<Col>
					<Row className="mb-3" md="auto">
						<p className={`header-description ${textColorClass}`}><strong>제외된 업체 목록</strong></p>
					</Row>
					{excludedCompanies.length > 0 ? (
						<Stack direction="horizontal" gap={3}>
							{excludedCompanies.map((company, index) => (
								<OverlayTrigger
									placement="top"
									overlay={deleteTooltip}
								>
									<div className={`bg-${theme} ${textColorClass}`} onClick={() => handleRemoveExcludedCompany(company)}>
										{index + 1}. {company}  <i className="bi bi-x-circle"></i>  <div className="vr" />
									</div>
								</OverlayTrigger>
							))}
						</Stack>
					) : (
						<>
							<Row className="mb-3" md="auto">
								<p className={`header-description ${textColorClass}`}>제외된 업체가 없습니다</p>
							</Row>
						</>
					)}
				</Col>
			</Row>

			<Row>
				<p className={`header-description ${textColorClass}`}><strong>Work History</strong></p>
			</Row>
			<Table striped bordered hover className="mt-3" variant={`${theme}`}>
				<thead>
					<tr>
						<th style={{ textAlign: 'center' }}>No.</th>
						<th style={{ textAlign: 'center' }}>처리상황</th>
						<th style={{ textAlign: 'center' }}>등록시간</th>
						<th style={{ textAlign: 'center' }}>지연시간</th>
						<th style={{ textAlign: 'center' }}>업체명</th>
						<th style={{ textAlign: 'center' }}>브랜드</th>
						<th style={{ textAlign: 'center' }}>바로가기</th>
					</tr>
				</thead>
				<tbody>
					{loading && (
						<td colSpan={7}>
							<Spinner animation="border" className="mt-3" />
						</td>
					)}
					{error && (
						<td colSpan={7}>
							<Alert variant="danger">
								{`Error: ${error}`}
							</Alert>
						</td>
					)}
					{hasData && data.data
						.filter(item => item.Worker === "" && item.RequestLink) // Worker가 빈 문자열인 항목만 필터링
						.map((item) => (
							<tr key={item.Index}>
								<td style={{ textAlign: 'center' }}>{item.Index}</td>
								<td style={{ textAlign: 'center' }}>{item.ProcessingStatus}</td>
								<td style={{ textAlign: 'center' }}>{item.RegistrationDate}</td>
								<td style={{ textAlign: 'center' }}>{dateDiff(item.RegistrationDate)}m</td>
								<OverlayTrigger
									placement="right"
									overlay={addTooltip}
								>
									<td style={{ textAlign: 'center' }} onClick={() => handleExcludeCompany(item.CompanyName)}>
										{item.CompanyName}<i className="bi bi-plus-circle"></i>
									</td>
								</OverlayTrigger>
								<td style={{ textAlign: 'center' }}>{item.Brand}</td>
								<td style={{ textAlign: 'center' }}>
									<OverlayTrigger
										placement="top"
										overlay={moveTooltip}
									>
										<a href={`${ERP_URL}${item.RequestLink}`} target="_blank" rel="noopener noreferrer">
											<i className="bi bi-browser-safari"></i>
										</a>
									</OverlayTrigger>
								</td>
							</tr>
						))}
				</tbody>
			</Table>
		</>
	);
};

export default WorkMonitor;