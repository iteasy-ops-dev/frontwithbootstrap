// LockPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import config from '../config';
import { useTheme } from '../ThemeContext';

const LockPage = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { getUserToken, unlock, logout } = useAuth();
  const navigate = useNavigate();
  const token = getUserToken();

  const [timeLeft, setTimeLeft] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [lockPassword, setLockPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (token && token.exp) {
        const now = Math.floor(Date.now() / 1000);
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

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [token]);

  const handleShowModal = () => {
    setShowModal(true);
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
      unlock(); // 잠금 해제
      navigate(-1);
    } else {
      setAttempts(prev => prev + 1);
      setLockPassword('');
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleModalClose = () => setShowModal(false);

  return (
    <>
      <Row>
        <Col>
          <Card className={`text-center bg-${theme}`}>
            <Card.Header className={`${textColorClass}`}><i className="bi bi-lock"></i>Lock</Card.Header>
            <Card.Body>
              <Card.Title className={`${textColorClass}`}><i className="bi bi-person-circle"></i>{token.name}</Card.Title>
              <Card.Text className={`${textColorClass}`}>
                Token expiration time:<br/>
                <i className="bi bi-hourglass-split"></i>{timeLeft}
              </Card.Text>
              <Button variant="secondary" onClick={handleShowModal}>
                <i className="bi bi-unlock"></i>unlock
              </Button>
              <Button variant="link" onClick={handleLogout}>
                <i className="bi bi-power"></i>logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal data-bs-theme={`${theme}`} show={showModal} onHide={handleModalClose}>
        <Modal.Header className={`${textColorClass}`} closeButton onHide={handleModalClose}>
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
            <i className="bi bi-unlock"></i>unlock
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LockPage;
