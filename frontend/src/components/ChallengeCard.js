/**
 * ChallengeCard 컴포넌트
 * 
 * 개별 챌린지 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * 
 * Props:
 * - challenge: 챌린지 데이터 객체
 * - index: 애니메이션 지연을 위한 인덱스
 * - onChallengeClick: 챌린지 클릭 시 호출되는 함수 (선택적)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaClock, FaCode, FaUsers } from 'react-icons/fa';

function ChallengeCard({ challenge, index = 0, onChallengeClick }) {
  const navigate = useNavigate();

  /**
   * 난이도에 따른 색상 클래스 반환
   */
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
      case 'easy':
        return 'text-green-400 bg-green-500/10';
      case 'intermediate':
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'advanced':
      case 'hard':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  /**
   * 난이도 텍스트 반환
   */
  const getDifficultyText = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
      case 'easy':
        return '초급';
      case 'intermediate':
      case 'medium':
        return '중급';
      case 'advanced':
      case 'hard':
        return '고급';
      default:
        return '미지정';
    }
  };

  /**
   * 카드 클릭 핸들러
   */
  const handleCardClick = () => {
    if (onChallengeClick) {
      onChallengeClick(challenge);
    }
  };

  /**
   * 도전하기 버튼 클릭 핸들러
   */
  const handleChallengeStart = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    // ProblemSolver 페이지로 이동
    navigate(`/problem-solver/${challenge.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.15 }
      }}
      className="glass-effect rounded-3xl p-6 group cursor-pointer gpu-accelerated"
      onClick={handleCardClick}
    >
      {/* 카드 헤더 - 제목, 난이도, 언어, 포인트 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* 챌린지 제목 */}
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {challenge.title}
          </h3>
          
          {/* 난이도와 언어 태그 */}
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
              {getDifficultyText(challenge.difficulty)}
            </span>
            <span className="px-2 py-1 text-xs rounded-full glass-effect" style={{ color: 'var(--text-secondary)' }}>
              {challenge.language}
            </span>
          </div>
        </div>

        {/* 포인트 표시 */}
        <div className="text-right">
          <div className="text-2xl font-bold gradient-text">{challenge.points}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>포인트</div>
        </div>
      </div>

      {/* 챌린지 설명 */}
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        {challenge.description}
      </p>

      {/* 태그들 */}
      <div className="flex flex-wrap gap-1 mb-4">
        {challenge.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs rounded glass-effect"
            style={{ color: 'var(--text-secondary)' }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 하단 정보 - 예상 시간과 완료자 수 */}
      <div className="flex items-center justify-between mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center space-x-1">

          <FaTrophy />
          <span>{challenge.completed}명 완료</span>
        </div>
      </div>

      {/* 도전하기 버튼 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full btn-primary py-3 rounded-xl font-semibold"
        onClick={handleChallengeStart}
        aria-label={`${challenge.title} 챌린지 시작하기`}
      >
        도전하기
      </motion.button>
    </motion.div>
  );
}

export default ChallengeCard; 