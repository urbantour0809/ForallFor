/**
 * API 호출 유틸리티 함수들
 * 백엔드 API와의 통신을 담당합니다.
 */

const API_BASE_URL = 'http://localhost:8080/FAF/api';

/**
 * 기본 API 호출 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise} API 응답
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log(`🌐 API 호출: ${url}`);
    console.log(`📋 요청 설정:`, config);
    
    const response = await fetch(url, config);
    console.log(`📡 응답 상태: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP 에러 응답:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API 응답:`, data);
    
    return data;
  } catch (error) {
    console.error(`❌ API 호출 실패: ${endpoint}`, error);
    console.error(`🔍 에러 상세:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

/**
 * 챌린지 관련 API 함수들
 */
export const challengeAPI = {
  /**
   * 전체 챌린지 목록 조회 (필터링 지원)
   * @param {Object} filters - 필터 옵션
   * @param {string} filters.difficulty - 난이도 필터
   * @param {string} filters.category - 카테고리 필터
   * @param {string} filters.language - 언어 필터
   * @returns {Promise} 챌린지 목록
   */
  getAllChallenges: async (filters = {}) => {
    const { difficulty = 'all', category = 'all', language = 'all' } = filters;
    const params = new URLSearchParams({
      difficulty,
      category,
      language,
    });
    
    return apiCall(`/challenges?${params}`);
  },

  /**
   * 개별 챌린지 상세 조회
   * @param {number} challengeId - 챌린지 ID
   * @returns {Promise} 챌린지 상세 정보
   */
  getChallengeDetail: async (challengeId) => {
    return apiCall(`/challenges/${challengeId}`);
  },

  /**
   * 챌린지 통계 정보 조회
   * @param {number} challengeId - 챌린지 ID
   * @returns {Promise} 통계 정보
   */
  getChallengeStatistics: async (challengeId) => {
    const response = await apiCall(`/challenges/${challengeId}`);
    return response.statistics;
  },
};

/**
 * 에러 처리 유틸리티
 */
export const handleAPIError = (error) => {
  console.error('API 에러:', error);
  
  if (error.message.includes('HTTP error! status: 404')) {
    return '요청한 데이터를 찾을 수 없습니다.';
  }
  
  if (error.message.includes('HTTP error! status: 500')) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  if (error.message.includes('Failed to fetch')) {
    return '네트워크 연결을 확인해주세요.';
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * 로딩 상태 관리를 위한 유틸리티
 */
export const createLoadingState = () => {
  return {
    loading: false,
    error: null,
    data: null,
  };
};

/**
 * API 호출 결과를 프론트엔드 데이터 형식으로 변환
 * @param {Object} apiResponse - 백엔드 API 응답
 * @returns {Object} 프론트엔드 형식 데이터
 */
export const transformChallengeData = (apiResponse) => {
  if (!apiResponse.success) {
    throw new Error(apiResponse.message || '데이터 조회에 실패했습니다.');
  }

  const { challenge, level, category, statistics } = apiResponse;
  
  // 🔥 디버깅 로그 추가
  console.log('🔍 transformChallengeData - 원본 데이터:', {
    challenge: challenge,
    level: level,
    category: category,
    statistics: statistics
  });
  
  // 백엔드 DB 구조에 맞춘 변환
  const transformedData = {
    id: challenge.challenge_id,
    title: challenge.challenge_title,
    difficulty: level?.level_name || 'Unknown', // '초급', '중급', '고급'
    description: challenge.content,
    hints: challenge.hint ? [challenge.hint] : [],
    tags: [], // 현재는 하드코딩, 추후 태그 시스템 구현 시 수정
    category: category?.category_name || 'Unknown', // '알고리즘', '자료구조', '웹개발' 등
    acceptanceRate: statistics?.accuracyRate || 0,
    submissions: statistics?.totalSubmissions || 0,
    accepted: statistics?.correctSubmissions || 0,
    language: challenge.language, // 'C++', 'Java', 'Python', 'JavaScript' 등
    correct: challenge.correct,
  };
  
  // 🔥 변환된 데이터 로그
  console.log('✅ transformChallengeData - 변환된 데이터:', transformedData);
  
  return transformedData;
};

export default apiCall; 