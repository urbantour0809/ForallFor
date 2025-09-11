/**
 * TestDescription 컴포넌트
 * 
 * 코딩 테스트의 상세 정보를 표시하는 컴포넌트입니다.
 * 5개 문제로 구성된 테스트를 네비게이션할 수 있습니다.
 * 
 * 주요 기능:
 * - 5개 문제 네비게이션 (좌/우 화살표 + 문제 버튼)
 * - 각 문제별 통과/불통과 상태 표시
 * - 문제 설명, 예제, 제약조건 표시
 * - 반응형 디자인 지원
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShare, 
  FaBookmark, 
  FaThumbsUp,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaTimes,
  FaCircle
} from 'react-icons/fa';
import { useApiConnection } from '../hooks/useApi';
import '../styles/style.css';

function TestDescription({ 
  testProblems = [],
  currentProblemIndex = 0,
  onProblemChange,
  problemResults = [],
  submittedProblems = [],
  lockedProblems = [],
  className = '',
  style = {},
  onBookmark,
  onShare,
  isBookmarked = false,
  problemPanelWidth = 350
}) {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    examples: true,
    constraints: true,
    hints: false
  });

  // API 연결 상태 확인
  const { isConnected, checkConnection } = useApiConnection();

  useEffect(() => {
    // 컴포넌트 마운트 시 연결 상태 확인
    checkConnection();
  }, [checkConnection]);

  // 현재 문제 데이터
  const currentProblem = testProblems[currentProblemIndex] || {
    id: 1,
    title: "문제를 불러오는 중...",
    difficulty: "Medium",
    description: "테스트 문제를 불러오고 있습니다.",
    examples: [],
    constraints: [],
    hints: [],
    tags: [],
    category: "Test",
    timeLimit: "1분",
    memoryLimit: "256MB",
    acceptanceRate: 0,
    submissions: 0,
    accepted: 0
  };

  // 문제 네비게이션 핸들러
  const handleProblemNavigation = (direction) => {
    const findPrevUnlocked = () => {
      for (let i = currentProblemIndex - 1; i >= 0; i--) {
        if (!lockedProblems[i]) return i;
      }
      return -1;
    };

    const findNextUnlocked = () => {
      for (let i = currentProblemIndex + 1; i < testProblems.length; i++) {
        if (!lockedProblems[i]) return i;
      }
      return -1;
    };

    if (direction === 'prev') {
      const prev = findPrevUnlocked();
      if (prev >= 0) {
        onProblemChange && onProblemChange(prev);
      } else {
        alert('이미 제출한 문제로는 돌아갈 수 없습니다.');
      }
    } else if (direction === 'next') {
      const next = findNextUnlocked();
      if (next >= 0) {
        onProblemChange && onProblemChange(next);
      } else {
        alert('이동할 수 있는 다음 문제가 없습니다.');
      }
    }
  };

  // 직접 문제 선택
  const handleDirectProblemSelect = (index) => {
    if (index !== currentProblemIndex && onProblemChange) {
      onProblemChange(index);
    }
  };

  // 패널 크기에 따른 반응형 디자인 계산
  const getResponsiveStyles = () => {
    // 패널 크기에 따른 문제 버튼 크기 계산
    let buttonSize = 'w-12 h-12'; // 기본 크기
    let buttonTextSize = 'text-xs';
    let navigationPadding = 'p-4';
    let buttonGap = 'gap-2'; // Changed from buttonSpacing
    let showProgressBar = true;
    let compactMode = false;
    let navigationMode = 'wide-mode';

    // 280px~499px 범위를 더 세밀하게 분할
    if (problemPanelWidth <= 280) {
      // 매우 좁은 패널 (≤280px)
      buttonSize = 'w-8 h-8';
      buttonTextSize = 'text-[10px]';
      navigationPadding = 'p-2';
      buttonGap = 'gap-1'; // Changed
      showProgressBar = false;
      compactMode = true;
      navigationMode = 'compact-mode';
    } else if (problemPanelWidth <= 300) {
      // 매우 좁은 패널 (280px~300px)
      buttonSize = 'w-9 h-9';
      buttonTextSize = 'text-[11px]';
      navigationPadding = 'p-2.5';
      buttonGap = 'gap-1'; // Changed
      showProgressBar = false;
      compactMode = true;
      navigationMode = 'compact-mode';
    } else if (problemPanelWidth <= 320) {
      // 좁은 패널 (300px~320px)
      buttonSize = 'w-10 h-10';
      buttonTextSize = 'text-xs';
      navigationPadding = 'p-3';
      buttonGap = 'gap-1.5'; // Changed
      showProgressBar = true;
      compactMode = true;
      navigationMode = 'narrow-mode';
    } else if (problemPanelWidth <= 350) {
      // 중간-좁은 패널 (320px~350px)
      buttonSize = 'w-11 h-11';
      buttonTextSize = 'text-xs';
      navigationPadding = 'p-3';
      buttonGap = 'gap-1.5'; // Changed
      showProgressBar = true;
      compactMode = false;
      navigationMode = 'narrow-mode';
    } else if (problemPanelWidth <= 380) {
      // 중간 패널 (350px~380px)
      buttonSize = 'w-11 h-11';
      buttonTextSize = 'text-xs';
      navigationPadding = 'p-3.5';
      buttonGap = 'gap-2'; // Changed
      showProgressBar = true;
      compactMode = false;
      navigationMode = 'medium-mode';
    } else if (problemPanelWidth <= 420) {
      // 중간-넓은 패널 (380px~420px)
      buttonSize = 'w-12 h-12';
      buttonTextSize = 'text-xs';
      navigationPadding = 'p-3.5';
      buttonGap = 'gap-2'; // Changed
      showProgressBar = true;
      compactMode = false;
      navigationMode = 'medium-mode';
    } else if (problemPanelWidth <= 499) {
      // 넓은 패널 (420px~499px)
      buttonSize = 'w-12 h-12';
      buttonTextSize = 'text-xs';
      navigationPadding = 'p-4';
      buttonGap = 'gap-2'; // Changed
      showProgressBar = true;
      compactMode = false;
      navigationMode = 'wide-mode';
    } else {
      // 매우 넓은 패널 (≥500px)
      buttonSize = 'w-12 h-12';
      buttonTextSize = 'text-xs';
      navigationPadding = 'p-4';
      buttonGap = 'gap-2'; // Changed
      showProgressBar = true;
      compactMode = false;
      navigationMode = 'wide-mode';
    }

    return {
      buttonSize,
      buttonTextSize,
      navigationPadding,
      buttonGap, // Changed
      showProgressBar,
      compactMode,
      navigationMode
    };
  };

  const responsiveStyles = getResponsiveStyles();

  // 문제 상태 가져오기
  const getProblemStatus = (index) => {
    const result = problemResults[index];
    if (!result) return submittedProblems[index] ? 'submitted' : 'pending';
    return result.passed ? 'passed' : 'failed';
  };

  // 문제 상태별 아이콘
  const getProblemStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <FaCheck className="text-green-400" />;
      case 'failed':
        return <FaTimes className="text-red-400" />;
      case 'submitted':
        return <FaCircle className="text-blue-400" />;
      default:
        return <FaCircle className="text-gray-400" />;
    }
  };

  // 문제 상태별 색상
  const getProblemStatusColor = (status, isActive) => {
    if (isActive) {
      return 'bg-blue-500/30 text-blue-400 border-blue-400';
    }
    
    switch (status) {
      case 'passed':
        return 'bg-green-500/20 text-green-400 border-green-400 hover:bg-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-400 hover:bg-red-500/30';
      case 'submitted':
        return 'bg-blue-500/20 text-blue-400 border-blue-400 hover:bg-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400 hover:bg-gray-500/30';
    }
  };

  // 난이도별 색상
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'hard': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  // 섹션 토글
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 북마크 핸들러
  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(currentProblem.id);
    }
  };

  // 공유 핸들러
  const handleShare = () => {
    if (onShare) {
      onShare(currentProblem);
    } else {
      // 기본 공유 기능
      if (navigator.share) {
        navigator.share({
          title: currentProblem.title,
          text: `${currentProblem.title} - 코딩 테스트 문제`,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        console.log('URL copied to clipboard');
      }
    }
  };

  return (
    <div className={`h-full overflow-y-auto ${className}`} style={style}>
      <div className="p-4 space-y-4">
        
        {/* 헤더 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProblemIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* 제목 및 난이도 */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 
                  className="text-lg md:text-xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  문제 {currentProblemIndex + 1}: {currentProblem.title}
                </h1>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentProblem.difficulty)}`}>
                    {currentProblem.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <FaThumbsUp />
                    <span>{currentProblem.acceptanceRate}% 정답률</span>
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center space-x-2">
                {/* API 연결 상태 표시 */}
                <div className="flex items-center space-x-1 px-2 py-1 rounded text-xs">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {isConnected ? 'AI 연결됨' : 'AI 연결 안됨'}
                  </span>
                </div>

                <motion.button
                  onClick={handleBookmark}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'glass-effect hover:bg-white/10'
                  }`}
                  style={{ color: isBookmarked ? '#fbbf24' : 'var(--text-secondary)' }}
                  title="북마크"
                >
                  <FaBookmark className="text-sm" />
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg glass-effect hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  title="공유"
                >
                  <FaShare className="text-sm" />
                </motion.button>
              </div>
            </div>

            {/* 문제 네비게이션 */}
            <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`test-navigation glass-effect rounded-lg ${responsiveStyles.navigationPadding} ${responsiveStyles.navigationMode}`}
            >
            <div className="flex items-center justify-between w-full">
                {/* 왼쪽 화살표 */}
                <motion.button
                onClick={() => handleProblemNavigation('prev')}
                disabled={currentProblemIndex === 0}
                whileHover={currentProblemIndex > 0 ? { scale: 1.05 } : {}}
                whileTap={currentProblemIndex > 0 ? { scale: 0.95 } : {}}
                className={`${responsiveStyles.compactMode ? 'p-1' : 'p-2'} rounded-lg transition-colors flex-shrink-0 ${
                    currentProblemIndex === 0 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-blue-400 hover:bg-blue-500/20'
                }`}
                aria-label="이전 문제"
                >
                <FaChevronLeft className={responsiveStyles.compactMode ? 'text-sm' : 'text-lg'} />
                </motion.button>

                {/* 문제 버튼들 */}
                <div className={`flex items-center ${responsiveStyles.buttonGap} flex-1 justify-center min-w-0`}>
                {Array.from({ length: 5 }).map((_, index) => {
                    const status = getProblemStatus(index);
                    const isActive = index === currentProblemIndex;
                    const isLocked = lockedProblems[index];
                    
                    return (
                    <motion.button
                        key={index}
                        onClick={() => {
                          if (isLocked) {
                            alert('이미 제출한 문제입니다. 다시 돌아갈 수 없습니다.');
                            return;
                          }
                          handleDirectProblemSelect(index);
                        }}
                        disabled={isLocked}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`problem-btn flex items-center justify-center ${responsiveStyles.buttonSize} rounded-lg border-2 transition-all flex-grow basis-0 ${
                        getProblemStatusColor(status, isActive)
                        } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                        aria-label={`문제 ${index + 1}`}
                    >
                        <div className="flex flex-col items-center justify-between w-full h-full py-1">
                        <span className={`${responsiveStyles.buttonTextSize} font-bold leading-none`}>{index + 1}</span>
                        <div className={`${responsiveStyles.buttonTextSize} leading-none`}>
                            {getProblemStatusIcon(status)}
                        </div>
                        </div>
                    </motion.button>
                    );
                })}
                </div>

                {/* 오른쪽 화살표 */}
                <motion.button
                onClick={() => handleProblemNavigation('next')}
                disabled={currentProblemIndex === testProblems.length - 1}
                whileHover={currentProblemIndex < testProblems.length - 1 ? { scale: 1.05 } : {}}
                whileTap={currentProblemIndex < testProblems.length - 1 ? { scale: 0.95 } : {}}
                className={`${responsiveStyles.compactMode ? 'p-1' : 'p-2'} rounded-lg transition-colors flex-shrink-0 ${
                    currentProblemIndex === testProblems.length - 1
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-blue-400 hover:bg-blue-500/20'
                }`}
                aria-label="다음 문제"
                >
                <FaChevronRight className={responsiveStyles.compactMode ? 'text-sm' : 'text-lg'} />
                </motion.button>
            </div>

            {/* 진행률 표시 */}
            {responsiveStyles.showProgressBar && (
                <div className={`${responsiveStyles.compactMode ? 'mt-2' : 'mt-3'}`}>
                    <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                    <span>진행률</span>
                    <span>{currentProblemIndex + 1}/5</span>
                    </div>
                    <div className="w-full bg-gray-500/20 rounded-full h-2">
                    <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentProblemIndex + 1) / 5) * 100}%` }}
                    />
                    </div>
                </div>
            )}
            </motion.div>

            {/* 메타 정보 */}
            <div className="grid grid-cols-2 gap-3 p-3 glass-effect rounded-lg">
              <div className="text-center">
                <div className="text-sm font-bold gradient-text">{currentProblem.submissions?.toLocaleString()}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>제출 수</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold gradient-text">{currentProblem.accepted?.toLocaleString()}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>정답 수</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold gradient-text">{currentProblem.timeLimit}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>시간 제한</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold gradient-text">{currentProblem.memoryLimit}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>메모리 제한</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 문제 설명 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`desc-${currentProblemIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-lg"
          >
            <button
              onClick={() => toggleSection('description')}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                문제 설명
              </h2>
              {expandedSections.description ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            
            {expandedSections.description && (
              <div 
                className="px-4 pb-4 prose prose-invert max-w-none"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div 
                  className="leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: currentProblem.description.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary)">$1</strong>')
                  }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 힌트 */}
        {currentProblem.hints && currentProblem.hints.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`hints-${currentProblemIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-lg"
            >
              <button
                onClick={() => toggleSection('hints')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  힌트 ({currentProblem.hints.length}개)
                </h2>
                {expandedSections.hints ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.hints && (
                <div className="px-4 pb-4">
                  <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {currentProblem.hints.map((hint, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">{index + 1}.</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default TestDescription;
