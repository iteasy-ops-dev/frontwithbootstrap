import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import config from '../config';
import { useAuth } from '../AuthContext';
import { Form, Button, Alert, Spinner, InputGroup, Row, Col, Accordion } from 'react-bootstrap';
import ChangePasswordForm from './manageOptions/ChangePasswordForm';
import ChangeSshPortForm from './manageOptions/ChangeSshPortForm';
import ChangeSslForm from './manageOptions/ChangeSslForm';
import PruneFirewall from './manageOptions/PruneFirewall';
import PackageManager from './manageOptions/PackageManager';
import WebHostManager from './manageOptions/WebHostManager';
import AccountManager from './manageOptions/AccountManager';
import { validateEmptyObject } from "../utils/validators";
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

    console.log("payload: ", payload);

    // try {
    //   await callApi(config.api.path.run, config.api.method.POST, payload);
    // } catch (error) {
    //   console.error('API call failed:', error);
    // }
  };

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
          <Alert key="danger" variant="danger">
            Network Error: Try Re-Login !
          </Alert>
          :
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
        }
        {type !== '' &&
          <>
            <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
              <InputGroup.Text>IPs</InputGroup.Text>
              <Form.Control
                as="textarea"
                value={ips}
                required
                placeholder='ex) 192.168.0.1, 192.168.0.2:2222'
                onChange={(e) => setIps(e.target.value)}
              />
            </InputGroup>
            <Row>
              <Col>
                <InputGroup className="mb-3" data-bs-theme={`${theme}`}>
                  <InputGroup.Text>Account</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={account}
                    required
                    placeholder='ex) root'
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
        {type === "change_ssl" && <ChangeSslForm />}
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
