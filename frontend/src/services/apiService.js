/**
 * API 서비스 함수들
 * 
 * Python 백엔드의 FastAPI 엔드포인트와 통신하는 서비스 함수들입니다.
 * Pydantic 모델과 일치하는 데이터 구조를 사용합니다.
 */

import apiClient, { llmClient, API_ENDPOINTS, apiUtils } from '../utils/apiClient';

// ============================================================================
// 타입 정의 (Python Pydantic 모델과 일치)
// ============================================================================

/**
 * @typedef {Object} Message
 * @property {number} id - 메시지 ID
 * @property {string} type - 메시지 타입 ('user' | 'assistant')
 * @property {string} content - 메시지 내용
 * @property {string} timestamp - 타임스탬프 (ISO 문자열)
 * @property {boolean} isCode - 코드 블록 여부
 */

/**
 * @typedef {Object} ChatRequest
 * @property {string} message - 사용자 메시지
 * @property {string} [code] - 현재 코드 (선택사항)
 * @property {string} [language] - 프로그래밍 언어 (기본값: 'javascript')
 * @property {Message[]} [history] - 대화 히스토리 (선택사항)
 * @property {string} [difficulty_level] - 난이도 (기본값: 'beginner')
 * @property {string} [problem_topic] - 문제 주제 (선택사항)
 * @property {string} [problem_description] - 문제 설명 (선택사항)
 * @property {string} [request_type] - 요청 타입 (기본값: 'chat')
 */

/**
 * @typedef {Object} ChatResponse
 * @property {string} content - AI 응답 내용
 * @property {boolean} isCode - 코드 블록 여부
 * @property {string} timestamp - 타임스탬프
 * @property {string} [hint_level] - 힌트 레벨
 * @property {number} [step_number] - 단계 번호
 * @property {string} [code_example] - 코드 예시
 * @property {string[]} [suggestions] - 제안사항 목록
 */

/**
 * @typedef {Object} TestCase
 * @property {any} input - 테스트 입력값
 * @property {any} expected_output - 예상 출력값
 */

/**
 * @typedef {Object} CodeValidationRequest
 * @property {string} user_code - 사용자 코드
 * @property {string} problem_description - 문제 설명
 * @property {TestCase[]} test_cases - 테스트 케이스 목록
 * @property {string} [language] - 프로그래밍 언어 (기본값: 'python')
 * @property {string[]} [expected_concepts] - 예상되는 개념들 (선택사항)
 */

/**
 * @typedef {Object} TestResult
 * @property {number} test_case - 테스트 케이스 번호
 * @property {any} input - 입력값
 * @property {any} expected - 예상 출력값
 * @property {any} actual - 실제 출력값
 * @property {boolean} passed - 통과 여부
 * @property {string} [error_message] - 오류 메시지 (선택사항)
 */

/**
 * @typedef {Object} CodeValidationResponse
 * @property {boolean} passed - 전체 통과 여부
 * @property {number} score - 점수 (0.0 ~ 1.0)
 * @property {string} feedback - 피드백 메시지
 * @property {TestResult[]} test_results - 테스트 결과 목록
 * @property {number} execution_time - 실행 시간 (초)
 * @property {number} [memory_usage] - 메모리 사용량 (MB, 선택사항)
 * @property {string[]} [concept_usage] - 사용된 개념들 (선택사항)
 * @property {string[]} [suggestions] - 개선 제안 (선택사항)
 * @property {string} [corrected_code] - 수정된 코드 (선택사항)
 */

/**
 * @typedef {Object} HealthResponse
 * @property {string} status - 상태 ('healthy' | 'unhealthy')
 * @property {boolean} model_loaded - 모델 로드 여부
 * @property {string} device - 디바이스 정보
 * @property {Object} [gpu_info] - GPU 정보 (선택사항)
 * @property {string} timestamp - 타임스탬프
 */

/**
 * @typedef {Object} ModelInfoResponse
 * @property {string} model_name - 모델 이름
 * @property {string} device - 디바이스 정보
 * @property {string} quantization - 양자화 정보
 * @property {string} status - 상태
 */

// ============================================================================
// 채팅 및 LLM 관련 API
// ============================================================================

/**
 * LLM과 채팅 (통합된 스마트한 코딩 도우미)
 * 
 * @param {ChatRequest} request - 채팅 요청 데이터
 * @returns {Promise<ChatResponse>} AI 응답
 */
export const chatWithLLM = async (request) => {
  try {
    // LLM 요청은 더 긴 타임아웃이 필요하므로 llmClient 사용
    const response = await llmClient.post(API_ENDPOINTS.CHAT_LLM, request);
    return response.data;
  } catch (error) {
    console.error('Chat with LLM error:', error);
    throw error;
  }
};

/**
 * 코드 검증 및 채점
 * 
 * @param {CodeValidationRequest} request - 코드 검증 요청 데이터
 * @returns {Promise<CodeValidationResponse>} 검증 결과
 */
