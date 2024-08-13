import React, { useEffect, useState } from 'react';
import config from '../config';
import useApi from '../hooks/useApi';
import { useTheme } from '../ThemeContext';
import { Navbar, Dropdown, Modal, Form, Button } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { isAuthenticated, logout, getUserToken, lock } = useAuth();
  const { data, callApi } = useApi();
  const navigate = useNavigate(); // Hook for navigation
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부를 관리
  const [showExtendModal, setShowExtendModal] = useState(false); // 세션 연장 모달 표시 여부를 관리
  const [lockPassword, setLockPassword] = useState(''); // 입력 필드의 값을 관리

  const [expirationTime, setExpirationTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const token = getUserToken();
    if (token && token.exp) {
      setExpirationTime(token.exp);
    }
  }, [data]);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (expirationTime) {
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const remainingTime = expirationTime - now;
        if (remainingTime > 0) {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          setTimeLeft(`${minutes}m ${seconds}s`);
          
          // 남은 시간이 5분 이하일 때 연장 모달을 표시
          if (remainingTime <= 300 && !showExtendModal) {
            setShowExtendModal(true);
          }
        } else {
          setTimeLeft('Expired');
          alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
          logout(); // Automatically log out the user when the token expires
          navigate('/login'); // Redirect to login page
        }
      }
    };

    updateRemainingTime(); // Initial update

    const intervalId = setInterval(updateRemainingTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [expirationTime, logout, navigate, showExtendModal]);

  const handleLogout = () => {
    logout(); // Log out the user
    navigate('/login'); // Redirect to login page
  };

  const handleProfile = () => {
    navigate('/profile'); // Navigate to profile edit page
  };

  const handleExpirationExtension = () => {
    callApi(
      config.api.path.extend_extension,
      config.api.method.POST
    ).then(() => {
      setShowExtendModal(false); // 연장 후 모달 닫기
    });
  };

  const handleLock = () => {
    const storedPassword = localStorage.getItem(config.localStorage.lockPassword);
    if (storedPassword) {
      lock()
      navigate('/lock'); // 비밀번호가 있으면 잠금 페이지로 이동
    } else {
      setShowModal(true);
    }
  };

  // modal
  const handleModalClose = () => setShowModal(false);
  const handleModalSave = () => {
    // 저장 버튼 클릭 시 처리할 작업
    setShowModal(false); // 모달을 닫음
    setLockPassword(lockPassword);
    localStorage.setItem(config.localStorage.lockPassword, lockPassword);
    navigate('/lock');
  };

  const handleExtendModalClose = () => setShowExtendModal(false);

  return (
    <>
      <Navbar bg={theme} variant={theme} className="header justify-content-between">
        <Navbar.Brand>
          <img
            alt=""
            height="20px"
            width="120px"
            src="/logo_iteasy.png"
          />{' '}
          Service Ops
        </Navbar.Brand>
        {isAuthenticated && (
          <Dropdown align="end" data-bs-theme={`${theme}`}>
            <Dropdown.Toggle variant={`outline-${theme === "dark" ? "light" : "dark"}`} id="dropdown-basic">
              <i className="bi bi-person-circle"></i>{getUserToken().name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleProfile}><i className="bi bi-person-circle"></i>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleExpirationExtension}><i className="bi bi-hourglass-split"></i>{timeLeft}</Dropdown.Item>
              <Dropdown.Item onClick={handleLock}><i className="bi bi-lock"></i>Lock</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}><i className="bi bi-power"></i>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Navbar>

      <Modal data-bs-theme={`${theme}`} show={showModal} onHide={handleModalClose}>
          <Modal.Header className={`${textColorClass}`}closeButton onHide={handleModalClose}>
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
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalSave}>
              Save
            </Button>
          </Modal.Footer>
      </Modal>

      <Modal data-bs-theme={`${theme}`} how={showExtendModal} onHide={handleExtendModalClose}>
        <Modal.Header className={`${textColorClass}`} closeButton>
          <Modal.Title>세션 연장</Modal.Title>
        </Modal.Header>

        <Modal.Body>세션이 곧 만료됩니다. 연장하시겠습니까?</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleExtendModalClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleExpirationExtension}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
