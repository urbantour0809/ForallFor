/**
 * API 클라이언트 설정
 * 
 * Axios를 기반으로 한 통합 API 클라이언트입니다.
 * Python 백엔드의 FastAPI 엔드포인트와 통신합니다.
 */

import axios from 'axios';

// 환경 변수 또는 기본값 설정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;
const LLM_TIMEOUT = parseInt(process.env.REACT_APP_LLM_TIMEOUT) || 120000; // LLM은 2분 타임아웃

// Axios 인스턴스 생성 (일반 API용)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// LLM 전용 클라이언트 (더 긴 타임아웃)
const llmClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: LLM_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 공통 인터셉터 함수
const createRequestInterceptor = (clientName) => (config) => {
  // 개발 환경에서 요청 로깅
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 ${clientName} Request:`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      timeout: config.timeout
    });
  }
  
  // 인증 토큰이 있다면 추가 (추후 구현)
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

const createResponseInterceptor = (clientName) => [
  (response) => {
    // 개발 환경에서 응답 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${clientName} Response:`, {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // 에러 응답 처리
    const { response } = error;
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${clientName} Error:`, {
        status: response?.status,
        statusText: response?.statusText,
        url: response?.config?.url,
        data: response?.data,
        message: error.message,
      });
    }
    
    // HTTP 상태 코드별 에러 메시지
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    
    if (response) {
      switch (response.status) {
        case 400:
          errorMessage = response.data?.detail || '잘못된 요청입니다.';
          break;
        case 401:
          errorMessage = '인증이 필요합니다.';
          break;
        case 403:
          errorMessage = '접근 권한이 없습니다.';
          break;
        case 404:
          errorMessage = '요청한 리소스를 찾을 수 없습니다.';
          break;
        case 500:
          errorMessage = response.data?.detail || '서버 내부 오류가 발생했습니다.';
          break;
        case 503:
          errorMessage = response.data?.detail || '서비스가 일시적으로 사용할 수 없습니다.';
          break;
        default:
          errorMessage = response.data?.detail || `오류가 발생했습니다. (${response.status})`;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = clientName === 'LLM' 
        ? 'AI 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.' 
        : '요청 시간이 초과되었습니다.';
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = '네트워크 연결을 확인해주세요.';
    }
    
    // 에러 객체에 사용자 친화적 메시지 추가
    error.userMessage = errorMessage;
    
    return Promise.reject(error);
  }
];

// 인터셉터 적용
apiClient.interceptors.request.use(createRequestInterceptor('API'));
apiClient.interceptors.response.use(...createResponseInterceptor('API'));

llmClient.interceptors.request.use(createRequestInterceptor('LLM'));
llmClient.interceptors.response.use(...createResponseInterceptor('LLM'));

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 채팅 및 LLM 관련
  CHAT_LLM: '/api/chat/llm',
  CODE_VALIDATION: '/api/answer',
  
  // 시스템 관련
  HEALTH_CHECK: '/api/health',
  MODEL_INFO: '/api/model/info',
};

// 유틸리티 함수들
export const apiUtils = {
  // 에러 메시지 추출
  getErrorMessage: (error) => {
    return error.userMessage || error.message || '알 수 없는 오류가 발생했습니다.';
  },
  
  // 네트워크 상태 확인
  isNetworkError: (error) => {
    return !error.response && (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED');
  },
  
  // 서버 오류 확인
  isServerError: (error) => {
    return error.response && error.response.status >= 500;
  },
  
  // 클라이언트 오류 확인
  isClientError: (error) => {
    return error.response && error.response.status >= 400 && error.response.status < 500;
  },
};

export default apiClient;
export { llmClient }; 