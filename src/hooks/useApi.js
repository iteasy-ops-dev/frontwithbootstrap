import { useState } from 'react';
import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * API 호출을 위한 함수
   * @param {string} endpoint - API 엔드포인트
   * @param {string} method - HTTP 메서드 (GET, POST, PUT, DELETE 등)
   * @param {object} payload - 요청 본문 (POST, PUT 요청 시 사용)
   * @param {object} headers - 요청 헤더 (선택 사항)
   * @param {object} params - URL 파라미터 (GET 요청 시 사용)
   */
  const callApi = async (endpoint, method = 'GET', payload = null, headers = {}, params = {}) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await api({
        method,
        url: endpoint,
        data: payload,
        headers: { ...api.defaults.headers, ...headers }, // 기본 헤더와 사용자 헤더 병합
        params, // URL 파라미터 설정
      });
      setData(response); // 응답 데이터 설정
      console.log('response: ',response)
      console.log('setData: ',data)
    } catch (err) {
      console.log(err);
      setError(err.response ? err.response.data : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
};

export default useApi;