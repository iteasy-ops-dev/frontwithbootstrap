import React, { useState, useEffect } from 'react';
import { Table, Alert, Button, Spinner, Form, Modal } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';

const Log = () => {
  const { data, loading, error, callApi } = useApi();
  const { functions } = useAuth();

  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [ips, setIps] = useState('');
  // const [account, setAccount] = useState('');
  const [status, setStatus] = useState('');
  const [duration, setDuration] = useState('');
  const [comparison, setComparison] = useState('');

  const [showPayload, setShowPayload] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchData = () => {
    callApi(
      config.api.path.logs,
      config.api.method.GET,
      null,
      null,
      { type, name, status, duration, comparison, ips } // account 삭제
    );
  }

  useEffect(() => {
    fetchData();
  }, [type, status, comparison]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchData();
  }

  const handlePayloadShow = (log) => {
    console.log('Selected log:', log); // 디버깅을 위해 로그를 출력합니다.
    setSelectedLog(log);
    setShowPayload(true);
  }

  const handlePayloadClose = () => {
    setShowPayload(false);
    setSelectedLog(null);
  }

  const handleOptionsShow = (log) => {
    console.log('Selected log:', log); // 디버깅을 위해 로그를 출력합니다.
    setSelectedLog(log);
    setShowOptions(true);
  }

  const handleOptionsClose = () => {
    setShowOptions(false);
    setSelectedLog(null);
  }

  return (
    <>
      <h1 className="my-4">Logs</h1>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group>
          <Form.Label>Type</Form.Label>
          <Form.Select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value=''>All</option>
            {functions && functions.data.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Worker</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Worker"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>IPs</Form.Label>
          <Form.Control
            as="textarea"
            value={ips}

            placeholder='ex) 192.168.0.1, 192.168.0.2:2222'
            onChange={(e) => setIps(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="true">성공</option>
            <option value="false">실패</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Duration</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Comparison</Form.Label>
          <Form.Select
            value={comparison}
            onChange={(e) => setComparison(e.target.value)}
          >
            <option value="">All</option>
            <option value="gt">Greater than</option>
            <option value="lt">Less than</option>
            <option value="gte">Greater than or equal to</option>
            <option value="lte">Less than or equal to</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Search'}
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {data && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Type</th>
              <th>Worker</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Timestamp</th>
              <th>Options</th>
              <th>Payload</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((log) => (
              <React.Fragment key={log.ID}>
                <tr>
                  <td>{log.Type}</td>
                  <td>{log.Name}</td>
                  <td>{log.Status ? '🟢' : '🔴'}</td>
                  <td>{log.Duration} s</td>
                  <td>{new Date(log.Timestamp * 1000).toLocaleString()}</td>
                  <td>
                    <Button variant="link" onClick={() => handleOptionsShow(log)}>
                      ⚙️
                    </Button>
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handlePayloadShow(log)}>
                      📝
                    </Button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
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

export default Log;
