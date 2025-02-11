import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Form, Row, Col } from "react-bootstrap";
import "chart.js/auto";
import { useTheme } from "../ThemeContext";


import WorkHistoryMonitor from "./dashboardSub/WorkHistory";
import Monitoring from "./dashboardSub/Monitoring";
import Manage from "./dashboardSub/Manage";

const DASHBOARD_TYPE = {
  MANAGED_MONITOR: "managed_monitor",
  MANAGE: "manage",
  WORKHISTORY_MONITOR: "workhistory_monitor",
};

const Dashboard = () => {
  const { theme } = useTheme();
  const textColorClass = theme === "light" ? "text-dark" : "text-light";

  const [fetchStartDate, setFetchStartDate] = useState(new Date());
  const [fetchEndDate, setFetchEndDate] = useState(new Date());
  const [outputType, setOutputType] = useState(DASHBOARD_TYPE.MANAGED_MONITOR);

  return (
    <>
      <h1 className={`header-title ${textColorClass}`}>Dashboard</h1>
      <p className={`header-description ${textColorClass}`}>
        Here you can monitor the overall activity of the API.
      </p>
      <hr />
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} data-bs-theme={`${theme}`}>
            <Form.Label className={`header-description ${textColorClass}`}>
              Start Date
            </Form.Label>
            <DatePicker
              selected={fetchStartDate}
              dateFormat="yyyy-MM-dd"
              onChange={(date) => setFetchStartDate(date)}
              className="form-control"
            />
          </Form.Group>
          <Form.Group as={Col} data-bs-theme={`${theme}`}>
            <Form.Label className={`header-description ${textColorClass}`}>
              End Date
            </Form.Label>
            <DatePicker
              selected={fetchEndDate}
              dateFormat="yyyy-MM-dd"
              onChange={(date) => setFetchEndDate(date)}
              className="form-control"
            />
          </Form.Group>
          <Form.Group as={Col} data-bs-theme={`${theme}`}>
            <Form.Label className={`header-description ${textColorClass}`}>
              대시보드 타입
            </Form.Label>
            <Form.Select
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
            >
              <option value={DASHBOARD_TYPE.MANAGED_MONITOR}>모니터링</option>
              <option value={DASHBOARD_TYPE.MANAGE}>자동화</option>
              <option value={DASHBOARD_TYPE.WORKHISTORY_MONITOR}>
                작업의뢰
              </option>
            </Form.Select>
          </Form.Group>
        </Row>
      </Form>
      <hr />
      {outputType === DASHBOARD_TYPE.MANAGED_MONITOR && (
        <Monitoring start={fetchStartDate} end={fetchEndDate} />
      )}
      {outputType === DASHBOARD_TYPE.MANAGE && (
        <Manage start={fetchStartDate} end={fetchEndDate} />
      )}
      {outputType === DASHBOARD_TYPE.WORKHISTORY_MONITOR && (
        <WorkHistoryMonitor start={fetchStartDate} end={fetchEndDate} />
      )}
    </>
  );
};

export default Dashboard;

