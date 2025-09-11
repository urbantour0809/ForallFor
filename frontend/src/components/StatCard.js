/**
 * StatCard 컴포넌트
 * 
 * 통계 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트입니다.
 * 숫자, 설명, 아이콘 등을 포함하여 시각적으로 매력적인 통계 카드를 생성합니다.
 * 
 * Props:
 * - value: 표시할 수치 값 (필수)
 * - label: 수치에 대한 설명 라벨 (필수)
 * - icon: 아이콘 컴포넌트 (선택)
 * - suffix: 수치 뒤에 붙을 단위 (선택, 예: '%', '개', '명')
 * - color: 수치의 색상 ('gradient' | 'blue' | 'green' | 'purple' | 'orange') (선택)
 * - size: 카드 크기 ('sm' | 'md' | 'lg') (선택)
 * - className: 추가 CSS 클래스 (선택)
 * - animated: 카운트업 애니메이션 여부 (선택, 기본값: true)
 * - delay: 애니메이션 지연 시간 (선택, 기본값: 0)
 * 
 * 사용 예시:
 * <StatCard 
 *   value="98"
 *   suffix="%"
 *   label="강의 1개 이상 완주율"
 *   icon={<FaTrophy />}
 *   color="gradient"
 *   animated={true}
 * />
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function StatCard({ 
  value, 
  label, 
  icon, 
  suffix = '', 
  color = 'gradient',
  size = 'md',
  className = '',
  animated = true,
  delay = 0 
}) {
  const [displayValue, setDisplayValue] = useState(0);

  /**
   * 색상에 따른 텍스트 클래스 반환
   * @param {string} color - 색상 문자열
   * @returns {string} CSS 클래스 문자열
   */
  const getColorClass = (color) => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      case 'purple': return 'text-purple-400';
      case 'orange': return 'text-orange-400';
      case 'red': return 'text-red-400';
      case 'gradient':
      default: return 'gradient-text';
    }
  };

  /**
   * 크기에 따른 스타일 클래스 반환
   * @param {string} size - 크기 문자열
   * @returns {object} 스타일 객체
   */
  const getSizeStyles = (size) => {
    switch (size) {
      case 'sm': 
        return {
          textSize: 'text-2xl',
          iconSize: 'text-lg',
          labelSize: 'text-xs',
          padding: 'p-4'
        };
      case 'lg': 
        return {
          textSize: 'text-5xl',
          iconSize: 'text-2xl',
          labelSize: 'text-base',
          padding: 'p-8'
        };
      case 'md':
      default: 
        return {
          textSize: 'text-3xl',
          iconSize: 'text-xl',
          labelSize: 'text-sm',
          padding: 'p-6'
        };
    }
  };

  const sizeStyles = getSizeStyles(size);

  /**
   * 숫자인지 확인하는 함수
   * @param {any} val - 확인할 값
   * @returns {boolean} 숫자 여부
   */
  const isNumeric = (val) => {
    return !isNaN(parseFloat(val)) && isFinite(val);
  };

  /**
   * 카운트업 애니메이션 효과
   * 컴포넌트가 마운트되면 0부터 목표값까지 애니메이션
   */
  useEffect(() => {
    if (!animated || !isNumeric(value)) {
      setDisplayValue(value);
      return;
    }

    const timer = setTimeout(() => {
      const numericValue = parseFloat(value);
      const duration = 2000; // 2초
      const steps = 60; // 60프레임
      const increment = numericValue / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(numericValue);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, animated, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay / 1000,
        type: "spring",
        bounce: 0.3
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className={`
        text-center glass-effect rounded-2xl 
        ${sizeStyles.padding} 
        ${className}
        group cursor-default
      `}
    >
      {/* 아이콘 (있는 경우) */}
      {icon && (
        <motion.div 
          className={`${sizeStyles.iconSize} mb-3 inline-block opacity-70`}
          style={{ color: 'var(--text-secondary)' }}
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ delay: delay / 1000 + 0.3 }}
          whileHover={{ rotate: 5, scale: 1.1 }}
        >
          {icon}
        </motion.div>
      )}

      {/* 수치 값 */}
      <motion.div 
        className={`${sizeStyles.textSize} font-bold mb-2 ${getColorClass(color)}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: delay / 1000 + 0.2, 
          type: "spring", 
          bounce: 0.5 
        }}
      >
        {isNumeric(displayValue) ? Math.floor(displayValue) : displayValue}
        {suffix && (
          <span className="ml-1 opacity-80">
            {suffix}
          </span>
        )}
      </motion.div>

      {/* 라벨 */}
      <motion.div 
        className={`${sizeStyles.labelSize} leading-relaxed`}
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay / 1000 + 0.4 }}
      >
        {label}
      </motion.div>

      {/* 호버 시 나타나는 강조 효과 */}
      <motion.div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${
            color === 'gradient' ? 'var(--accent-primary)' : 'currentColor'
          }/5, transparent)`
        }}
      />
    </motion.div>
  );
}

export default StatCard; 