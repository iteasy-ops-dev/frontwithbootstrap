import React, { useEffect, useState } from "react";
import { Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import config from "../../config";
import useApi from "../../hooks/useApi";
import { generateChartData } from "../../utils/chartUtils";
import { useTheme } from "../../ThemeContext";

const Monitoring = ({ start, end }) => {
  const { theme } = useTheme();
  const textColorClass = theme === "light" ? "text-dark" : "text-light";

  const { data, loading, error, callApi } = useApi(config.mm_api.baseUrl);

  const [chartOverall, setChartOverall] = useState(null);
  const [chartByAlarmType, setChartByAlarmType] = useState(null);
  const [chartByCompany, setChartByCompany] = useState(null);
  const [chartByIP, setChartByIP] = useState(null);
  const [chartDaily, setChartDaily] = useState(null);
  // const [chartDailyAlarmType, setChartDailyAlarmType] = useState(null);

  useEffect(() => {
    callApi(config.mm_api.path.dashboard, config.mm_api.method.POST, {
      start,
      end,
    });
  }, [start, end]);

  useEffect(() => {
    if (data && data.data && data.data.overall !== null) {
      const o = data.data.overall;
      const a = data.data.byAlarmType;
      const c = data.data.byCompany;
      const i = data.data.byIP;
      const d = data.data.daily;
      // const da = data.data.dailyAlarmType;

      setChartOverall(generateChartData(o));
      setChartByAlarmType(generateChartData(a));
      setChartByCompany(generateChartData(c));
      setChartByIP(generateChartData(i));
      setChartDaily(generateChartData(d));
      // setChartDailyAlarmType(generateChartData(da));
    }
  }, [data]);

  return (
    <>
      <p className={`header-description ${textColorClass}`}>
        <strong>매니지드 모니터링</strong>
      </p>
      {/* managed monitoring dashboard */}
      {/* 데이터 로딩 중에 스피너 표시 */}
      {loading && <Spinner animation="border" />}

      {/* 에러 발생 시 에러 메시지 표시 */}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {/* 데이터가 있는 경우 차트 및 테이블 표시 */}
      {chartByAlarmType && chartByCompany && chartByIP ? (
        <>
          <Row>
            <Col>
              <Card
                style={{ width: "25rem" }}
                className={`text-center bg-${theme}`}
              >
                <Card.Header className={`${textColorClass}`}>
                  Status
                </Card.Header>
                <Card.Body>
                  {chartOverall && <Doughnut data={chartOverall} />}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{ width: "25rem" }}
                className={`text-center bg-${theme}`}
              >
                <Card.Header className={`${textColorClass}`}>
                  Monitoring by Alarm Type
                </Card.Header>
                <Card.Body>
                  {chartByAlarmType && <Doughnut data={chartByAlarmType} />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>
                  Monitoring by Company (without Null.)
                </Card.Header>
                <Card.Body>
                  {chartByCompany && <Bar data={chartByCompany} />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>
                  Monitoring by IP
                </Card.Header>
                <Card.Body>{chartByIP && <Bar data={chartByIP} />}</Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>
                  Daily Count
                </Card.Header>
                <Card.Body>
                  {chartDaily && <Line data={chartDaily} />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          {/* <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>
                  Daily Count
                </Card.Header>
                <Card.Body>
                  {chartDailyAlarmType && <Line data={chartDailyAlarmType} />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br /> */}
        </>
      ) : (
        !loading &&
        !error && <Alert variant="warning">No Data available.</Alert>
      )}
    </>
  );
};

export default Monitoring;