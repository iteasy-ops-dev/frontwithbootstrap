import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Stack, Card, Table, Alert } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';

const Dashboard = () => {
  const { data, loading, error, callApi } = useApi();
  const [overall, setOverall] = useState()
  const [types, setTypes] = useState()

  useEffect(() => {
    callApi(
      config.api.path.dashboad,
      config.api.method.GET,
    )
  }, []);

  useEffect(() => {
    if (data && data.data) {
      setOverall(data.data.overall[0]);
      setTypes(data.data.types);
    }
  }, [data]);

  return (
    <>
      <h1 className="header-title">Dashboard</h1>
      <p className="header-description">Welcome to the ITEASY Service Ops Center Platform.</p>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {overall && (
        <>
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>Total</Card.Header>
                <Card.Body>
                  <Stack gap={3}>
                    {[
                      `Count: ${overall.totalCount}`,
                      `Duration: ${overall.totalDuration}`
                    ].map((item, index) => (
                      <Card key={index} className="p-3">
                        <Card.Body>{item}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>Success</Card.Header>
                <Card.Body>
                  <Stack gap={3}>
                    {[
                      `Count: ${overall.successCount}`,
                      `Duration: ${overall.successDuration}`
                    ].map((item, index) => (
                      <Card key={index} className="p-3">
                        <Card.Body>{item}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>Failure</Card.Header>
                <Card.Body>
                  <Stack gap={3}>
                    {[
                      `Count: ${overall.failureCount}`,
                      `Duration: ${overall.failureDuration}`
                    ].map((item, index) => (
                      <Card key={index} className="p-3">
                        <Card.Body>{item}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      {types && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Run Type</th>
              <th style={{ textAlign: 'center' }}>Total Count</th>
              <th style={{ textAlign: 'center' }}>Total Duration</th>
              <th style={{ textAlign: 'center' }}>Success Count</th>
              <th style={{ textAlign: 'center' }}>Success Duration</th>
              <th style={{ textAlign: 'center' }}>Failure Count</th>
              <th style={{ textAlign: 'center' }}>Failure Duration</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type._id}>
                <td style={{ textAlign: 'center' }}>{type._id}</td>
                <td style={{ textAlign: 'center' }}>{type.totalCount}</td>
                <td style={{ textAlign: 'center' }}>{type.totalDuration}</td>
                <td style={{ textAlign: 'center' }}>{type.successCount}</td>
                <td style={{ textAlign: 'center' }}>{type.successDuration}</td>
                <td style={{ textAlign: 'center' }}>{type.failureCount}</td>
                <td style={{ textAlign: 'center' }}>{type.failureDuration}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default Dashboard;

