import React, { useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Offcanvas } from 'react-bootstrap';
import { useTheme } from '../ThemeContext';
import OffcanvasWebConsole from './OffcanvasWebConsole'; // 새로 만든 WebConsole 컴포넌트 import
import { NewBadge } from './Badges'

const TerminalOffcanvas = ({ ips, account, password }) => {
	const [ip, port] = ips.split(':');
	const { theme } = useTheme();  // 테마 정보
	const [show, setShow] = useState(false);  // Offcanvas 열고 닫는 상태
	const [consoleState, setConsoleState] = useState("");  // 터미널의 상태

	const connectionInfo = {
		host: ip,
		port: port ? port : '22',
		username: account,
		password: password
	}

	// Offcanvas 닫기
	const handleClose = () => setShow(false);

	// Offcanvas 열기
	const handleShow = () => setShow(true);

	// Tooltip 수정
	const consoleTooltip = (props) => {
		return (
			<Tooltip id="button-tooltip" {...props}>
				작업할 서버의 접속 정보를 입력하고 눌러주세요!
			</Tooltip>
		);
	}

	return (
		<>
			{/* 오프캔버스를 여는 버튼 */}
			<OverlayTrigger
				placement="top"
				overlay={consoleTooltip}
			>
				<Button variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} onClick={handleShow}>
					Open Terminal <NewBadge />
				</Button>
			</OverlayTrigger>

			{/* Offcanvas 컴포넌트 */}
			<Offcanvas
				data-bs-theme={`${theme}`}  // 테마 적용
				show={show}  // Offcanvas 열림 상태 제어
				onHide={handleClose}  // Offcanvas 닫기 핸들러
				placement="end"  // 오른쪽에서 열리도록 설정
				backdrop={false}  // 배경 클릭 허용
				scroll={true}  // 스크롤 가능
				style={{
					width: 'auto', // Offcanvas 폭 설정
					height: '380px',
					backgroundColor: "black",
					borderRadius: "10px", // 모서리를 둥글게
				}}
			>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>
						<i className="bi bi-terminal"></i>
						{connectionInfo.username}@{connectionInfo.host}:{connectionInfo.port}
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{/* OffcanvasWebConsole을 Offcanvas의 Body 안에 삽입, 상태와 상태 변경 함수 전달 */}
					<OffcanvasWebConsole
						consoleState={consoleState}
						setConsoleState={setConsoleState}
						connectionInfo={connectionInfo}  // 상위 컴포넌트에서 연결 정보 전달
					/>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
};

export default TerminalOffcanvas;
