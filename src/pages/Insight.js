import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Modal, InputGroup, Card, Table, Alert, Button, Spinner, Form, Row, Col, Pagination } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { validateUint } from "../utils/validators";
import { getChartData } from "../utils/chartUtils";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Insight = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { getUserToken } = useAuth();
  const isAdmin = getUserToken().email === config.admin;

  const [start_date, setStart_date] = useState(new Date());
  const [num_days, setNum_days] = useState(1);
  const [filter, setFilter] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const updateApi = useApi();
  const fetchApi = useApi();
  const dashboardApi = useApi();

  const [chartClientCompany, setChartClientCompany] = useState({});
  const [chartSubCategory, setChartSubCategory] = useState({});
  const [chartWorkRequestItems, setChartWorkRequestItems] = useState({});

  const [showDetails, setShowDetails] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const [loading, setLoading] = useState(true);

  // const [fetchStartDate, setFetchStartDate] = useState(new Date());
  // const [fetchEndDate, setFetchEndDate] = useState(new Date());
  const [company, setCompany] = useState("");

  const fetchDashboard = () => {
    dashboardApi.callApi(
      config.api.path.insight,
      config.api.method.POST,
      { filter }
    );
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboardApi.data && dashboardApi.data.data) {
      const {
        client_company,
        sub_category,
        work_request_items
      } = dashboardApi.data.data;

      if (client_company?.data && sub_category?.data && work_request_items?.data) {
        // item.count 필터링
        const filteredClientCompany = client_company.data.filter(item => item.count > 10);
        const filteredSubCategory = sub_category.data.filter(item => item.count > 1);
        const filteredWorkRequestItems = work_request_items.data.filter(item => item.count > 1);

        // 차트 데이터 설정
        setChartClientCompany(
          getChartData(
            filteredClientCompany.map((item) => item._id),
            filteredClientCompany.map((item) => item.count)
          )
        );
        setChartSubCategory(
          getChartData(
            filteredSubCategory.map((item) => item._id),
            filteredSubCategory.map((item) => item.count)
          )
        );
        setChartWorkRequestItems(
          getChartData(
            filteredWorkRequestItems.map((item) => item._id),
            filteredWorkRequestItems.map((item) => item.count)
          )
        );

        setLoading(false);
      }
    }
  }, [dashboardApi.data]);

  const fetchData = (page) => {
    fetchApi.callApi(
      config.api.path.get_work_history,
      config.api.method.POST,
      { filter, page, pageSize }
    );
  };

  useEffect(() => {
    if (fetchApi.data) {
      setTotalPages(fetchApi.data.data.totalPages);
    }
  }, [fetchApi]);

  useEffect(() => {
    fetchData(currentPage);
    fetchDashboard();
  }, [currentPage, filter]);

  const updateHistory = () => {
    updateApi.callApi(
      config.api.path.update_work_history,
      config.api.method.POST,
      { start_date: formatDate(start_date), num_days: parseInt(num_days, 10) },
    );
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    let v = validateUint(num_days);
    if (!v.status) {
      alert(v.message);
      return;
    }
    updateHistory();
    fetchData(currentPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDetailsShow = (log) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedLog(null);
  };

  const handleFetchSubmit = (e) => {
    e.preventDefault();

    setFilter({
      client_company: {
        $regex: company,
        $options: "i"
      },
      // registration_date: {
      //   $gte: `${formatDate(fetchStartDate)} 00:00`,
      //   $lte: `${formatDate(fetchEndDate)} 23:59`
      // }
    });
  };

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
      <h1 className={`header-title ${textColorClass}`}>Insight</h1>
      <p className={`header-description ${textColorClass}`}>Here you can get insights into your work requests.</p>
      {loading ? (
        <Spinner animation="border" className="mt-3" />
      ) : (
        dashboardApi.data && dashboardApi.data.data ? (
          <>
            <Row>
              <Col>
                <Card className={`text-center bg-${theme}`}>
                  <Card.Header className={`${textColorClass}`}>업체별 작업의뢰 건수 {">"} 10 </Card.Header>
                  <Card.Body>
                    <Bar data={chartClientCompany} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card className={`text-center bg-${theme}`}>
                  <Card.Header className={`${textColorClass}`}>작업의뢰항목별 작업의뢰 건수 {">"} 1</Card.Header>
                  <Card.Body>
                    <Bar data={chartWorkRequestItems} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card className={`text-center bg-${theme}`}>
                  <Card.Header className={`${textColorClass}`}>소분류별 작업의뢰 건수 {">"} 1 </Card.Header>
                  <Card.Body>
                    <Bar data={chartSubCategory} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Alert variant="warning">
            No Overall available.
          </Alert>
        )
      )}
      <Row>
        <p className={`header-description ${textColorClass}`}><strong>Update</strong></p>
      </Row>
      <Form onSubmit={handleUpdateSubmit} className="mb-3">
        <Row>
          <Col sm={6}>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Start Date</InputGroup.Text>
              <DatePicker
                selected={start_date}
                dateFormat="yyyy-MM-dd"
                onChange={(date) => setStart_date(date)}
                className="form-control"
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Range</InputGroup.Text>
              <Form.Control
                type="number"
                value={num_days}
                onChange={(e) => setNum_days(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col>
            <Button className="w-100" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} type="submit" disabled={updateApi.loading || !isAdmin}>
              {updateApi.loading ? <Spinner as="span" animation="border" size="sm" /> : 'Update'}
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <p className={`header-description ${textColorClass}`}><strong>Search</strong></p>
      </Row>
      <Form onSubmit={handleFetchSubmit} className="mb-3">
        <Row>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Company</InputGroup.Text>
              <Form.Control
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col sm={2}>
            <Button className="w-100" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} type="submit" disabled={fetchApi.loading}>
              {updateApi.loading ? <Spinner as="span" animation="border" size="sm" /> : 'Fetch'}
            </Button>
          </Col>
        </Row>
      </Form>

      {fetchApi.loading ? (
        <Spinner animation="border" className="mt-3" />
      ) : fetchApi.data && fetchApi.data.data ? (
        fetchApi.data.data.data !== null ? (
          <>
            <Row>
              <p className={`header-description ${textColorClass}`}><strong>History</strong></p>
            </Row>
            <Table striped bordered hover className="mt-3" variant={`${theme}`}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>등록일</th>
                  <th style={{ textAlign: 'center' }}>index</th>
                  <th style={{ textAlign: 'center' }}>작업의뢰항목</th>
                  <th style={{ textAlign: 'center' }}>소분류</th>
                  <th style={{ textAlign: 'center' }}>업체명</th>
                  <th style={{ textAlign: 'center' }}>브랜드</th>
                  <th style={{ textAlign: 'center' }}>추가정보</th>
                  <th style={{ textAlign: 'center' }}>바로가기</th>
                </tr>
              </thead>
              <tbody>
                {fetchApi.data.data.data.map((log) => (
                  <React.Fragment key={log.ID}>
                    <tr>
                      <td style={{ textAlign: 'center' }}>{log.RegistrationDate}</td>
                      <td style={{ textAlign: 'center' }}>{log.Index}</td>
                      <td style={{ textAlign: 'center' }}>{log.WorkRequestItems}</td>
                      <td style={{ textAlign: 'center' }}>{log.SubCategory}</td>
                      <td style={{ textAlign: 'center' }}>{log.ClientCompany}</td>
                      <td style={{ textAlign: 'center' }}>{log.Brand}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button variant="link" onClick={() => handleDetailsShow(log)}>
                          <i className="bi bi-ticket-detailed"></i>
                        </Button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <a href={`https://${log.Url}`} target="_blank" rel="noopener noreferrer">
                          <i className="bi bi-arrow-up-right-circle"></i>
                        </a>
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
          <Alert variant="warning">
            No records found.
          </Alert>
        )
      ) : (
        <Alert variant="warning">
          No records found.
        </Alert>
      )}

      <Modal show={showDetails} onHide={handleDetailsClose}>
        <Modal.Header closeButton>
          <Modal.Title>Work Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog ? (
            <>
              <p><strong>Content: </strong></p>
              <p>{selectedLog.WorkRequestDetails}</p>
              <p><strong>IP:</strong></p>
              <p>{selectedLog.IP}</p>
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDetailsClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Insight;
