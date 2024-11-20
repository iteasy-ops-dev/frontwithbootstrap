import React, { useState, useEffect } from 'react';
import { InputGroup, Table, Alert, Button, Spinner, Form, Modal, Row, Col, Pagination } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { translateManageType } from "../utils/utils";

const Monitor = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { data, loading, error, callApi } = useApi(config.mm_api.baseUrl);
  const { getUserToken } = useAuth();

  const [name] = useState(getUserToken().name);
  const [email] = useState(getUserToken().email);

  // 검색 옵션
  const [filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [searchType, setSearchType] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchIp, setSearchIp] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const [showUser, setShowUser] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchData = (page) => {
    callApi(
      config.mm_api.path.list,
      config.mm_api.method.GET,
      { filter, page, pageSize }
    );
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.totalPages);
    }
  }, [data]);

  // useEffect(() => {
  //   fetchData();
  // }, [type, status, comparison]);

  useEffect(() => {
    // console.log(currentPage)
    fetchData(currentPage);
  }, [currentPage, filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);

    // const statusBool = status === 'true' ? true : status === 'false' ? false : '';
    // const durationFilter = duration
    //   ? { [`$${comparison}`]: parseFloat(duration) }
    //   : { $exists: true };

    setFilter({
      AlarmType: {
        $regex: searchType,
        $options: "i"
      },
      // name: {
      //   $regex: name,
      //   $options: "i"
      // },
      // email: {
      //   $regex: email,
      //   $options: "i"
      // },
      // status: statusBool !== '' ? statusBool : { $exists: true },
      // duration: comparison ? durationFilter : { $exists: true },
    });
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserShow = (log) => {
    // console.log('Selected log:', log); // 디버깅을 위해 로그를 출력합니다.
    setSelectedLog(log);
    setShowUser(true);
  }

  const handleUserClose = () => {
    setShowUser(false);
    setSelectedLog(null);
  }

  const handlePayloadShow = (log) => {
    // console.log('Selected log:', log); // 디버깅을 위해 로그를 출력합니다.
    setSelectedLog(log);
    setShowPayload(true);
  }

  const handlePayloadClose = () => {
    setShowPayload(false);
    setSelectedLog(null);
  }

  const handleOptionsShow = (log) => {
    // console.log('Selected log:', log); // 디버깅을 위해 로그를 출력합니다.
    setSelectedLog(log);
    setShowOptions(true);
  }

  const handleOptionsClose = () => {
    setShowOptions(false);
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
      <h1 className={`header-title ${textColorClass}`}>Monitor</h1>
      <p className={`header-description ${textColorClass}`}>Here you can view Managed monitoring.</p>

      <Row>
        <p className={`header-description ${textColorClass}`}><strong>Search Options</strong></p>
      </Row>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Row>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Worker</InputGroup.Text>
              <Form.Control
                type="text"
                value={name}
                readOnly
                disabled
                required
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Email</InputGroup.Text>
              <Form.Control
                type="text"
                value={email}
                readOnly
                disabled
                required
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
          <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                <InputGroup.Text>Type</InputGroup.Text>
                <Form.Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  {/* resorce, url, port, data_gathering, erp, unknown */}
                  <option value=''>- ALL</option>
                  <option value='resorce'>Resorce</option>
                  <option value='url'>URL</option>
                  <option value='port'>Port</option>
                  <option value='data_gathering'>데이터수집</option>
                  <option value='erp'>ERP</option>
                  <option value='unknown'>Unknown</option>
                </Form.Select>
              </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>IP</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter IP"
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Name</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter Worker Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Company</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter Company"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Status</InputGroup.Text>
              <Form.Select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">- All</option>
                <option value="-1">조치 전</option>
                <option value="0">조치 완료</option>
                <option value="1">조치 중</option>
              </Form.Select>
            </InputGroup>

          </Col>
          <Col>
            <Button className="w-100" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Search'}
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" className="mt-3" />
      ) : data ? (
        data.data.data !== null ? (
          <>
            <Row>
              <p className={`header-description ${textColorClass}`}><strong>History</strong></p>
            </Row>
            <Table striped bordered hover className="mt-3" variant={`${theme}`}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Type</th>
                  <th style={{ textAlign: 'center' }}>Worker</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Duration</th>
                  <th style={{ textAlign: 'center' }}>Timestamp</th>
                  <th style={{ textAlign: 'center' }}>Options</th>
                  <th style={{ textAlign: 'center' }}>Payload</th>
                </tr>
              </thead>
              <tbody>
                {data.data.data.map((log) => (
                  <React.Fragment key={log.ID}>
                    <tr>
                      <td style={{ textAlign: 'center' }}>{log.Type}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button variant="link" onClick={() => handleUserShow(log)}>
                          {log.Name}
                        </Button>
                        {/* {log.Name} */}
                      </td>
                      <td style={{ textAlign: 'center' }}>{log.Status ? '🟢' : '🔴'}</td>
                      <td style={{ textAlign: 'center' }}>{log.Duration} s</td>
                      <td style={{ textAlign: 'center' }}>{new Date(log.Timestamp * 1000).toLocaleString()}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button variant="link" onClick={() => handleOptionsShow(log)}>
                          <i className="bi bi-info-circle-fill"></i>
                        </Button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Button variant="link" onClick={() => handlePayloadShow(log)}>
                          <i className="bi bi-info-circle-fill"></i>
                        </Button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
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
        ) : (
          <Alert key="warning" variant="warning">
            No logs available.
          </Alert>
        )
      ) : (
        <Alert key="warning" variant="warning">
          No data available.
        </Alert>
      )}

      <Modal show={showUser} onHide={handleUserClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog ? (
            <>
              <p>Email: {selectedLog.Email}</p>
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUserClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPayload} onHide={handlePayloadClose}>
        <Modal.Header closeButton>
          <Modal.Title>Log Details-Payload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog ? (
            <>
              {/* 추가 정보가 있다면 여기에 추가 */}
              <pre>{selectedLog.Payload}</pre>
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePayloadClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOptions} onHide={handleOptionsClose}>
        <Modal.Header closeButton>
          <Modal.Title>Log Details-Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog ? (
            <>
              {Object.entries(selectedLog.Options).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
              {Object.entries(selectedLog.IPs).map(([key, value]) => (
                <p key={key}><strong>IP {key}:</strong> {value}</p>
              ))}
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOptionsClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Monitor;


