/**
 * 프로그래밍 언어 데이터 중앙 관리 시스템
 * 
 * 이 파일은 모든 언어 관련 정보를 한 곳에서 관리하여 일관성을 유지하고
 * 중복을 방지합니다. 이미지 import도 여기서 중앙 관리하여 메모리 효율성을 높입니다.
 * 
 * 주요 기능:
 * - 언어 데이터 중앙 집중화
 * - 이미지 리소스 최적화
 * - 유틸리티 함수 통합 관리
 * - 타입 안전성 보장 (JSDoc)
 * 
 * 사용하는 컴포넌트:
 * - MainPage (간단한 언어 카드용)
 * - Languages (상세 언어 정보 페이지용)
 * - 기타 언어 관련 컴포넌트들
 */

// 프로그래밍 언어 로고 이미지들을 한 곳에서 import
// 이렇게 하면 웹팩이 이미지를 한 번만 로드하고 재사용
import javaLogo from '../assets/images/java.png';
import pythonLogo from '../assets/images/python.png';
import javascriptLogo from '../assets/images/javascript.png';
import cLogo from '../assets/images/c.png';
import cppLogo from '../assets/images/c++.png';
import rustLogo from '../assets/images/rust.png';
import goLogo from '../assets/images/go.png';

/**
 * 프로그래밍 언어 완전 데이터 배열
 * 모든 컴포넌트에서 이 데이터를 공유하여 일관성 유지
 * 
 * @typedef {Object} LanguageData
 * @property {string} id - 고유 식별자 (URL 친화적)
 * @property {string} name - 언어 이름
 * @property {string} logo - 로고 이미지 (import된 이미지)
 * @property {string} color - 그라데이션 색상 클래스
 * @property {string} bgColor - 배경 색상 클래스
 * @property {string} description - 간단한 설명
 * @property {string[]} features - 주요 특징 배열
 * @property {'beginner'|'intermediate'|'advanced'} difficulty - 난이도
 * @property {number} popularity - 인기도 (0-100)
 */
export const LANGUAGES_DATA = [
  { 
    id: 'java',
    name: 'Java', 
    logo: javaLogo, 
    color: 'from-orange-400 to-red-500', 
    bgColor: 'bg-orange-500/10',
    description: '엔터프라이즈급 애플리케이션 개발',
    features: ['객체지향 프로그래밍', 'Spring Framework', '마이크로서비스', 'Android 개발'],
    difficulty: 'intermediate',
    popularity: 95
  },
  { 
    id: 'python',
    name: 'Python', 
    logo: pythonLogo, 
    color: 'from-blue-400 to-green-500', 
    bgColor: 'bg-blue-500/10',
    description: 'AI, 데이터 사이언스, 웹 개발',
    features: ['머신러닝', 'Django/Flask', '데이터 분석', '자동화'],
    difficulty: 'beginner',
    popularity: 98
  },
  { 
    id: 'javascript',
    name: 'JavaScript', 
    logo: javascriptLogo, 
    color: 'from-yellow-400 to-orange-500', 
    bgColor: 'bg-yellow-500/10',
    description: '웹 프론트엔드 및 백엔드 개발',
    features: ['React/Vue', 'Node.js', 'TypeScript', '모바일 앱'],
    difficulty: 'beginner',
    popularity: 97
  },
  { 
    id: 'c',
    name: 'C', 
    logo: cLogo, 
    color: 'from-blue-500 to-purple-600', 
    bgColor: 'bg-blue-500/10',
    description: '시스템 프로그래밍의 기초',
    features: ['시스템 프로그래밍', '임베디드', '운영체제', '컴파일러'],
    difficulty: 'advanced',
    popularity: 85
  },
  { 
    id: 'cpp',
    name: 'C++', 
    logo: cppLogo, 
    color: 'from-blue-600 to-indigo-700', 
    bgColor: 'bg-blue-600/10',
    description: '고성능 애플리케이션 개발',
    features: ['게임 개발', '시스템 소프트웨어', 'Qt Framework', '알고리즘'],
    difficulty: 'advanced',
    popularity: 88
  },
  { 
    id: 'rust',
    name: 'Rust', 
    logo: rustLogo, 
    color: 'from-orange-600 to-red-700', 
    bgColor: 'bg-orange-600/10',
    description: '안전하고 빠른 시스템 프로그래밍',
    features: ['메모리 안전성', '동시성', '웹어셈블리', '블록체인'],
    difficulty: 'advanced',
    popularity: 82
  },
  { 
    id: 'go',
    name: 'Go', 
    logo: goLogo, 
    color: 'from-cyan-400 to-blue-500', 
    bgColor: 'bg-cyan-500/10',
    description: '클라우드 및 마이크로서비스',
    features: ['클라우드 네이티브', 'Docker/Kubernetes', 'gRPC', '동시성'],
    difficulty: 'intermediate',
    popularity: 84
  },
];

