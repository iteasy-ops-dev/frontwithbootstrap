import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import config from '../config';
import useApi from '../hooks/useApi';
import { getChartData } from "../utils/chartUtils";
import { useTheme } from '../ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { data, loading, error, callApi } = useApi();
  const [overall, setOverall] = useState();
  const [types, setTypes] = useState();

  const [chartTotalCount, setChartTotalCount] = useState({});
  const [chartTotalDuration, setChartTotalDuration] = useState({});
  const [chartBarData, setChartBarData] = useState({});

  useEffect(() => {
    callApi(config.api.path.dashboad, config.api.method.GET);
  }, []);

  useEffect(() => {
    if (data && data.data && data.data.overall !== null) {
      setOverall(data.data.overall[0]);
      setTypes(data.data.types);

      const o = data.data.overall[0];
      const t = data.data.types;

      setChartTotalCount(
        getChartData(
          ['Success Count', 'Failure Count'],
          [o.successCount, o.failureCount]
        )
      );

      setChartTotalDuration(
        getChartData(
          ['Success Duration', 'Failure Duration'],
          [o.successDuration, o.failureDuration]
        )
      );

      setChartBarData(
        getChartData(
          t.map((item) => item._id),
          t.map((item) => item.totalCount)
        )
      );
    }
  }, [data]);

  return (
    <>
      <h1 className={`header-title ${textColorClass}`}>Dashboard</h1>
      <p className={`header-description ${textColorClass}`}>Here you can monitor the overall activity of the API.</p>

      {/* 데이터 로딩 중에 스피너 표시 */}
      {loading && <Spinner animation="border" />}

      {/* 에러 발생 시 에러 메시지 표시 */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* 데이터가 있는 경우 차트 및 테이블 표시 */}
      {data && overall ? (
        <>
          <Row>
            <Col>
              {/* <Card className="text-center"> */}
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>Total Count</Card.Header>
                <Card.Body>
                  <Card.Title className={`${textColorClass}`}>{overall.totalCount} ea</Card.Title>
                  <Doughnut data={chartTotalCount} options={config.chart.doughnutOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>Total Duration</Card.Header>
                <Card.Body>
                  <Card.Title className={`${textColorClass}`}>{overall.totalDuration} s</Card.Title>
                  <Doughnut data={chartTotalDuration} options={config.chart.doughnutOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>API calls by type</Card.Header>
                <Card.Body>
                  <Bar data={chartBarData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
        </>
      ) : (
        !loading && !error && (
          <Alert variant="warning">
            No Overall available.
          </Alert>
        )
      )}

      {/* 데이터가 있는 경우 상세 테이블 표시 */}
      {data && types ? (
        <Row>
          <Col>
            <Card className={`text-center bg-${theme}`}>
              <Card.Header className={`${textColorClass}`}>Detailed information by API type</Card.Header>
              <Card.Body>
                <Table striped bordered hover className="mt-3" variant={`${theme}`}>
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
                        <td style={{ textAlign: 'center' }}>{(type._id)}</td>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        !loading && !error && (
          <Alert variant="warning">
            No Types available.
          </Alert>
        )
      )}
    </>
  );
};

export default Dashboard;
