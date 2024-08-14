import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import config from '../config';
import { useAuth } from '../AuthContext';
import { OverlayTrigger, Popover, Form, Button, Alert, Spinner, InputGroup, Row, Col, Accordion } from 'react-bootstrap';
import ChangePasswordForm from './manageOptions/ChangePasswordForm';
import ChangeSshPortForm from './manageOptions/ChangeSshPortForm';
import ChangeSslForm from './manageOptions/ChangeSslForm';
import PruneFirewall from './manageOptions/PruneFirewall';
import PackageManager from './manageOptions/PackageManager';
import WebHostManager from './manageOptions/WebHostManager';
import AccountManager from './manageOptions/AccountManager';
import { validateEmptyObject } from "../utils/validators";
import { toMultipartFormData } from "../utils/apiUtils";
import { useTheme } from '../ThemeContext';

const Manage = () => {
  const { theme } = useTheme();
  const textColorClass = theme === 'light' ? 'text-dark' : 'text-light';

  const { data, loading, error, callApi } = useApi();
  const { functions, getUserToken } = useAuth();
  const invalidState = functions === null || functions === undefined

  const [name] = useState(getUserToken().name);
  const [email] = useState(getUserToken().email);
  const [type, setType] = useState('');
  const [ips, setIps] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({});

  useEffect(() => {
    // Reset options whenever the type changes
    setOptions({});
  }, [type]);

  const handleOptionChange = (key, value) => {
    setOptions(prevOptions => ({ ...prevOptions, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    let v = validateEmptyObject(options)
    if (!v.status) {
      alert(v.message)
      return;
    }

    const payload = {
      type,
      email,
      name,
      ips: ips.split(/[\n,]+/).map(ip => ip.trim()).filter(ip => ip),
      account,
      password,
      options,
    };

    // console.log("payload: ", payload);

    if (!payload.options.hasOwnProperty("files")) {
      await callApi(
        config.api.path.run,
        config.api.method.POST,
        payload
      );
    } else {
      await callApi(
        config.api.path.run,
        config.api.method.POST,
        toMultipartFormData(payload),
        { 'Content-Type': 'multipart/form-data' }
      );
    }
  };


  const popover = (
    <Popover data-bs-theme={`${theme}`}>
      <Popover.Header as="h3" className={`${textColorClass}`}>Help</Popover.Header>
      <Popover.Body className={`${textColorClass}`}>
        <p>작업할 서버의 IP를 작성합니다.</p>
        <p><strong>1. ssh 기본 포트 인 경우</strong></p>
        <p>- 192.168.0.100</p>
        <p><strong>2. ssh 기본 포트가 아닌 경우</strong></p>
        <p>- 192.168.0.100:38371</p>
        <p><strong>3. 작업할 서버가 여러대인 경우</strong></p>
        <p>- ,(콤마) 로 구분 하거나</p>
        <p>192.168.0.100, 192.168.0.101</p>
        <p>- 또는 줄바꿈</p>
        <p>192.168.0.100</p>
        <p>192.168.0.101</p>
        <p>* 계정과 비밀번호는 동일해야 합니다.</p>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <h1 className={`header-title ${textColorClass}`}>Manage</h1>
      <p className={`header-description ${textColorClass}`}>You can manage the server.</p>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Name</InputGroup.Text>
              <Form.Control
                type="text"
                value={name}
                readOnly
                disabled
                required
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>Email</InputGroup.Text>
              <Form.Control
                type="text"
                value={email}
                readOnly
                disabled
                required
              />
            </InputGroup>
          </Col>
        </Row>
        {invalidState ?
          <Row>
            <Col>
              <Alert key="danger" variant="danger">
                Network Error: Try Re-Login !
              </Alert>
            </Col>
          </Row>
          :
          <Row>
            <Col>
              <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                <InputGroup.Text>Type</InputGroup.Text>
                <Form.Select
                  value={type}
                  required
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value=''>- Choose Type</option>
                  {functions && functions.data.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col>
              {type === "" ?
                <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                  <InputGroup.Text><i className="bi bi-arrow-left-circle-fill"></i></InputGroup.Text>
                  <Form.Control
                    type="text"
                    value="작업 타입을 선택합니다."
                    readOnly
                    disabled
                    required
                  />
                </InputGroup>
                :
                <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                  <InputGroup.Text><i className="bi bi-arrow-down-circle-fill"></i></InputGroup.Text>
                  <Form.Control
                    type="text"
                    value="작업할 서버의 접속 정보를 기입합니다."
                    readOnly
                    disabled
                    required
                  />
                </InputGroup>
              }
            </Col>
          </Row>

        }
        {type !== '' &&
          <>
            <Row>
              <Col>
                <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                  <InputGroup.Text>
                    <OverlayTrigger trigger="focus" placement="right" overlay={popover}>
                      <Button variant="link">
                        <i className="bi bi-question-circle-fill"></i>IPs
                      </Button>
                    </OverlayTrigger>
                  </InputGroup.Text>

                  <Form.Control
                    as="textarea"
                    value={ips}
                    required
                    placeholder="작업할 서버의 IP를 작성합니다."
                    onChange={(e) => setIps(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                  <InputGroup.Text>Account</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={account}
                    required
                    placeholder='root 또는 root권한이 있는 계정'
                    onChange={(e) => setAccount(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col>
                <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                  <InputGroup.Text>Password</InputGroup.Text>
                  <Form.Control
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>
          </>
        }

        {/* 추가 옵션 확장 */}
        {type === "change_password" && <ChangePasswordForm handleOptionChange={handleOptionChange} />}
        {type === "prune_firewall" && <PruneFirewall />}
        {type === "change_ssh_port" && <ChangeSshPortForm handleOptionChange={handleOptionChange} />}
        {type === "change_ssl" && <ChangeSslForm handleOptionChange={handleOptionChange} />}
        {type === "package_manager" && <PackageManager handleOptionChange={handleOptionChange} />}
        {type === "webhost_manager" && <WebHostManager handleOptionChange={handleOptionChange} />}
        {type === "account_manager" && <AccountManager handleOptionChange={handleOptionChange} />}
        {/* 추가 옵션 확장 */}
        <br />
        {type !== '' &&
          <>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Submit'}
            </Button>
          </>
        }
      </Form>
      <br />
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {data &&
        <Accordion data-bs-theme={`${theme}`}>
          <Accordion.Item>
            <Accordion.Header>{data.data.Status ? "성공 ✅" : "실패 ❌: 아래 로그 확인하세요."}</Accordion.Header>
            <Accordion.Body>
              ⏰ Duration... {data.data.Duration} s
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {data.data.Payload}
              </pre>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      }
    </>
  );
};

export default Manage;
