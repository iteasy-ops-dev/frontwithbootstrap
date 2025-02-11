import React, { useEffect, useState } from "react";
import { Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import config from "../../config";
import useApi from "../../hooks/useApi";
import { generateChartData } from "../../utils/chartUtils";
import { useTheme } from "../../ThemeContext";

const WorkHistoryMonitor = ({ start, end }) => {
  const { theme } = useTheme();
  const textColorClass = theme === "light" ? "text-dark" : "text-light";

  const { data, loading, error, callApi } = useApi(config.whm_api.baseUrl);

  const [chartOverall, setChartOverall] = useState(null);
  const [chartDaily, setChartDaily] = useState(null);
  const [chartCompany, setChartCompany] = useState(null);

  useEffect(() => {
    callApi(config.whm_api.path.dashboard, config.whm_api.method.POST, {
      start,
      end,
    });
  }, [start, end]);
  useEffect(() => {
    if (data && data.data && data.data.overall !== null) {
      const o = data.data.overall;
      const d = data.data.daily;
      const c = data.data.company;

      setChartOverall(generateChartData(o));
      setChartDaily(generateChartData(d));
      setChartCompany(generateChartData(c));
    }
  }, [data]);

  return (
    <>
      <p className={`header-description ${textColorClass}`}>
        <strong>작업의뢰 지연 모니터링</strong>
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
      {chartOverall ? (
        <>
          <Row>
            <Col>
              <Card
                style={{ width: "25rem" }}
                className={`text-center bg-${theme}`}
              >
                <Card.Header className={`${textColorClass}`}>
                  Overall
                </Card.Header>
                <Card.Body>
                  {chartOverall && <Doughnut data={chartOverall} />}
                </Card.Body>
              </Card>
            </Col>
            <Col></Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>
                  Company Count
                </Card.Header>
                <Card.Body>
                  {chartCompany ? (
                    <Bar data={chartCompany} />
                  ) : (
                    !loading && (
                      <Alert variant="warning">No data available.</Alert>
                    )
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className={`text-center bg-${theme}`}>
                <Card.Header className={`${textColorClass}`}>
                  Delay Daily Count
                </Card.Header>
                <Card.Body>
                  {chartDaily && <Line data={chartDaily} />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        !loading &&
        !error && <Alert variant="warning">No Data available.</Alert>
      )}
    </>
  );
};

export default WorkHistoryMonitor;