import React, { useState, useEffect } from 'react';
import { Table, Alert, Button, Spinner, Form, Modal } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';

const User = () => {
  const [view, setView] = useState(true)
  const usersApi = useApi();
  const userApi = useApi();

  useEffect(() => {
    usersApi.callApi(
      config.api.path.users,
      config.api.method.GET,
    );

    console.log("users: ", usersApi.data)
  }, [view])

  const handleChangeButtonClick = (user) => {
    userApi.callApi(
      config.api.path.update_active,
      config.api.method.POST,
      user
    );
    if (userApi.data && userApi.data.status === 200) {
      setView(!view)
    }
  };


  return (
    <>
      <h1 className="my-4">Users</h1>
      {usersApi.data && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Email</th>
              <th>Active</th>
              <th>Verified</th>
              <th>Join</th>
            </tr>
          </thead>
          <tbody>
            {usersApi.data.data.map((user) => (
              <React.Fragment key={user.ID}>
                <tr>
                  <td>{user.Email}</td>
                  <td>{user.IsActive ? "🟢" : "🔴"}
                    <Button variant="link" onClick={() => handleChangeButtonClick(user)} size="sm" disabled={usersApi.loading}>
                      {usersApi.loading ? <Spinner as="span" animation="border" size="sm" /> : '변경'}
                    </Button>
                  </td>
                  <td>{user.Verified ? "🟢" : "🔴"}</td>
                  <td>{new Date(user.AtDate * 1000).toLocaleString()}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default User;
