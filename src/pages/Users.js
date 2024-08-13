import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';

const User = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { getUserToken } = useAuth();
  const isAdmin = getUserToken().email === config.admin;
  const [view, setView] = useState(true);
  const [showAccessLog, setShowAccessLog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const usersApi = useApi();
  const userApi = useApi();

  useEffect(() => {
    usersApi.callApi(config.api.path.users, config.api.method.GET);
  }, [view]);

  const handleChangeButtonClick = (user) => {
    userApi.callApi(config.api.path.update_active, config.api.method.POST, user);
    if (userApi.data && userApi.data.status === 200) {
      setView(!view);
    }
  };

  const handleAccessLogShow = (user) => {
    setSelectedLog(user);
    setShowAccessLog(true);
  }

  const handleAccessLogClose = () => {
    setShowAccessLog(false);
    setSelectedLog(null);
  }

  // 데이터가 없으면 빈 배열로 초기화
  const filteredUsers = usersApi.data ? usersApi.data.data.filter(user => user.Email !== config.admin) : [];

  return (
    <>
      <h1 className={`header-title ${textColorClass}`}>Users</h1>
      <p className={`header-description ${textColorClass}`}>Here you can check the registered users and their status.</p>

      {/* 데이터 로딩 중에 스피너 표시 */}
      {usersApi.loading && <Spinner animation="border" />}

      {/* 데이터가 없거나 로딩 중일 때 에러 메시지 표시 */}
      {usersApi.error && <Alert variant="danger" className="mt-3">{usersApi.error}</Alert>}

      {usersApi.data && (
        <Table striped bordered hover className="mt-3" variant={`${theme}`}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Name</th>
              <th style={{ textAlign: 'center' }}>Email</th>
              <th style={{ textAlign: 'center' }}>Active</th>
              <th style={{ textAlign: 'center' }}>Verified</th>
              <th style={{ textAlign: 'center' }}>Created</th>
              <th style={{ textAlign: 'center' }}>Log</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <React.Fragment key={user.ID}>
                  <tr>
                    <td style={{ textAlign: 'center' }}>{user.Name}</td>
                    <td style={{ textAlign: 'center' }}>{user.Email}</td>
                    <td style={{ textAlign: 'center' }}>
                      {user.IsActive ? <i className="bi bi-person-fill-check"></i> : <i className="bi bi-ban-fill"></i>}
                      {isAdmin && (
                        <Button variant="link" onClick={() => handleChangeButtonClick(user)} size="sm" disabled={userApi.loading}>
                          {userApi.loading ? <Spinner as="span" animation="border" size="sm" /> : <i className="bi bi-arrow-repeat"></i>}
                        </Button>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>{user.Verified ? <i className="bi bi-person-fill-check"></i> : <i className="bi bi-question-circle-fill"></i>}</td>
                    <td style={{ textAlign: 'center' }}>{new Date(user.AtCreateDate * 1000).toLocaleString()}</td>
                    <td style={{ textAlign: 'center' }}>
                      <Button variant="link" onClick={() => handleAccessLogShow(user.AccessLog)}>
                        <i className="bi bi-info-circle-fill"></i>
                      </Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No users available</td>
              </tr>
            )}
          </tbody>

        </Table>
      )}

      <Modal show={showAccessLog} onHide={handleAccessLogClose}>
        <Modal.Header closeButton>
          <Modal.Title>Access Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && selectedLog.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {selectedLog
                .slice(0)
                .reverse()
                .map((log, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                      <p><strong>Agent:</strong> {log.Agent}</p>
                    </div>
                    <p><strong>IP:</strong> {log.Ip}</p>
                    <p><strong>Access Time:</strong> {new Date(log.AccessTime * 1000).toLocaleString()}</p>
                    <hr />
                  </div>
                ))}
            </div>
          ) : (
            <p>No Access Logs available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAccessLogClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default User;

