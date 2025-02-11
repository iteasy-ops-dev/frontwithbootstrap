import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import config from "../../config";
import useApi from "../../hooks/useApi";
import { getChartData } from "../../utils/chartUtils";
import { useTheme } from "../../ThemeContext";
import { translateManageType } from "../../utils/utils";

const Manage = ({ start, end }) => {
  const { theme } = useTheme();
  const textColorClass = theme === "light" ? "text-dark" : "text-light";

  const { data, loading, error, callApi } = useApi();
  // work request dashboard
  const [overall, setOverall] = useState([]);
  const [types, setTypes] = useState([]);

  const [chartTotalCount, setChartTotalCount] = useState(null);
  const [chartTotalDuration, setChartTotalDuration] = useState(null);
  const [chartBarData, setChartBarData] = useState(null);

  useEffect(() => {
    callApi(config.api.path.dashboard, config.api.method.POST, { start, end });
  }, [start, end]);

  useEffect(() => {
    if (data && data.data && data.data.overall !== null) {
      const o = data.data.overall[0];
      const t = data.data.types;

      setOverall(o);
      setTypes(t);

      setChartTotalCount(
        getChartData(
          ["Success Count", "Failure Count"],
          [o.successCount, o.failureCount]
        )
      );

      setChartTotalDuration(
        getChartData(
          ["Success Duration", "Failure Duration"],
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
      <p className={`header-description ${textColorClass}`}>
        <strong>자동화 통계</strong>
      </p>
      {/* work request dashboard */}
      {/* 데이터 로딩 중에 스피너 표시 */}
      {loading && <Spinner animation="border" />}

      {/* 에러 발생 시 에러 메시지 표시 */}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {/* 데이터가 있는 경우 차트 및 테이블 표시 */}
      {chartTotalCount && chartTotalDuration && chartBarData ? (
        <>
          <Row xs="auto">
            <Col>
              <Card
                style={{ width: "25rem" }}
                className={`text-center bg-${theme}`}
              >
                <Card.Header className={`${textColorClass}`}>
                  Total Count
                </Card.Header>
                <Card.Body>
                  <Card.Title className={`${textColorClass}`}>
                    {overall.totalCount} ea
                  </Card.Title>
                  {chartTotalCount ? (
                    <Doughnut
                      data={chartTotalCount}
                      options={config.chart.doughnutOptions}
                    />
                  ) : (
                    !loading && (
                      <Alert variant="warning">No data available.</Alert>
                    )
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{ width: "25rem" }}
                className={`text-center bg-${theme}`}
              >
                <Card.Header className={`${textColorClass}`}>
                  Total Duration
                </Card.Header>
                <Card.Body>
                  <Card.Title className={`${textColorClass}`}>
                    {overall.totalDuration} s
                  </Card.Title>
                  {chartTotalDuration ? (
                    <Doughnut
                      data={chartTotalDuration}
                      options={config.chart.doughnutOptions}
                    />
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
                  API calls by type
                </Card.Header>
                <Card.Body>
                  {chartBarData ? (
                    <Bar data={chartBarData} />
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
        </>
      ) : (
        !loading &&
        !error && <Alert variant="warning">No Data available.</Alert>
      )}

      {/* 데이터가 있는 경우 상세 테이블 표시 */}
      {data && types ? (
        <Row>
          <Col>
            <Card className={`text-center bg-${theme}`}>
              <Card.Header className={`${textColorClass}`}>
                Detailed information by API type
              </Card.Header>
              <Card.Body>
                <Table
                  striped
                  bordered
                  hover
                  className="mt-3"
                  variant={`${theme}`}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Run Type</th>
                      <th style={{ textAlign: "center" }}>Total Count</th>
                      <th style={{ textAlign: "center" }}>Total Duration</th>
                      <th style={{ textAlign: "center" }}>Success Count</th>
                      <th style={{ textAlign: "center" }}>Success Duration</th>
                      <th style={{ textAlign: "center" }}>Failure Count</th>
                      <th style={{ textAlign: "center" }}>Failure Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {types.map((type) => (
                      <tr key={type._id}>
                        <td style={{ textAlign: "center" }}>
                          {translateManageType(type._id)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {type.totalCount}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {type.totalDuration}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {type.successCount}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {type.successDuration}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {type.failureCount}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {type.failureDuration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        !loading &&
        !error && <Alert variant="warning">No Types available.</Alert>
      )}
    </>
  );
};

export default Manage;