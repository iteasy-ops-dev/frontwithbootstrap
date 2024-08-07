import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home'); // 홈으로 이동하는 함수
  };

  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1 className="display-1">404</h1>
          <p className="lead">페이지를 찾을 수 없습니다.</p>
          <Button variant="primary" onClick={handleGoHome}>
            홈으로 돌아가기
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
