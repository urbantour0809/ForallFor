/**
 * PageHeader 컴포넌트
 * 
 * 모든 페이지에서 사용할 수 있는 재사용 가능한 헤더 컴포넌트입니다.
 * 제목, 부제목, 설명을 포함하며, 일관된 애니메이션과 스타일을 제공합니다.
 * 
 * Props:
 * - title: 메인 제목 (필수)
 * - subtitle: 부제목 (선택)
 * - description: 설명 텍스트 (필수)
 * - className: 추가 CSS 클래스 (선택)
 * - titleClassName: 제목 전용 CSS 클래스 (선택)
 * - descriptionClassName: 설명 전용 CSS 클래스 (선택)
 * 
 * 사용 예시:
 * <PageHeader 
 *   title="Coding Challenges"
 *   description="실전 코딩 문제를 통해 실력을 향상시키고 개발자로서 성장해보세요."
 * />
 */

import React from 'react';
import { motion } from 'framer-motion';

function PageHeader({ 
  title, 
  subtitle, 
  description, 
  className = "text-center mb-12 lg:mb-16",
  titleClassName = "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 gradient-text",
  descriptionClassName = "text-lg sm:text-xl lg:text-2xl max-w-2xl lg:max-w-3xl mx-auto mt-4 lg:mt-6"
}) {
  /**
   * 헤더 애니메이션 설정
   * 페이지 진입 시 부드럽게 나타나는 효과
   */
  const headerAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const titleAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 }
  };

  const descriptionAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.4 }
  };

  return (
    <motion.div
      {...headerAnimation}
      className={className}
    >
      {/* 메인 제목 */}
      <motion.h1 
        {...titleAnimation}
        className={titleClassName}
        style={{ 
          lineHeight: '1.2',
          paddingTop: '0.2em',
          paddingBottom: '0.2em'
        }}
      >
        {title}
        {subtitle && (
          <motion.span 
            className="block text-sm md:text-lg font-normal mt-2"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {subtitle}
          </motion.span>
        )}
      </motion.h1>
      
      {/* 설명 텍스트 */}
      <motion.p 
        {...descriptionAnimation}
        className={descriptionClassName}
        style={{ 
          color: 'var(--text-secondary)',
          lineHeight: '1.6'
        }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}

export default PageHeader; 