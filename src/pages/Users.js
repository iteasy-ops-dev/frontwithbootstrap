import React, { useState, useEffect } from 'react';
import { InputGroup, Pagination, Table, Button, Spinner, Alert, Modal, Row, Col, Form } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';

const User = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { getUserToken } = useAuth();
  const isAdmin = getUserToken().email === config.admin;
  const [view, setView] = useState(true);
  const [showAccessLog, setShowAccessLog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // 검색 옵션
  const [filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [active, setActive] = useState('');
  const [verified, setVerified] = useState('');

  const usersApi = useApi();
  const userUpdateStatusApi = useApi();

  const fetchData = (page) => {
    usersApi.callApi(
      config.api.path.users,
      config.api.method.POST,
      { filter, page, pageSize }
    );
  };

  useEffect(() => {
    if (usersApi.data) {
      setTotalPages(usersApi.data.data.totalPages);
    }
  }, [usersApi]);

  useEffect(() => {
    // console.log(currentPage)
    fetchData(currentPage);
  }, [currentPage, filter, view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);

    const activeBool = active === 'true' ? true : active === 'false' ? false : '';
    const verifiedBool = verified === 'true' ? true : verified === 'false' ? false : '';

    setFilter({
      name: {
        $regex: name,
        $options: "i",
      },
      email: {
        $regex: email,
        $options: "i",
      },
      isActive: activeBool !== '' ? activeBool : { $exists: true },
      verified: verifiedBool !== '' ? verifiedBool : { $exists: true },
    });
  }


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChangeButtonClick = (user) => {
    userUpdateStatusApi.callApi(
      config.api.path.update_active,
      config.api.method.POST,
      user
    );
    if (userUpdateStatusApi.data && userUpdateStatusApi.data.status === 200) {
      setView(!view);
    }
  };

  const handleAccessLogShow = (user) => {
    setSelectedLog(user);
    setShowAccessLog(true);
  }

  const handleAccessLogClose = () => {
    setShowAccessLog(false);
    setSelectedLog(null);
  }

  // Pagination component
  const itemsPerSide = 5; // Number of page buttons to show on each side of the current page
  const startPage = Math.max(1, currentPage - itemsPerSide)
  const endPage = Math.min(totalPages, currentPage + itemsPerSide);

  const paginationItems = [];
  for (let number = startPage; number <= endPage; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      <h1 className={`header-title ${textColorClass}`}>Users</h1>
      <p className={`header-description ${textColorClass}`}>Here you can check the registered users and their status.</p>

      <Row>
        <p className={`header-description ${textColorClass}`}><strong>Search Options</strong></p>
      </Row>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Row>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Name</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter Worker Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Email</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter Worker Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Active</InputGroup.Text>
              <Form.Select
                value={active}
                onChange={(e) => setActive(e.target.value)}
              >
                <option value="">- All</option>
                <option value={true}>true</option>
                <option value={false}>false</option>
              </Form.Select>
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Verified</InputGroup.Text>
              <Form.Select
                value={verified}
                onChange={(e) => setVerified(e.target.value)}
              >
                <option value="">- All</option>
                <option value={true}>true</option>
                <option value={false}>false</option>
              </Form.Select>
            </InputGroup>
          </Col>
          <Col>
            <Button className="w-100" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} type="submit" disabled={usersApi.loading}>
              {usersApi.loading ? <Spinner as="span" animation="border" size="sm" /> : 'Search'}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* 데이터 로딩 중에 스피너 표시 */}
      {usersApi.loading && <Spinner animation="border" />}

      {/* 데이터가 없거나 로딩 중일 때 에러 메시지 표시 */}
      {usersApi.error && <Alert variant="danger" className="mt-3">{usersApi.error}</Alert>}

      {usersApi.data && (
        <>
          <Row>
            <p className={`header-description ${textColorClass}`}><strong>Results</strong></p>
          </Row>
          <Table striped bordered hover className="mt-3" variant={`${theme}`}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Name</th>
                <th style={{ textAlign: 'center' }}>Email</th>
                <th style={{ textAlign: 'center' }}>Active</th>
                <th style={{ textAlign: 'center' }}>Verified</th>
                <th style={{ textAlign: 'center' }}>Created</th>
                <th style={{ textAlign: 'center' }}>Log</th>
              </tr>
            </thead>
            <tbody>
              {usersApi.data.data.data !== null ? (
                usersApi.data.data.data.map((user, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td style={{ textAlign: 'center' }}>{user.Name}</td>
                      <td style={{ textAlign: 'center' }}>{user.Email}</td>
                      <td style={{ textAlign: 'center' }}>
                        {user.IsActive ? <i className="bi bi-person-fill-check"></i> : <i className="bi bi-ban-fill"></i>}
                        {isAdmin && (
                          <Button variant="link" onClick={() => handleChangeButtonClick(user)} size="sm" disabled={userUpdateStatusApi.loading}>
                            {userUpdateStatusApi.loading ? <Spinner as="span" animation="border" size="sm" /> : <i className="bi bi-arrow-repeat"></i>}
                          </Button>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>{user.Verified ? <i className="bi bi-person-fill-check"></i> : <i className="bi bi-question-circle-fill"></i>}</td>
                      <td style={{ textAlign: 'center' }}>{new Date(user.AtCreateDate * 1000).toLocaleString()}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button variant="link" onClick={() => handleAccessLogShow(user.AccessLog)}>
                          <i className="bi bi-info-circle-fill"></i>
                        </Button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No users available</td>
                </tr>
              )}
            </tbody>

          </Table>
          <Row>
            <Col></Col>
            <Col>
              <Pagination className="mt-3" data-bs-theme={`${theme}`}>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {paginationItems}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </Col>
            <Col></Col>
          </Row>
        </>
      )}

      <Modal size="lg" show={showAccessLog} onHide={handleAccessLogClose}>
        <Modal.Header closeButton>
          <Modal.Title>Access Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && selectedLog.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {selectedLog
                .slice(0)
                .reverse()
                .map((log, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                      <p><strong>Agent:</strong> {log.Agent}</p>
                    </div>
                    <p><strong>IP:</strong> {log.Ip}</p>
                    <p><strong>Access Time:</strong> {new Date(log.AccessTime * 1000).toLocaleString()}</p>
                    <hr />
                  </div>
                ))}
            </div>
          ) : (
            <p>No Access Logs available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAccessLogClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default User;

