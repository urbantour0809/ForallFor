/**
 * API 커스텀 훅들
 * 
 * React 컴포넌트에서 API 호출을 쉽게 사용할 수 있는 커스텀 훅들입니다.
 * 로딩 상태, 에러 처리, 재시도 기능을 포함합니다.
 */

import { useState, useCallback, useRef } from 'react';
import {
  chatWithLLM,
  validateCode,
  checkHealth,
  getModelInfo,
  simpleChat,
  analyzeCode,
  getStepByStepGuide,
  simpleCodeValidation,
  getApiErrorMessage,
  isNetworkError,
  isServerError,
  isClientError
} from '../services/apiService';

// ============================================================================
// 공통 상태 관리 훅
// ============================================================================

/**
 * API 호출 상태를 관리하는 공통 훅
 * 
 * @param {Function} apiFunction - 호출할 API 함수
 * @returns {Object} API 상태 및 실행 함수
 */
const useApiState = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (...args) => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      // AbortError는 무시 (요청이 취소된 경우)
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = getApiErrorMessage(err);
      setError({
        message: errorMessage,
        original: err,
        isNetworkError: isNetworkError(err),
        isServerError: isServerError(err),
        isClientError: isClientError(err)
      });
      throw err;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

// ============================================================================
// 채팅 관련 훅
// ============================================================================

/**
 * LLM 채팅 훅
 * 
 * @returns {Object} 채팅 상태 및 함수들
 */
export const useChatLLM = () => {
  const { data, loading, error, execute, reset } = useApiState(chatWithLLM);

  const sendMessage = useCallback(async (request) => {
    return execute(request);
  }, [execute]);

  return {
    response: data,
    loading,
    error,
    sendMessage,
    reset
  };
};

/**
 * 간단한 채팅 훅
 * 
 * @returns {Object} 간단한 채팅 상태 및 함수들
 */
export const useSimpleChat = () => {
  const { data, loading, error, execute, reset } = useApiState(simpleChat);

  const sendMessage = useCallback(async (message, code = '', language = 'python') => {
    return execute(message, code, language);
  }, [execute]);

  return {
    response: data,
    loading,
    error,
    sendMessage,
    reset
  };
};

/**
 * 코드 분석 훅
 * 
 * @returns {Object} 코드 분석 상태 및 함수들
 */
export const useCodeAnalysis = () => {
  const { data, loading, error, execute, reset } = useApiState(analyzeCode);

  const analyze = useCallback(async (code, language = 'python', message = '코드 분석 및 개선점 제안') => {
    return execute(code, language, message);
  }, [execute]);

  return {
    analysis: data,
    loading,
    error,
    analyze,
    reset
  };
};

/**
 * 단계별 가이드 훅
 * 
 * @returns {Object} 단계별 가이드 상태 및 함수들
 */
export const useStepByStepGuide = () => {
  const { data, loading, error, execute, reset } = useApiState(getStepByStepGuide);

  const getGuide = useCallback(async (message, code = '', language = 'python') => {
    return execute(message, code, language);
  }, [execute]);

  return {
    guide: data,
    loading,
    error,
    getGuide,
    reset
  };
};

// ============================================================================
// 코드 검증 관련 훅
// ============================================================================

/**
 * 코드 검증 훅
 * 
 * @returns {Object} 코드 검증 상태 및 함수들
 */
export const useCodeValidation = () => {
  const { data, loading, error, execute, reset } = useApiState(validateCode);

  const validate = useCallback(async (request) => {
    return execute(request);
  }, [execute]);

  return {
    validation: data,
    loading,
    error,
    validate,
    reset
  };
};

/**
 * 간단한 코드 검증 훅
 * 
 * @returns {Object} 간단한 코드 검증 상태 및 함수들
 */
