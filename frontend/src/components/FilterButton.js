/**
 * FilterButton 컴포넌트
 * 
 * 필터링 기능을 위한 재사용 가능한 버튼 컴포넌트입니다.
 * 선택된 상태와 비선택된 상태에 따라 다른 스타일을 적용하며,
 * 부드러운 호버 및 클릭 애니메이션을 제공합니다.
 * 
 * Props:
 * - children: 버튼 내부 컨텐츠 (필수)
 * - isSelected: 선택 상태 (필수)
 * - onClick: 클릭 핸들러 (필수)
 * - icon: 아이콘 컴포넌트 (선택)
 * - variant: 버튼 스타일 변형 ('default' | 'primary' | 'secondary') (선택)
 * - size: 버튼 크기 ('sm' | 'md' | 'lg') (선택)
 * - className: 추가 CSS 클래스 (선택)
 * - disabled: 비활성화 상태 (선택)
 * 
 * 사용 예시:
 * <FilterButton 
 *   isSelected={selectedCategory === 'all'}
 *   onClick={() => setSelectedCategory('all')}
 *   icon={<FaFilter />}
 * >
 *   전체
 * </FilterButton>
 */

import React from 'react';
import { motion } from 'framer-motion';

function FilterButton({ 
  children, 
  isSelected, 
  onClick, 
  icon, 
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false 
}) {
  /**
   * 크기에 따른 패딩 클래스 반환
   * @param {string} size - 크기 문자열
   * @returns {string} 패딩 CSS 클래스
   */
  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-sm';
      case 'md': return 'px-4 py-2 text-sm';
      case 'lg': return 'px-6 py-3 text-base';
      default: return 'px-4 py-2 text-sm';
    }
  };

  /**
   * 변형에 따른 스타일 클래스 반환
   * @param {string} variant - 변형 문자열
   * @param {boolean} isSelected - 선택 상태
   * @returns {string} 스타일 CSS 클래스
   */
  const getVariantClasses = (variant, isSelected) => {
    const baseClasses = 'transition-all duration-200 rounded-lg font-medium';
    
    if (disabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed glass-effect`;
    }

    switch (variant) {
      case 'primary':
        return isSelected 
          ? `${baseClasses} btn-primary shadow-lg scale-105`
          : `${baseClasses} glass-effect border border-transparent hover:border-blue-500/50`;
      
      case 'secondary':
        return isSelected
          ? `${baseClasses} bg-purple-500/20 border-2 border-purple-500 text-purple-400`
          : `${baseClasses} glass-effect border border-transparent hover:border-purple-500/50`;
      
      default:
        return isSelected 
          ? `${baseClasses} glass-effect border-2 border-blue-500 shadow-lg`
          : `${baseClasses} glass-effect border border-transparent hover:border-gray-500/50`;
    }
  };

  /**
   * 버튼 클릭 핸들러
   */
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        ${getSizeClasses(size)} 
        ${getVariantClasses(variant, isSelected)}
        ${className}
        ${disabled ? '' : 'cursor-pointer'}
      `}
      style={{ 
        color: disabled 
          ? 'var(--text-disabled)' 
          : isSelected 
            ? 'var(--text-primary)' 
            : 'var(--text-secondary)' 
      }}
      disabled={disabled}
      // 접근성을 위한 aria 속성
      aria-pressed={isSelected}
      aria-disabled={disabled}
    >
      <div className="flex items-center justify-center space-x-2">
        {/* 아이콘 */}
        {icon && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        
        {/* 텍스트 콘텐츠 */}
        <span className="whitespace-nowrap">
          {children}
        </span>
      </div>

      {/* 선택된 상태 표시 인디케이터 */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
          style={{ 
            boxShadow: '0 0 0 2px var(--bg-primary)' 
          }}
        />
      )}
    </motion.button>
  );
}

export default FilterButton; 