/**
 * 메인 페이지용 간단한 언어 데이터
 * 메인 페이지에서는 기본 정보만 필요하므로 최적화된 데이터 제공
 * 
 * @returns {Array} 간소화된 언어 데이터 배열
 */
export const getSimpleLanguageData = () => {
  return LANGUAGES_DATA.map(lang => ({
    id: lang.id,
    name: lang.name,
    logo: lang.logo,
    color: lang.color,
    bgColor: lang.bgColor,
    description: lang.description
  }));
};

/**
 * 특정 언어 데이터 조회
 * 
 * @param {string} languageId - 언어 ID
 * @returns {LanguageData|null} 해당 언어 데이터 또는 null
 */
export const getLanguageById = (languageId) => {
  return LANGUAGES_DATA.find(lang => lang.id === languageId) || null;
};

/**
 * 난이도별 언어 필터링
 * 
 * @param {'beginner'|'intermediate'|'advanced'} difficulty - 난이도
 * @returns {Array} 해당 난이도의 언어 배열
 */
export const getLanguagesByDifficulty = (difficulty) => {
  return LANGUAGES_DATA.filter(lang => lang.difficulty === difficulty);
};

/**
 * 인기도 순으로 정렬된 언어 데이터
 * 
 * @param {number} limit - 반환할 언어 수 (기본값: 모두)
 * @returns {Array} 인기도 순으로 정렬된 언어 배열
 */
export const getLanguagesByPopularity = (limit = LANGUAGES_DATA.length) => {
  return [...LANGUAGES_DATA]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

// ============================================
// 유틸리티 함수들 - 중복 제거
// ============================================

/**
 * 난이도에 따른 색상 클래스 반환
 * 
 * @param {'beginner'|'intermediate'|'advanced'} difficulty - 난이도 문자열
 * @returns {string} CSS 색상 클래스 문자열
 */
export const getDifficultyColor = (difficulty) => {
  const colorMap = {
    'beginner': 'text-green-400',
    'intermediate': 'text-yellow-400', 
    'advanced': 'text-red-400'
  };
  return colorMap[difficulty] || 'text-gray-400';
};

/**
 * 난이도에 따른 배경 색상 클래스 반환
 * 
 * @param {'beginner'|'intermediate'|'advanced'} difficulty - 난이도 문자열
 * @returns {string} CSS 배경 색상 클래스 문자열
 */
export const getDifficultyBgColor = (difficulty) => {
  const bgColorMap = {
    'beginner': 'text-green-400 bg-green-500/10',
    'intermediate': 'text-yellow-400 bg-yellow-500/10',
    'advanced': 'text-red-400 bg-red-500/10'
  };
  return bgColorMap[difficulty] || 'text-gray-400 bg-gray-500/10';
};

/**
 * 언어 통계 정보
 * 
 * @returns {Object} 언어 관련 통계 정보
 */
export const getLanguageStats = () => {
  const totalLanguages = LANGUAGES_DATA.length;
  const avgPopularity = Math.round(
    LANGUAGES_DATA.reduce((sum, lang) => sum + lang.popularity, 0) / totalLanguages
  );
  
  const difficultyCount = LANGUAGES_DATA.reduce((acc, lang) => {
    acc[lang.difficulty] = (acc[lang.difficulty] || 0) + 1;
    return acc;
  }, {});

  return {
    total: totalLanguages,
    averagePopularity: avgPopularity,
    difficultyDistribution: difficultyCount,
    mostPopular: getLanguagesByPopularity(1)[0],
    easiest: getLanguagesByDifficulty('beginner'),
    hardest: getLanguagesByDifficulty('advanced')
  };
};

/**
 * 언어 검색 함수
 * 
 * @param {string} searchTerm - 검색어
 * @returns {Array} 검색 결과 언어 배열
 */
export const searchLanguages = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return LANGUAGES_DATA.filter(lang => 
    lang.name.toLowerCase().includes(term) ||
    lang.description.toLowerCase().includes(term) ||
    lang.features.some(feature => feature.toLowerCase().includes(term))
  );
}; 