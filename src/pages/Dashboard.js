import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Stack, Card, Accordion, Alert } from 'react-bootstrap';
import config from '../config';
import useApi from '../hooks/useApi';

const Dashboard = () => {
  const { data, loading, error, callApi } = useApi();
  const [overall, setOverall] = useState()
  const [types, setTypes] = useState()

  useEffect(() => {
    callApi(
      config.api.path.dashboad,
      config.api.method.GET,
    )
  }, []);

  useEffect(() => {
    if (data && data.data) {
      setOverall(data.data.overall[0]);
      setTypes(data.data.types);
    }
  }, [data]);

  return (
    <>
      <h1 className="header-title">Dashboard</h1>
      <p className="header-description">Welcome to the ITEASY Service Ops Center Platform.</p>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {overall && (
        <>
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>Total</Card.Header>
                <Card.Body>
                  <Stack gap={3}>
                    {[
                      `Count: ${overall.totalCount}`,
                      `Duration: ${overall.totalDuration}`
                    ].map((item, index) => (
                      <Card key={index} className="p-3">
                        <Card.Body>{item}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>Success</Card.Header>
                <Card.Body>
                  <Stack gap={3}>
                    {[
                      `Count: ${overall.successCount}`,
                      `Duration: ${overall.successDuration}`
                    ].map((item, index) => (
                      <Card key={index} className="p-3">
                        <Card.Body>{item}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>Failure</Card.Header>
                <Card.Body>
                  <Stack gap={3}>
                    {[
                      `Count: ${overall.failureCount}`,
                      `Duration: ${overall.failureDuration}`
                    ].map((item, index) => (
                      <Card key={index} className="p-3">
                        <Card.Body>{item}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      {types && (
        <>
        {types.map((item, index) => {
          // TODO: 여기서부터 시작
          console.log(item, index)
        })}
        </>
      )}
    </>

    // <div>
    //   <h1 className="header-title">Dashboard(TBD)</h1>
    //   <p className="header-description">Welcome to the ITEASY Service Ops Center Platform.</p>
    //   <Container>
    //     <Row className="mb-4">
    //       <Col>
    //         <Card>
    //           <Card.Header>Section 1</Card.Header>
    //           <Card.Body>
    //             <Stack gap={3}>
    //               {['First item', 'Second item', 'Third item'].map((item, index) => (
    //                 <Card key={index} className="p-3">
    //                   <Card.Body>{item}</Card.Body>
    //                 </Card>
    //               ))}
    //             </Stack>
    //           </Card.Body>
    //         </Card>
    //       </Col>
    //       <Col>
    //         <Card>
    //           <Card.Header>Section 2</Card.Header>
    //           <Card.Body>
    //             <Stack gap={3}>
    //               {['First item', 'Second item', 'Third item'].map((item, index) => (
    //                 <Card key={index} className="p-3">
    //                   <Card.Body>{item}</Card.Body>
    //                 </Card>
    //               ))}
    //             </Stack>
    //           </Card.Body>
    //         </Card>
    //       </Col>
    //     </Row>
    //     <Row className="mb-4">
    //       <Col>
    //         <Card>
    //           <Card.Header>Section 3</Card.Header>
    //           <Card.Body>
    //             <Stack gap={3}>
    //               {['First item', 'Second item', 'Third item'].map((item, index) => (
    //                 <Card key={index} className="p-3">
    //                   <Card.Body>{item}</Card.Body>
    //                 </Card>
    //               ))}
    //             </Stack>
    //           </Card.Body>
    //         </Card>
    //       </Col>
    //       <Col>
    //         <Card>
    //           <Card.Header>Section 4</Card.Header>
    //           <Card.Body>
    //             <Stack gap={3}>
    //               {['First item', 'Second item', 'Third item'].map((item, index) => (
    //                 <Card key={index} className="p-3">
    //                   <Card.Body>{item}</Card.Body>
    //                 </Card>
    //               ))}
    //             </Stack>
    //           </Card.Body>
    //         </Card>
    //       </Col>
    //       <Col>
    //         <Card>
    //           <Card.Header>Section 5</Card.Header>
    //           <Card.Body>
    //             <Stack gap={3}>
    //               {['First item', 'Second item', 'Third item'].map((item, index) => (
    //                 <Card key={index} className="p-3">
    //                   <Card.Body>{item}</Card.Body>
    //                 </Card>
    //               ))}
    //             </Stack>
    //           </Card.Body>
    //         </Card>
    //       </Col>
    //     </Row>
    //     <Row>
    //       <Col>
    //         <Accordion>
    //           <Accordion.Item eventKey="0">
    //             <Accordion.Header>Accordion Item #1</Accordion.Header>
    //             <Accordion.Body>
    //               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    //             </Accordion.Body>
    //           </Accordion.Item>
    //           <Accordion.Item eventKey="1">
    //             <Accordion.Header>Accordion Item #2</Accordion.Header>
    //             <Accordion.Body>
    //               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    //             </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion>
    //       </Col>
    //     </Row>
    //   </Container>
    // </div>
  );
};

export default Dashboard;