export const useSimpleCodeValidation = () => {
  const { data, loading, error, execute, reset } = useApiState(simpleCodeValidation);

  const validate = useCallback(async (userCode, problemDescription, language = 'python') => {
    return execute(userCode, problemDescription, language);
  }, [execute]);

  return {
    validation: data,
    loading,
    error,
    validate,
    reset
  };
};

// ============================================================================
// 시스템 관련 훅
// ============================================================================

/**
 * 서버 상태 확인 훅
 * 
 * @returns {Object} 서버 상태 및 함수들
 */
export const useHealthCheck = () => {
  const { data, loading, error, execute, reset } = useApiState(checkHealth);

  const check = useCallback(async () => {
    return execute();
  }, [execute]);

  return {
    health: data,
    loading,
    error,
    check,
    reset
  };
};

/**
 * 모델 정보 조회 훅
 * 
 * @returns {Object} 모델 정보 및 함수들
 */
export const useModelInfo = () => {
  const { data, loading, error, execute, reset } = useApiState(getModelInfo);

  const getInfo = useCallback(async () => {
    return execute();
  }, [execute]);

  return {
    modelInfo: data,
    loading,
    error,
    getInfo,
    reset
  };
};

// ============================================================================
// 고급 훅 (재시도, 캐싱 등)
// ============================================================================

/**
 * 재시도 기능이 있는 API 훅
 * 
 * @param {Function} apiFunction - 호출할 API 함수
 * @param {Object} options - 옵션
 * @param {number} options.maxRetries - 최대 재시도 횟수 (기본값: 3)
 * @param {number} options.retryDelay - 재시도 간격 (ms, 기본값: 1000)
 * @param {Function} options.shouldRetry - 재시도 여부 결정 함수
 * @returns {Object} API 상태 및 실행 함수
 */
export const useApiWithRetry = (apiFunction, options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    shouldRetry = (error) => isNetworkError(error) || isServerError(error)
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (...args) => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setRetryCount(0);

    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await apiFunction(...args);
        setData(result);
        setRetryCount(0);
        return result;
      } catch (err) {
        lastError = err;

        // AbortError는 무시
        if (err.name === 'AbortError') {
          return;
        }

        // 마지막 시도이거나 재시도하지 않을 에러인 경우
        if (attempt === maxRetries || !shouldRetry(err)) {
          const errorMessage = getApiErrorMessage(err);
          setError({
            message: errorMessage,
            original: err,
            isNetworkError: isNetworkError(err),
            isServerError: isServerError(err),
            isClientError: isClientError(err),
            retryCount: attempt
          });
          throw err;
        }

        // 재시도 대기
        setRetryCount(attempt + 1);
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }, [apiFunction, maxRetries, retryDelay, shouldRetry]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setRetryCount(0);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    data,
    loading,
    error,
    retryCount,
    execute,
    reset
  };
};

/**
 * 자동 재시도가 있는 채팅 훅
 * 
 * @param {Object} options - 재시도 옵션
 * @returns {Object} 채팅 상태 및 함수들
 */
export const useChatLLMWithRetry = (options = {}) => {
  const { data, loading, error, retryCount, execute, reset } = useApiWithRetry(chatWithLLM, options);

  const sendMessage = useCallback(async (request) => {
    return execute(request);
  }, [execute]);

  return {
    response: data,
    loading,
    error,
    retryCount,
    sendMessage,
    reset
  };
};

// ============================================================================
// 유틸리티 훅
// ============================================================================

/**
 * API 연결 상태 확인 훅
 * 
 * @returns {Object} 연결 상태
 */
export const useApiConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const { health, loading, error, check } = useHealthCheck();

  const checkConnection = useCallback(async () => {
    try {
      await check();
      setIsConnected(true);
      setLastCheck(new Date());
    } catch (err) {
      setIsConnected(false);
      setLastCheck(new Date());
    }
  }, [check]);

  return {
    isConnected,
    lastCheck,
    health,
    loading,
    error,
    checkConnection
  };
}; 