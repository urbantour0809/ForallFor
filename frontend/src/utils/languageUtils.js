// 언어별 UI 정보 유틸리티
export const getLanguageInfo = (language) => {
  const languageInfoMap = {
    'Java': { 
      emoji: '☕', 
      color: 'text-orange-400', 
      description: '객체지향 프로그래밍',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-300'
    },
    'Python': { 
      emoji: '🐍', 
      color: 'text-yellow-400', 
      description: '간결하고 강력한 언어',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300'
    },
    'JavaScript': { 
      emoji: '🟨', 
      color: 'text-yellow-300', 
      description: '웹 개발의 핵심',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300'
    },
    'C++': { 
      emoji: '⚡', 
      color: 'text-blue-400', 
      description: '고성능 시스템 언어',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300'
    },
    'C': { 
      emoji: '🔧', 
      color: 'text-gray-400', 
      description: '시스템 프로그래밍',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300'
    },
    'Go': { 
      emoji: '🐹', 
      color: 'text-cyan-400', 
      description: '빠르고 간단한 언어',
      bgColor: 'bg-cyan-100',
      borderColor: 'border-cyan-300'
    },
    'Rust': { 
      emoji: '🦀', 
      color: 'text-red-400', 
      description: '메모리 안전성',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300'
    }
  };

  return languageInfoMap[language] || { 
    emoji: '💻', 
    color: 'text-gray-400', 
    description: '프로그래밍 언어',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300'
  };
};

// 카테고리별 이모지 매핑
export const getCategoryEmoji = (categoryName) => {
  const categoryEmojis = {
    '알고리즘': '🧮',
    '자료구조': '📊',
    '웹개발': '🌐',
    '프론트엔드': '💻',
    '백엔드': '⚙️',
    '시스템': '🖥️',
    '네트워크': '🌐',
    '데이터베이스': '💾',
    '머신러닝': '🤖',
    '보안': '🔒'
  };

  return categoryEmojis[categoryName] || '📝';
};

// 난이도별 색상 클래스 매핑
export const getLevelColorClass = (color) => {
  const colorClassMap = {
    'green': 'text-green-400',
    'yellow': 'text-yellow-400',
    'red': 'text-red-400',
    'blue': 'text-blue-400',
    'purple': 'text-purple-400'
  };

  return colorClassMap[color] || 'text-gray-400';
};