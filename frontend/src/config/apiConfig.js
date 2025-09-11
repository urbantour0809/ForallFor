// API 설정 파일
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/FAF';

export const API_ENDPOINTS = {
  // 챌린지 관련 API
  CHALLENGE: {
    LIST: `${API_BASE_URL}/api/challenges`,
    DETAIL: (id) => `${API_BASE_URL}/api/challenges/${id}`,
    REGISTER: `${API_BASE_URL}/api/challenge/register`,
    DELETE: (id) => `${API_BASE_URL}/api/challenge/${id}`,
    LEVELS: `${API_BASE_URL}/api/challenge/levels`,
    CATEGORIES: `${API_BASE_URL}/api/challenge/categories`,
    LANGUAGES: `${API_BASE_URL}/api/challenge/languages`
  },
  
  // 제품 관련 API
  PRODUCT: {
    LIST: `${API_BASE_URL}/api/products`,
    DETAIL: (id) => `${API_BASE_URL}/api/products/${id}`,
    REGISTER: `${API_BASE_URL}/api/product/register`
  },
  
  // 사용자 관련 API
  USER: {
    LOGIN: `${API_BASE_URL}/api/user/login`,
    REGISTER: `${API_BASE_URL}/api/user/register`,
    PROFILE: `${API_BASE_URL}/api/user/profile`
  }
};

export default API_ENDPOINTS;