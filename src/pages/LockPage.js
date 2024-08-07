import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import config from '../config';

const LockPage = () => {
	const { getUserToken, logout } = useAuth();
	const navigate = useNavigate();
	const token = getUserToken();

	const [timeLeft, setTimeLeft] = useState('');

	const [showModal, setShowModal] = useState(false); // 모달 표시 여부를 관리
	const [lockPassword, setLockPassword] = useState(''); // 입력 필드의 값을 관리
	const [attempts, setAttempts] = useState(0);

	useEffect(() => {
		const updateRemainingTime = () => {
			if (token && token.exp) {
				const now = Math.floor(Date.now() / 1000); // 현재 시간(초 단위)
				const remainingTime = token.exp - now;
				if (remainingTime > 0) {
					const minutes = Math.floor(remainingTime / 60);
					const seconds = remainingTime % 60;
					setTimeLeft(`${minutes}분 ${seconds}초`);
				} else {
					setTimeLeft('만료됨');
				}
			}
		};

		updateRemainingTime(); // 초기 남은 시간 설정

		const intervalId = setInterval(updateRemainingTime, 1000); // 1초마다 업데이트

		return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
	}, [token]);

	const handleShowModal = () => {
		setShowModal(true)
	};

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleUnlock = () => {
		if (attempts >= 5) {
			handleLogout();
			return;
		}

		const storedPassword = localStorage.getItem(config.localStorage.lockPassword);

		if (lockPassword === storedPassword) {
			setLockPassword('');
			navigate("/home"); // 이전 페이지로 이동
		} else {
			setAttempts(prev => prev + 1);
			setLockPassword('');
			alert('비밀번호가 틀렸습니다.');
		}
	}

	const handleModalClose = () => setShowModal(false);

	return (
		<>
			<Row>
				<Col>
					<Card>
						<Card.Header><i className="bi bi-lock"></i>Lock</Card.Header>
						<Card.Body>
							<Card.Title><i className="bi bi-person-circle"></i>{token.name}</Card.Title>
							<Card.Text>
								Token expiration time:
								<p><i class="bi bi-hourglass-split"></i>{timeLeft}</p>
							</Card.Text>
							<Button variant="secondary" onClick={handleShowModal}>
								<i class="bi bi-unlock"></i>unlock
							</Button>
							<Button variant="link" onClick={handleLogout}>
								<i className="bi bi-power"></i>logout
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Modal show={showModal} onHide={handleModalClose}>
				<Modal.Header closeButton onHide={handleModalClose}>
					<Modal.Title>Lock Password</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Control
								type="text"
								placeholder="Enter Lock Password."
								value={lockPassword}
								onChange={(e) => setLockPassword(e.target.value)}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={handleUnlock}>
						<i class="bi bi-unlock"></i>unlock
					</Button>
				</Modal.Footer>
			</Modal>
		</>

	);
};

export default LockPage;
