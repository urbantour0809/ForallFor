// 📁 이미지 설정 파일 - 새로운 이미지 추가 시 여기만 수정하면 됩니다!

// 사용 가능한 이미지 목록
export const availableImages = [
  { 
    filename: 'algorithm.png', 
    name: '알고리즘',
    description: '알고리즘 관련 서적',
    category: 'algorithm'
  },
  { 
    filename: 'c++.png', 
    name: 'C++',
    description: 'C++ 프로그래밍',
    category: 'programming'
  },
  { 
    filename: 'java.png', 
    name: 'Java',
    description: 'Java 프로그래밍',
    category: 'programming'
  },
  { 
    filename: 'javascript.png', 
    name: 'JavaScript',
    description: 'JavaScript 개발',
    category: 'programming'
  },
  { 
    filename: 'python.png', 
    name: 'Python',
    description: 'Python 프로그래밍',
    category: 'programming'
  },
  { 
    filename: 'rust.png', 
    name: 'Rust',
    description: 'Rust 시스템 프로그래밍',
    category: 'programming'
  },
  { 
    filename: '풍선.png', 
    name: '풍선',
    description: '풍선 관련 서적',
    category: 'misc'
  }
];

// 기본 이미지
export const defaultImage = 'java.png';

// 이미지 베이스 경로
export const imageBasePath = '/images/book_cover/';