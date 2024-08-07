import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';

const LockPage = () => {
	const { getUserToken } = useAuth();
	const navigate = useNavigate();
	const token = getUserToken();

	const [timeLeft, setTimeLeft] = useState('');

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

	const handleUnlock = () => {
		navigate(-1); // 이전 페이지로 이동
	};

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
							<Button variant="secondary" onClick={handleUnlock}>
								<i class="bi bi-unlock"></i>unlock
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>

	);
};

export default LockPage;
