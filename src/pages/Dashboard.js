import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Row, Col, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import config from '../config';
import useApi from '../hooks/useApi';
import { getChartData } from "../utils/chartUtils";
import { useTheme } from '../ThemeContext';
import { translateManageType } from '../utils/utils';


const Dashboard = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const [fetchStartDate, setFetchStartDate] = useState(new Date());
  const [fetchEndDate, setFetchEndDate] = useState(new Date());

  return (
    <>
      <h1 className={`header-title ${textColorClass}`}>Dashboard</h1>
      <p className={`header-description ${textColorClass}`}>Here you can monitor the overall activity of the API.</p>
      <hr />
      <Row xs="auto">
        <Col>
          <h3 className={`header-title ${textColorClass}`}>Date</h3>
        </Col>
        <Col>
          <DatePicker
            selected={fetchStartDate}
            dateFormat="yyyy-MM-dd"
            onChange={(date) => setFetchStartDate(date)}
            className="form-control"
          />
        </Col>
        <Col>
          <h3 className={`header-title ${textColorClass}`}>~</h3>
        </Col>
        <Col>
          <DatePicker
            selected={fetchEndDate}
            dateFormat="yyyy-MM-dd"
            onChange={(date) => setFetchEndDate(date)}
            className="form-control"
          />
        </Col>
      </Row>
      <Monitoring start={fetchStartDate} end={fetchEndDate} />
      <Manage start={fetchStartDate} end={fetchEndDate} />
    </>

  );
};

export default Dashboard;


const Monitoring = ({ start, end }) => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { data, loading, error, callApi } = useApi(config.mm_api.baseUrl)
  // monitoring dashboard
  const [byAlarmType, setByAlarmType] = useState([]);
  const [byCompany, setByCompany] = useState([]);
  const [byIP, setByIP] = useState([]);

  const [chartByAlarmType, setChartByAlarmType] = useState(null);
  const [chartByCompany, setChartByCompany] = useState(null);
  const [chartByIP, setChartByIP] = useState(null);

  useEffect(() => {
    callApi(config.mm_api.path.dashboard, config.mm_api.method.POST, { start, end });
  }, [start, end])

  useEffect(() => {
    if (data && data.data && data.data.overall !== null) {
      const a = data.data.byAlarmType
      const c = data.data.byCompany
      const i = data.data.byIP

      setByAlarmType(a)
      setByCompany(c)
      setByIP(i)

      if (a.length !== 0) {
        setChartByAlarmType(
          getChartData(
            a.map((item) => item._id),
            a.map((item) => item.totalCount)
          )
        )
      }
      //       if (c.length !== 0) {
      //         setChartByCompany(
      //           getChartData(
      //             c.map((item) => item._id === null ? item._id = "Unkown" : item._id), // null 값은 에러를 발생시키므로 기본값을 할당한다.
      //             c.map((item) => item.totalCount)
      //           )
      //         )
      //       }
      if (c.length !== 0) {
        const removeNullArray = c.filter((e) => e._id !== null && e._id !== "")
        setChartByCompany(
          getChartData(
            removeNullArray.map((item) => item._id),
            removeNullArray.map((item) => item.totalCount)
          )
        )
      }
      if (i.length !== 0) {
        setChartByIP(
          getChartData(
            i.map((item) => item._id),
            i.map((item) => item.totalCount)
          )
        )
      }
    }
  }, [data])


  return (
    <>
      {/* managed monitoring dashboard */}
      {/* 데이터 로딩 중에 스피너 표시 */}
      {loading && <Spinner animation="border" />}

      {/* 에러 발생 시 에러 메시지 표시 */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* 데이터가 있는 경우 차트 및 테이블 표시 */}
      {chartByAlarmType && chartByCompany && chartByIP ? (
        <>
          <h3 className={`header-title ${textColorClass}`}>모니터링 Dashboard</h3>
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>Monitoring by Alarm Type</Card.Header>
                <Card.Body>
                  {chartByAlarmType && (
                    <Bar data={chartByAlarmType} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>Monitoring by Company (without Null.)</Card.Header>
                <Card.Body>
                  {chartByCompany && (
                    <Bar data={chartByCompany} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>Monitoring by IP</Card.Header>
                <Card.Body>
                  {chartByIP && (
                    <Bar data={chartByIP} />
                  )}
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
    </>
  )
}

const Manage = ({ start, end }) => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { data, loading, error, callApi } = useApi()
  // work request dashboard
  const [overall, setOverall] = useState([]);
  const [types, setTypes] = useState([]);

  const [chartTotalCount, setChartTotalCount] = useState(null)
  const [chartTotalDuration, setChartTotalDuration] = useState(null);
  const [chartBarData, setChartBarData] = useState(null)

  useEffect(() => {
    callApi(config.api.path.dashboard, config.api.method.POST, { start, end });
  }, [start, end])

  useEffect(() => {
    if (data && data.data && data.data.overall !== null) {
      const o = data.data.overall[0];
      const t = data.data.types;

      setOverall(o)
      setTypes(t)

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
          t.map((item) => translateManageType(item._id)),
          t.map((item) => item.totalCount)
        )
      );
    }
  }, [data]);


  return (
    <>
      <h3 className={`header-title ${textColorClass}`}>자동화 Dashboard</h3>
      {/* work request dashboard */}
      {/* 데이터 로딩 중에 스피너 표시 */}
      {loading && <Spinner animation="border" />}

      {/* 에러 발생 시 에러 메시지 표시 */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* 데이터가 있는 경우 차트 및 테이블 표시 */}
      {chartTotalCount && chartTotalDuration && chartBarData ? (
        <>
          <Row xs="auto">
            <Col>
              <Card style={{ width: '20rem' }} className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>Total Count</Card.Header>
                <Card.Body>
                  <Card.Title className={`${textColorClass}`}>{overall.totalCount} ea</Card.Title>
                  {chartTotalCount ? (
                    <Doughnut data={chartTotalCount} options={config.chart.doughnutOptions} />
                  ) : (
                    !loading && <Alert variant='warning'>No data available.</Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: '20rem' }} className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>Total Duration</Card.Header>
                <Card.Body>
                  <Card.Title className={`${textColorClass}`}>{overall.totalDuration} s</Card.Title>
                  {chartTotalDuration ? (
                    <Doughnut data={chartTotalDuration} options={config.chart.doughnutOptions} />
                  ) : (
                    !loading && <Alert variant='warning'>No data available.</Alert>
                  )}
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
                  {chartBarData ? (
                    <Bar data={chartBarData} />
                  ) : (
                    !loading && <Alert variant='warning'>No data available.</Alert>
                  )}
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
                        <td style={{ textAlign: 'center' }}>{translateManageType(type._id)}</td>
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
  )
}
