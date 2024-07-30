import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';

const User = () => {
  const { getUserEmail } = useAuth();
  const isAdmin = getUserEmail() === "iteasy.ops.dev@gmail.com"
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
              <th style={{ textAlign: 'center' }}>Email</th>
              <th style={{ textAlign: 'center' }}>Active</th>
              <th style={{ textAlign: 'center' }}>Verified</th>
              <th style={{ textAlign: 'center' }}>Join</th>
            </tr>
          </thead>
          <tbody>
            {usersApi.data.data.map((user) => (
              <React.Fragment key={user.ID}>
                <tr>
                  <td style={{ textAlign: 'center' }}>{user.Email}</td>
                  <td style={{ textAlign: 'center' }}>{user.IsActive ? "🟢" : "🔴"}
                    {isAdmin &&
                      <Button variant="link" onClick={() => handleChangeButtonClick(user)} size="sm" disabled={usersApi.loading}>
                        {usersApi.loading ? <Spinner as="span" animation="border" size="sm" /> : <i class="bi bi-arrow-repeat"></i>}
                      </Button>
                    }
                  </td>
                  <td style={{ textAlign: 'center' }}>{user.Verified ? "🟢" : "🔴"}</td>
                  <td style={{ textAlign: 'center' }}>{new Date(user.AtDate * 1000).toLocaleString()}</td>
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