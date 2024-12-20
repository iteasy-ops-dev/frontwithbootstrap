import React, { useState, useEffect } from 'react';
import { OverlayTrigger, InputGroup, Table, Alert, Button, Spinner, Form, Modal, Row, Col, Pagination, Tooltip } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { translateMonitorAlarmType, viewMonitorDetail, viewUnixtime, translateMonitorCurrentStatus } from "../utils/utils";


const Monitor = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const listApi = useApi(config.mm_api.baseUrl);
  const startApi = useApi(config.mm_api.baseUrl);
  const updateStatusApi = useApi(config.mm_api.baseUrl);
  const finishApi = useApi(config.mm_api.baseUrl);
  const connectApi = useApi(config.mm_api.baseUrl);
  const { getUserToken } = useAuth();

  const [name] = useState(getUserToken().name);
  const [email] = useState(getUserToken().email);

  // 검색 옵션
  // const [filter, setFilter] = useState({ CurrentStatus: -1 }); // 조치 전 기본값
  const [filter, setFilter] = useState(); // 조치 전 기본값
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [searchType, setSearchType] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchIp, setSearchIp] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchStatus, setSearchStatus] = useState('-1');

  const [showDetail, setshowDetail] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const [actionDetail, setActionDetail] = useState("")
  const [checkDetail, setCheckDetail] = useState("")
  // const [isStartDisabled, setIsStartDisabled] = useState(false);
  const [isProcessingDisabled, setIsProcessingDisabled] = useState(false);
  const [isFinishDisabled, setIsFinishDisabled] = useState(true);

  const [selectAll, setSelectAll] = useState(false); // 상위 체크박스 상태
  const [objectIDs, setObjectIDs] = useState([]); // 선택된 로그 상태
  const [setStatus, setSetStatus] = useState("")

  // 상위 체크박스 클릭 시 하위 체크박스들 모두 선택/해제
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      // 모든 로그를 선택
      setObjectIDs(listApi.data.data.data.map(log => log.ID));
    } else {
      // 모든 로그 선택 해제
      setObjectIDs([]);
    }
  };

  // 각 체크박스 클릭 시 해당 로그 선택/해제
  const handleSelectLog = (logId) => {
    setObjectIDs((prevSelectedLogs) => {
      if (prevSelectedLogs.includes(logId)) {
        // 이미 선택된 로그라면 제거
        return prevSelectedLogs.filter(id => id !== logId);
      } else {
        // 선택되지 않은 로그라면 추가
        return [...prevSelectedLogs, logId];
      }
    });
  };

  const fetchData = (page) => {
    listApi.callApi(
      config.mm_api.path.list,
      config.mm_api.method.POST,
      { filter, page, pageSize }
    );
  };

  useEffect(() => {
    if (listApi.data) {
      setTotalPages(listApi.data.data.totalPages);
    }
  }, [listApi.data]);

  useEffect(() => {
    if (selectedLog) {
      setCheckDetail(selectedLog.CheckDetails || ""); // CheckDetails 값을 초기화
      setActionDetail(selectedLog.ActionDetails || ""); // ActionDetails 값 초기화
      // 초기 버튼 상태 설정
      // setIsStartDisabled(selectedLog.CurrentStatus !== -1);
      if (selectedLog.CurrentStatus === 100) {
        setIsFinishDisabled(true)
        setIsProcessingDisabled(true)
      } else {
        setIsFinishDisabled(selectedLog.CurrentStatus !== 0);
        setIsProcessingDisabled(selectedLog.CurrentStatus === -1 || selectedLog.CurrentStatus === 1);
      }
    }
  }, [selectedLog]);

  useEffect(() => {
    console.log(objectIDs)
    if (objectIDs.length === 2) {
      setShowConnect(true)
    } else {
      setShowConnect(false)
    }
    console.log(showConnect)
  }, [objectIDs])

  // useEffect(() => {
  //   fetchData();
  // }, [type, status, comparison]);

  useEffect(() => {
    // console.log(currentPage)
    fetchData(currentPage);
    setSelectAll(false)
    setObjectIDs([])
  }, [currentPage, filter, showDetail, updateStatusApi.data, connectApi.data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);

    const filter = {};

    // Dynamic filter conditions
    if (searchType) filter.AlarmType = { $regex: searchType };
    if (searchStatus !== "") filter.CurrentStatus = parseInt(searchStatus);
    if (searchIp) filter.Ip = { $regex: searchIp, $options: "i" };
    if (searchCompany) filter.Company = { $regex: searchCompany, $options: "i" };
    if (searchName) filter.AssignedTo = { $regex: searchName, $options: "i" };

    setFilter(filter);
  }

  const handleToNormalization = () => {
    if (objectIDs.length === 0) {
      alert("체크된 알람이 없습니다.")
      return;
    }

    let s = ""
    switch (setStatus) {
      case "-1":
        s = "조치 전"
        break;
      case "0":
        s = "조치 중"
        break;
      case "1":
        s = "조치 완료"
        break;
      case "100":
        s = "자동 정상화"
        break;

      default:
        break;
    }
    if (!window.confirm(`선택된 알람이 ${s} 상태로 변경됩니다. 계속하시겠습니까?`)) {
      return;
    }
    updateStatusApi.callApi(
      config.mm_api.path.updateStatus,
      config.mm_api.method.POST,
      {
        ObjectIDs: objectIDs,
        Worker: name,
        Status: parseInt(setStatus)
      }
    )
  }

  const handleConnectAlarm = () => {
    if (objectIDs.length !== 2) {
      alert("반드시 두개만 체크하세요.")
      return;
    }

    if (!window.confirm("선택된 두개의 내역이 연결됩니다.")) {
      return;
    }

    connectApi.callApi(
      config.mm_api.path.connect,
      config.mm_api.method.POST,
      {
        ObjectIDs: objectIDs,
        Worker: name,
      }
    )

    setShowConnect(false)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDetailShow = (log) => {
    // console.log('Selected log:', log); // 디버깅을 위해 로그를 출력합니다.
    setSelectedLog(log);
    setshowDetail(true);
  }

  const handleDetailClose = () => {
    setshowDetail(false);
    setSelectedLog(null);
  }

  const handleConnectClose = () => {
    setShowConnect(false)
  }

  const actionStart = (id) => {
    startApi.callApi(
      config.mm_api.path.start,
      config.mm_api.method.POST,
      { ObjectID: id, Worker: name }
    )
    // setIsStartDisabled(true); // 조치 시작 버튼 비활성화
    setIsFinishDisabled(false); // 조치 완료 버튼 활성화
    setIsProcessingDisabled(false)
  }

  const actionFinish = (id) => {
    finishApi.callApi(
      config.mm_api.path.done,
      config.mm_api.method.POST,
      { ObjectID: id, CheckDetails: checkDetail, ActionDetails: actionDetail }
    )
    setIsFinishDisabled(true); // 조치 완료 버튼 비활성화
    setIsProcessingDisabled(true)
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
                {/* resource, url, port, data_gathering, erp, unknown */}
                <option value=''>- ALL</option>
                <option value='resource'>{translateMonitorAlarmType("resource")}</option>
                <option value='url'>{translateMonitorAlarmType("url")}</option>
                <option value='port'>{translateMonitorAlarmType("port")}</option>
                <option value='data_gathering'>{translateMonitorAlarmType("data_gathering")}</option>
                <option value='erp'>{translateMonitorAlarmType("erp")}</option>
                <option value='unknown'>{translateMonitorAlarmType("unknown")}</option>
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
                <option value="-1">{translateMonitorCurrentStatus(-1)} 조치 전</option>
                <option value="0">{translateMonitorCurrentStatus(0)} 조치 중</option>
                <option value="1">{translateMonitorCurrentStatus(1)} 조치 완료</option>
                <option value="100">{translateMonitorCurrentStatus(100)} 자동 정상화</option>
              </Form.Select>
            </InputGroup>
          </Col>
          <Col>
            <Button className="w-100" variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} type="submit" disabled={listApi.loading}>
              {listApi.loading ? <Spinner as="span" animation="border" size="sm" /> : 'Search'}
            </Button>
          </Col>
        </Row>
      </Form>

      {listApi.error && <Alert variant="danger" className="mt-3">{listApi.error}</Alert>}

      {listApi.loading ? (
        <Spinner animation="border" className="mt-3" />
      ) : listApi.data ? (
        listApi.data.data.data !== null ? (
          <>
            <Row>
              <Col>
                <p className={`header-description ${textColorClass}`}><strong>Monitoring List</strong></p>
              </Col>
              <Col>
                <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                  <InputGroup.Text>체크된 알림을</InputGroup.Text>
                  <Form.Select
                    value={setStatus}
                    onChange={(e) => setSetStatus(e.target.value)}
                  >
                    <option value="-1">{translateMonitorCurrentStatus(-1)} 조치 전</option>
                    <option value="0">{translateMonitorCurrentStatus(0)} 조치 중</option>
                    <option value="1">{translateMonitorCurrentStatus(1)} 조치 완료</option>
                    <option value="100">{translateMonitorCurrentStatus(100)} 자동 정상화</option>
                  </Form.Select>
                  <Button variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} onClick={handleToNormalization}>
                    (으)로 변경하기
                  </Button>
                  <Button variant={`outline-${theme === 'light' ? 'dark' : 'light'}`} onClick={handleConnectAlarm} disabled={!showConnect}>
                    병합하기
                  </Button>
                </InputGroup>
              </Col>
            </Row>
            <Table striped bordered hover className="mt-3" variant={`${theme}`}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>
                    <>
                      <Form.Check
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </>
                  </th>
                  <th style={{ textAlign: 'center' }}>발생시간</th>
                  <th style={{ textAlign: 'center' }}>상태</th>
                  <th style={{ textAlign: 'center' }}>타입</th>
                  <th style={{ textAlign: 'center' }}>조치시작</th>
                  <th style={{ textAlign: 'center' }}>조치완료</th>
                  <th style={{ textAlign: 'center' }}>담당자</th>
                  <th style={{ textAlign: 'center' }}>IP</th>
                  <th style={{ textAlign: 'center' }}>고객</th>
                  <th style={{ textAlign: 'center' }}>상세내용</th>
                </tr>
              </thead>
              <tbody>
                {listApi.data.data.data.map((log) => (
                  <React.Fragment key={log.ID}>
                    <tr>
                      <td style={{ textAlign: 'center' }}>
                        <Form.Check
                          type="checkbox"
                          checked={objectIDs.includes(log.ID)}
                          onChange={() => handleSelectLog(log.ID)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>{viewUnixtime(log.CreatedAt)}</td>
                      <td style={{ textAlign: 'center' }}>{translateMonitorCurrentStatus(log.CurrentStatus)}</td>
                      <td style={{ textAlign: 'center' }}>{translateMonitorAlarmType(log.AlarmType)}</td>
                      <td style={{ textAlign: 'center' }}>{log.ActionStartTime !== 0 ? viewUnixtime(log.ActionStartTime) : "-"}</td>
                      <td style={{ textAlign: 'center' }}>{log.ActionFinishTime !== 0 ? viewUnixtime(log.ActionFinishTime) : "-"}</td>
                      <td style={{ textAlign: 'center' }}>{log.AssignedTo === "" ? "-" : log.AssignedTo}</td>
                      <td style={{ textAlign: 'center' }}>{log.Ip}</td>
                      <td style={{ textAlign: 'center' }}>{log.Company !== "" ? log.Company : "-"}</td>
                      <td style={{ textAlign: 'center' }}>

                        <OverlayTrigger
                          placement="left"
                          overlay={
                            <Tooltip id="button-tooltip">
                              <hr />{log.Message}<hr />
                              {log.CheckDetails == "" || log.CheckDetails == undefined ? "" : <> {log.CheckDetails}<hr /></>}
                              {log.ActionDetails == "" || log.ActionDetails == undefined ? "" : <>{log.ActionDetails}<hr /></>}
                            </Tooltip>}
                        >
                          <Button variant="link" onClick={() => handleDetailShow(log)}>
                            <i className="bi bi-info-square-fill"></i>
                          </Button>

                        </OverlayTrigger>
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

      <Modal size="lg" show={showDetail} onHide={handleDetailClose}>
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        {selectedLog ? (
          <>
            <Modal.Body>
              <strong>내용</strong>
              <pre>
                {selectedLog.Message}<br />
                {viewMonitorDetail(selectedLog)}
              </pre>
              <Form.Group>
                <Form.Label><strong>원인 내용</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  value={checkDetail}
                  disabled={isProcessingDisabled}
                  placeholder="원인을 작성합니다."
                  onChange={(e) => setCheckDetail(e.target.value)}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label><strong>조치 내용</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  value={actionDetail}
                  disabled={isProcessingDisabled}
                  placeholder="조치 내용을 작성합니다."
                  onChange={(e) => setActionDetail(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => actionStart(selectedLog.ID)} disabled={!isFinishDisabled}>
                조치 시작
              </Button>
              <Button variant="success" onClick={() => actionFinish(selectedLog.ID)} disabled={isFinishDisabled}>
                조치 완료
              </Button>
              <Button variant="secondary" onClick={handleDetailClose}>
                닫기 (ESC)
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <Spinner animation="border" />
        )}
      </Modal>
    </>
  );
};

export default Monitor;


//       <Modal size='md' show={showConnect} onHide={handleConnectClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Alert</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <strong>두개를 병합하시겠습니까?</strong>
//           {objectIDs}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant='primary' onClick={handleConnectAlarm}>병합</Button>
//           <Button variant="secondary" onClick={handleConnectClose}>닫기 (ESC)</Button>
//         </Modal.Footer>
//       </Modal>
