/**
 * LanguageCard 컴포넌트
 * 
 * 프로그래밍 언어 정보를 표시하는 재사용 가능한 카드 컴포넌트입니다.
 * 다양한 스타일과 레이아웃을 지원하여 메인 페이지와 언어 페이지에서 모두 사용 가능합니다.
 * 
 * 주요 기능:
 * - 두 가지 카드 유형 지원 (simple, detailed)
 * - 언어 로고, 이름, 설명, 난이도, 인기도 표시
 * - 반응형 디자인 및 호버 애니메이션
 * - 접근성 고려 (키보드 네비게이션, 스크린 리더 지원)
 * - Framer Motion 애니메이션 통합
 * 
 * @component
 * @example
 * // 간단한 카드 (메인 페이지용)
 * <LanguageCard 
 *   language={languageData} 
 *   variant="simple" 
 *   index={0}
 * />
 * 
 * // 상세 카드 (언어 페이지용)
 * <LanguageCard 
 *   language={languageData} 
 *   variant="detailed" 
 *   index={0}
 *   showFeatures={true}
 *   showActions={true}
 * />
 */

import React from 'react';
import { motion } from 'framer-motion';
import { getDifficultyColor, getDifficultyText } from '../data/languageData';

/**
 * LanguageCard 컴포넌트 Props
 * 
 * @typedef {Object} LanguageCardProps
 * @property {Object} language - 언어 데이터 객체
 * @property {'simple'|'detailed'} variant - 카드 유형 (기본값: 'simple')
 * @property {number} index - 애니메이션 지연을 위한 인덱스
 * @property {boolean} showFeatures - 특징 태그 표시 여부 (detailed 모드 전용)
 * @property {boolean} showActions - 액션 버튼 표시 여부 (detailed 모드 전용)
 * @property {function} onClick - 클릭 이벤트 핸들러
 * @property {Object} customStyle - 추가 스타일 객체
 * @property {string} className - 추가 CSS 클래스
 */

function LanguageCard({ 
  language, 
  variant = 'simple', 
  index = 0,
  showFeatures = false,
  showActions = false,
  onClick,
  customStyle = {},
  className = '' 
}) {
  /**
   * 카드 클릭 핸들러
   * 외부에서 전달된 onClick 함수 실행 또는 기본 동작
   */
  const handleCardClick = () => {
    if (onClick) {
      onClick(language);
    } else {
      // 기본 동작: 언어 상세 페이지로 이동
      console.log(`Navigate to ${language.name} details`);
    }
  };

  /**
   * 키보드 접근성을 위한 엔터/스페이스 키 핸들러
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  // 애니메이션 설정
  const cardAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.1, duration: 0.6 },
    whileHover: variant === 'simple' ? {
      y: -10,
      rotateY: 15,
      rotateX: 5,
      transition: { duration: 0.15 }
    } : {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.15 }
    },
    whileTap: { scale: 0.95 }
  };

  // 간단한 카드 렌더링 (메인 페이지용)
  if (variant === 'simple') {
    return (
      <motion.div
        {...cardAnimation}
        onClick={handleCardClick}
        onKeyPress={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-label={`${language.name} 언어 상세 보기`}
        className={`floating-card language-card glass-effect rounded-2xl p-6 text-center ${language.bgColor} group cursor-pointer gpu-accelerated ${className}`}
        style={customStyle}
      >
        {/* 언어 로고 */}
        <div className="mb-4 flex justify-center">
          <img 
            src={language.logo} 
            alt={`${language.name} 로고`}
            className="language-logo w-12 h-12 object-contain"
            loading="lazy"
          />
        </div>
        
        {/* 언어 이름 */}
        <h3 className="text-lg font-semibold mb-2 transition-colors" style={{ color: 'var(--text-primary)' }}>
          {language.name}
        </h3>
        
        {/* 언어 설명 */}
        <p className="text-sm text-center transition-colors" style={{ color: 'var(--text-secondary)' }}>
          {language.description}
        </p>

        {/* 호버 시 표시되는 추가 정보 */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            자세히 보기 →
          </div>
        </div>
      </motion.div>
    );
  }

  // 상세 카드 렌더링 (언어 페이지용)
  return (
    <motion.div
      {...cardAnimation}
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`${language.name} 언어 상세 정보`}
      className={`language-card glass-effect rounded-3xl p-8 ${language.bgColor} group cursor-pointer gpu-accelerated flex flex-col h-full ${className}`}
      style={customStyle}
    >
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img 
            src={language.logo} 
            alt={`${language.name} 로고`}
            className="w-12 h-12 object-contain"
            loading="lazy"
          />
          <div>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {language.name}
            </h3>
          </div>
        </div>
      </div>

      {/* 설명 */}
      <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
        {language.description}
      </p>

      {/* 특징 태그들 (옵션) */}
      {showFeatures && language.features && (
        <div className="flex flex-wrap gap-2 mb-6">
          {language.features.map((feature, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-sm rounded-full glass-effect text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              {feature}
            </span>
          ))}
        </div>
      )}

      {/* 액션 버튼들 (옵션) - 하단에 고정 */}
      {showActions && (
        <div className="mt-auto">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 btn-primary py-3 rounded-xl font-semibold"
              aria-label={`${language.name} 학습하기`}
            >
              학습하기
            </motion.button>
          </div>
        </div>
      )}

      {/* 호버 시 표시되는 추가 정보 */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4 text-center">
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          클릭하여 더 자세히 알아보기 →
        </div>
      </div>
    </motion.div>
  );
}

/**
 * LanguageCardGrid 컴포넌트
 * 
 * 여러 언어 카드를 그리드 레이아웃으로 표시하는 컨테이너 컴포넌트
 * 반응형 그리드를 제공하고 각 카드에 적절한 애니메이션을 적용
 * 
 * @component
 * @example
 * <LanguageCardGrid 
 *   languages={languagesData}
 *   variant="simple"
 *   gridCols="grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
 * />
 */
export function LanguageCardGrid({ 
  languages, 
  variant = 'simple',
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  showFeatures = false,
  showActions = false,
  onCardClick,
  className = ''
}) {
  return (
    <div className={`grid ${gridCols} gap-6 ${className}`}>
      {languages.map((language, index) => (
        <LanguageCard
          key={language.id || language.name}
          language={language}
          variant={variant}
          index={index}
          showFeatures={showFeatures}
          showActions={showActions}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}

export default LanguageCard; 