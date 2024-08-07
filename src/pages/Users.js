// import React, { useState, useEffect } from 'react';
// import { Table, Button, Spinner } from 'react-bootstrap';
// import config from '../config';
// import useApi from '../hooks/useApi';
// import { useAuth } from '../AuthContext';

// const User = () => {
//   const { getUserToken } = useAuth();
//   const isAdmin = getUserToken().email === config.admin
//   const [view, setView] = useState(true)
//   const usersApi = useApi();
//   const userApi = useApi();

//   useEffect(() => {
//     usersApi.callApi(
//       config.api.path.users,
//       config.api.method.GET,
//     );

//     // console.log("users: ", usersApi.data)
//   }, [view])

//   const handleChangeButtonClick = (user) => {
//     userApi.callApi(
//       config.api.path.update_active,
//       config.api.method.POST,
//       user
//     );
//     if (userApi.data && userApi.data.status === 200) {
//       setView(!view)
//     }
//   };

//   const filteredUsers = usersApi.data ? usersApi.data.data.filter(user => user.Email !== config.admin) : [];
  
//   return (
//     <>
//       <h1 className="header-title">Users</h1>
//       <p className="header-description">Here you can check the registered users and their status.</p>
//       {usersApi.data && (
//         <Table striped bordered hover className="mt-3">
//           <thead>
//             <tr>
//               <th style={{ textAlign: 'center' }}>Name</th>
//               <th style={{ textAlign: 'center' }}>Email</th>
//               <th style={{ textAlign: 'center' }}>Active</th>
//               <th style={{ textAlign: 'center' }}>Verified</th>
//               <th style={{ textAlign: 'center' }}>Join</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <React.Fragment key={user.ID}>
//                 <tr>
//                   <td style={{ textAlign: 'center' }}>{user.Name}</td>
//                   <td style={{ textAlign: 'center' }}>{user.Email}</td>
//                   <td style={{ textAlign: 'center' }}>{user.IsActive ? <i class="bi bi-person-fill-check"></i> : <i class="bi bi-ban-fill"></i>}
//                     {isAdmin &&
//                       <Button variant="link" onClick={() => handleChangeButtonClick(user)} size="sm" disabled={usersApi.loading}>
//                         {usersApi.loading ? <Spinner as="span" animation="border" size="sm" /> : <i class="bi bi-arrow-repeat"></i>}
//                       </Button>
//                     }
//                   </td>
//                   <td style={{ textAlign: 'center' }}>{user.Verified ? <i class="bi bi-person-fill-check"></i> : <i class="bi bi-question-circle-fill"></i>}</td>
//                   <td style={{ textAlign: 'center' }}>{new Date(user.AtDate * 1000).toLocaleString()}</td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </>
//   );
// };

// export default User;

import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';
import { useAuth } from '../AuthContext';

const User = () => {
  const { getUserToken } = useAuth();
  const isAdmin = getUserToken().email === config.admin;
  const [view, setView] = useState(true);
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

  // 데이터가 없으면 빈 배열로 초기화
  const filteredUsers = usersApi.data ? usersApi.data.data.filter(user => user.Email !== config.admin) : [];

  return (
    <>
      <h1 className="header-title">Users</h1>
      <p className="header-description">Here you can check the registered users and their status.</p>
      
      {/* 데이터 로딩 중에 스피너 표시 */}
      {usersApi.loading && <Spinner animation="border" />}
      
      {/* 데이터가 없거나 로딩 중일 때 에러 메시지 표시 */}
      {usersApi.error && <Alert variant="danger" className="mt-3">{usersApi.error}</Alert>}

      {usersApi.data && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Name</th>
              <th style={{ textAlign: 'center' }}>Email</th>
              <th style={{ textAlign: 'center' }}>Active</th>
              <th style={{ textAlign: 'center' }}>Verified</th>
              <th style={{ textAlign: 'center' }}>Join</th>
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
                    <td style={{ textAlign: 'center' }}>{new Date(user.AtDate * 1000).toLocaleString()}</td>
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
    </>
  );
};

export default User;