export const validateCode = async (request) => {
  try {
    // LLM 검증은 최대 수십 초가 걸릴 수 있으므로 LLM 전용 클라이언트를 사용
    const response = await llmClient.post(API_ENDPOINTS.CODE_VALIDATION, request);
    
    // 응답 데이터 검증
    const data = response.data;
    if (typeof data.passed !== 'boolean') {
      console.warn('⚠️ API 응답에서 passed가 boolean이 아님:', data);
      data.passed = false;
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('Code validation error:', error);
    
    // 네트워크 오류나 서버 오류 시 기본 응답 반환
    return {
      passed: false,
      feedback: '코드 검증 중 오류가 발생했습니다. 다시 시도해주세요.',
      suggestions: ['네트워크 연결을 확인해주세요', '잠시 후 다시 시도해주세요']
    };
  }
};

// ============================================================================
// 시스템 관련 API
// ============================================================================

/**
 * 서버 상태 확인
 * 
 * @returns {Promise<HealthResponse>} 서버 상태 정보
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH_CHECK);
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

/**
 * 모델 정보 조회
 * 
 * @returns {Promise<ModelInfoResponse>} 모델 정보
 */
export const getModelInfo = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MODEL_INFO);
    return response.data;
  } catch (error) {
    console.error('Model info error:', error);
    throw error;
  }
};

// ============================================================================
// 편의 함수들
// ============================================================================

/**
 * 간단한 채팅 요청 (기본값 사용)
 * 
 * @param {string} message - 사용자 메시지
 * @param {string} [code] - 현재 코드 (선택사항)
 * @param {string} [language] - 프로그래밍 언어 (기본값: 'javascript')
 * @returns {Promise<ChatResponse>} AI 응답
 */
export const simpleChat = async (message, code = '', language = 'python') => {
  const request = {
    message,
    code,
    language,
    history: [],
    difficulty_level: 'beginner',
    request_type: 'chat'
  };
  
  return chatWithLLM(request);
};

/**
 * 코드 분석 요청
 * 
 * @param {string} code - 분석할 코드
 * @param {string} [language] - 프로그래밍 언어 (기본값: 'python')
 * @param {string} [message] - 분석 요청 메시지 (기본값: '코드 분석 및 개선점 제안')
 * @returns {Promise<ChatResponse>} 분석 결과
 */
export const analyzeCode = async (code, language = 'python', message = '코드 분석 및 개선점 제안') => {
  const request = {
    message,
    code,
    language,
    history: [],
    difficulty_level: 'beginner',
    request_type: 'analyze'
  };
  
  return chatWithLLM(request);
};

/**
 * 단계별 학습 가이드 요청
 * 
 * @param {string} message - 가이드 요청 메시지
 * @param {string} [code] - 현재 코드 (선택사항)
 * @param {string} [language] - 프로그래밍 언어 (기본값: 'python')
 * @returns {Promise<ChatResponse>} 단계별 가이드
 */
export const getStepByStepGuide = async (message, code = '', language = 'python') => {
  const request = {
    message,
    code,
    language,
    history: [],
    difficulty_level: 'beginner',
    request_type: 'step_by_step'
  };
  
  return chatWithLLM(request);
};

/**
 * 간단한 코드 검증 (기본 테스트 케이스 사용)
 * 
 * @param {string} userCode - 사용자 코드
 * @param {string} problemDescription - 문제 설명
 * @param {string} [language] - 프로그래밍 언어 (기본값: 'python')
 * @returns {Promise<CodeValidationResponse>} 검증 결과
 */
export const simpleCodeValidation = async (userCode, problemDescription, language = 'python') => {
  const request = {
    user_code: userCode,
    problem_description: problemDescription,
    test_cases: [
      {
        input: "기본 입력값",
        expected_output: "기대 출력값"
      }
    ],
    language,
    expected_concepts: []
  };
  
  return validateCode(request);
};

// ============================================================================
// 에러 처리 유틸리티
// ============================================================================

export { apiUtils };

/**
 * API 에러를 사용자 친화적 메시지로 변환
 * 
 * @param {Error} error - API 에러
 * @returns {string} 사용자 친화적 에러 메시지
 */
export const getApiErrorMessage = (error) => {
  return apiUtils.getErrorMessage(error);
};

/**
 * 네트워크 에러인지 확인
 * 
 * @param {Error} error - API 에러
 * @returns {boolean} 네트워크 에러 여부
 */
export const isNetworkError = (error) => {
  return apiUtils.isNetworkError(error);
};

/**
 * 서버 에러인지 확인
 * 
 * @param {Error} error - API 에러
 * @returns {boolean} 서버 에러 여부
 */
export const isServerError = (error) => {
  return apiUtils.isServerError(error);
};

/**
 * 클라이언트 에러인지 확인
 * 
 * @param {Error} error - API 에러
 * @returns {boolean} 클라이언트 에러 여부
 */
export const isClientError = (error) => {
  return apiUtils.isClientError(error);
}; 