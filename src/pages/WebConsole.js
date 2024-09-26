import React, { useEffect, useRef, useState } from "react";
import { useTheme } from '../ThemeContext';
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";  // xterm 스타일 적용
import { Row, Accordion, Modal, Button, Form } from 'react-bootstrap'; // React Bootstrap import
import config from '../config';

const WebConsole = () => {
	const { theme } = useTheme();
	const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

	const terminalRef = useRef(null); // 터미널 DOM 레퍼런스
	const term = useRef(null);        // xterm 터미널 인스턴스
	const fitAddon = useRef(null);    // 터미널 사이즈 맞춤 플러그인
	const socket = useRef(null);      // WebSocket
	const [isSocketReady, setIsSocketReady] = useState(false); // WebSocket 준비 상태
	const [showModal, setShowModal] = useState(true); // 모달 보이기 상태
	const [connectionInfo, setConnectionInfo] = useState({
		host: '',
		port: '22',
		username: '',
		password: ''
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setConnectionInfo((prevInfo) => ({
			...prevInfo,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { host, port, username, password } = connectionInfo;

		// WebSocket 연결 설정
		socket.current = new WebSocket(config.ws.url);

		// WebSocket이 열렸을 때 SSH 정보를 전송
		socket.current.onopen = () => {
			setIsSocketReady(true);
			setShowModal(false); // 연결 성공 시 모달 닫기
			console.log("WebSocket connected!");

			// 서버로 SSH 접속 정보를 전송
			socket.current.send(JSON.stringify({ host, port, username, password }));
		};

		// 서버로부터의 메세지를 터미널에 출력
		socket.current.onmessage = (event) => {
			if (term.current) {
				term.current.write(event.data); // 서버에서 온 데이터 터미널에 출력
			}
		};

		// 연결 오류 처리
		socket.current.onerror = (error) => {
			console.error("WebSocket Error:", error);
		};

		// 컴포넌트 언마운트 시 WebSocket 정리
		return () => {
			if (socket.current) {
				socket.current.close();
			}
		};
	};

	useEffect(() => {
		// WebSocket이 준비되면 터미널 초기화
		if (isSocketReady) {
			// xterm.js 터미널 생성
			term.current = new Terminal({
				cols: 80,
				rows: 24,
				cursorBlink: true,      // 깜박이는 커서
				theme: {
					background: "#000000",  // 터미널 배경 색상
					foreground: "#FFFFFF"   // 터미널 글자 색상
				}
			});

			// 터미널 DOM에 xterm 터미널 부착
			fitAddon.current = new FitAddon();
			term.current.loadAddon(fitAddon.current);
			term.current.open(terminalRef.current);

			// 화면 크기에 맞게 터미널 사이즈 조정
			fitAddon.current.fit();

			// 터미널에서 사용자 입력을 서버로 전송
			term.current.onData((input) => {
				if (socket.current.readyState === WebSocket.OPEN) {
					socket.current.send(input); // 사용자가 입력한 값을 서버로 전송
				}
			});

			// 컴포넌트 언마운트 시 터미널 정리
			return () => {
				if (term.current) {
					term.current.dispose();
				}
			};
		}
	}, [isSocketReady]); // WebSocket 준비 상태가 변경될 때마다 실행

	return (
		<>
			<h1 className={`header-title ${textColorClass}`}>Web Console</h1>
			{/* <p className={`header-description ${textColorClass}`}>매니지드 VPN과 연결된 서버에 접속 할 수 있습니다.</p> */}

			{/* 모달창 - 호스트, 포트, 아이디, 비밀번호 입력 */}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Connect to WebSocket</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="formHost">
							<Form.Label>Host</Form.Label>
							<Form.Control
								type="text"
								name="host"
								placeholder="Enter host"
								value={connectionInfo.host}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formPort">
							<Form.Label>Port</Form.Label>
							<Form.Control
								type="text"
								name="port"
								placeholder="Enter port"
								value={connectionInfo.port}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formUsername">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								name="username"
								placeholder="Enter username"
								value={connectionInfo.username}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								name="password"
								placeholder="Enter password"
								value={connectionInfo.password}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>

						<Button variant="primary" type="submit">
							Connect
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
			<Accordion data-bs-theme={`${theme}`}>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Access Info</Accordion.Header>
					<Accordion.Body>
						<p className={`header-description ${textColorClass}`}><strong>HOST: </strong>{connectionInfo.host}</p>
						<p className={`header-description ${textColorClass}`}><strong>PORT: </strong>{connectionInfo.port}</p>
						<p className={`header-description ${textColorClass}`}><strong>USER: </strong>{connectionInfo.username}</p>
						<p className={`header-description ${textColorClass}`}><strong>PWD: </strong>{connectionInfo.password}</p>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<hr></hr>
			{/* 터미널 출력 */}
			{isSocketReady && (
				<div
					ref={terminalRef}
					style={{
						width: "100%",
						height: "70%",
						backgroundColor: "black",
						borderRadius: "10px", // 모서리를 둥글게
						padding: "10px", // 안쪽 여백 추가
						boxSizing: "border-box", // padding이 너비에 포함되도록 설정 
					}}
				></div>
			)}
		</>
	);
};

export default WebConsole;
