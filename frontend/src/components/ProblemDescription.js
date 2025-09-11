/**
 * ProblemDescription 컴포넌트
 *
 * 코딩 문제의 상세 정보를 표시하는 컴포넌트입니다.
 * LeetCode, 백준 등의 온라인 저지 스타일을 참고하여 제작했습니다.
 *
 * 주요 기능:
 * - 문제 제목 및 난이도 표시
 * - 문제 설명 렌더링 (Markdown 지원)
 * - 힌트 제공
 * - 태그 및 카테고리 표시
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaTag,
  FaThumbsUp,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { useApiConnection } from '../hooks/useApi';
import '../styles/style.css';

// 🎯 언어 이미지들 import (Challenges.js와 동일)
import javaLogo from '../assets/images/java.png';
import pythonLogo from '../assets/images/python.png';
import javascriptLogo from '../assets/images/javascript.png';
import cLogo from '../assets/images/c.png';
import cppLogo from '../assets/images/c++.png';
import rustLogo from '../assets/images/rust.png';
import goLogo from '../assets/images/go.png';

function ProblemDescription({
                              problem,
                              className = '',
                              style = {},
                              onBookmark,
                              onShare,
                              isBookmarked = false
                            }) {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    hints: false
  });

  // 🎯 언어별 아이콘 매핑 (Challenges.js와 동일)
  const languageIcons = {
    'Java': javaLogo,
    'Python': pythonLogo,
    'JavaScript': javascriptLogo,
    'C': cLogo,
    'C++': cppLogo,
    'Rust': rustLogo,
    'Go': goLogo
  };

  // API 연결 상태 확인
  const { isConnected, checkConnection } = useApiConnection();

  useEffect(() => {
    // 컴포넌트 마운트 시 연결 상태 확인
    checkConnection();
  }, [checkConnection]);

  // 기본 문제 데이터 (props로 전달되지 않은 경우)
  const defaultProblem = {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: `주어진 정수 배열에서 두 수를 선택하여 목표값과 같아지는 인덱스를 반환하는 문제입니다.

**문제 설명:**
- 정수 배열 \`nums\`와 정수 \`target\`이 주어집니다.
- 배열에서 두 수를 더해서 \`target\`이 되는 두 수의 인덱스를 반환하세요.
- 각 입력에 대해 **정확히 하나의 해**가 존재한다고 가정할 수 있습니다.
- 같은 원소를 두 번 사용할 수 없습니다.`,
    hints: [
      "브루트 포스 방법으로 O(n²) 시간에 해결할 수 있습니다."
    ],
    tags: ["Array", "Hash Table", "Two Pointers"],
    category: "Algorithm",
    acceptanceRate: 85.2,
    submissions: 2847392,
    accepted: 2424751
  };

  const problemData = problem || defaultProblem;

  // 난이도별 색상
  const getDifficultyColor = (difficulty) => {
    // 한국어 난이도 처리
    switch (difficulty) {
      case '초급':
      case 'easy':
        return 'text-green-400 bg-green-500/10';
      case '중급':
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10';
      case '고급':
      case 'hard':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  // 난이도별 인라인 스타일 (Tailwind CSS 문제 대비)
  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case '초급':
      case 'easy':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          color: '#4ade80'
        };
      case '중급':
      case 'medium':
        return {
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          color: '#eab308'
        };
      case '고급':
      case 'hard':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#f87171'
        };
      default:
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          color: '#9ca3af'
        };
    }
  };

  // 섹션 토글
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
      <div className={`h-full overflow-y-auto ${className}`} style={style}>
        <div className="p-4 space-y-4">
          {/* 헤더 */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
          >
            {/* 제목 및 난이도 */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1
                    className="text-lg md:text-xl font-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                >
                  {problemData.title}
                </h1>
                <div className="flex items-center space-x-3">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problemData.difficulty)}`}
                    style={getDifficultyStyle(problemData.difficulty)}
                >
                  {problemData.difficulty}
                </span>

                  {/* 🎯 언어 아이콘 추가 */}
                  {problemData.language && languageIcons[problemData.language] && (
                      <img
                          src={languageIcons[problemData.language]}
                          alt={`${problemData.language} 로고`}
                          className="w-4 h-4 object-contain"
                          loading="lazy"
                      />
                  )}

                  <div className="flex items-center space-x-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <FaThumbsUp />
                    <span>{problemData.acceptanceRate}% 정답률</span>
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
              </div>
            </div>

            {/* 메타 정보 */}
            <div className="grid grid-cols-2 gap-3 p-3 glass-effect rounded-lg">
              <div className="text-center">
                <div className="text-sm font-bold gradient-text">{problemData.submissions?.toLocaleString()}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>제출 수</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold gradient-text">{problemData.accepted?.toLocaleString()}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>정답 수</div>
              </div>
            </div>


            {/* 문제 설명 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                          __html: problemData.description.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary)">$1</strong>')
                        }}
                    />
                  </div>
              )}
            </motion.div>

            {/* 힌트 */}
            {problemData.hints && problemData.hints.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-effect rounded-lg"
                >
                  <button
                      onClick={() => toggleSection('hints')}
                      className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      힌트 ({problemData.hints.length}개)
                    </h2>
                    {expandedSections.hints ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {expandedSections.hints && (
                      <div className="px-4 pb-4">
                        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {problemData.hints.map((hint, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-green-400 mt-1">{index + 1}.</span>
                                <span>{hint}</span>
                              </li>
                          ))}
                        </ul>
                      </div>
                  )}
                </motion.div>
            )}
          </motion.div>
        </div>
      </div>
  );
}

export default ProblemDescription; 