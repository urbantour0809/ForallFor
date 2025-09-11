/**
 * ScrollingTags 컴포넌트
 * 
 * 무한 스크롤 태그 애니메이션을 제공하는 컴포넌트입니다.
 * 제공된 태그 배열을 좌우로 흘려보내는 시각적 효과를 만듭니다.
 * 
 * Props:
 * - tags: 태그 문자열 배열 (필수)
 * - direction: 스크롤 방향 ('left' | 'right') (선택, 기본값: 'left')
 * - speed: 애니메이션 속도 (초 단위) (선택, 기본값: 20)
 * - height: 컨테이너 높이 (선택, 기본값: '80px')
 * - className: 추가 CSS 클래스 (선택)
 * - tagClassName: 개별 태그 CSS 클래스 (선택)
 * - pauseOnHover: 호버 시 애니메이션 일시정지 여부 (선택, 기본값: false)
 * 
 * 사용 예시:
 * <ScrollingTags 
 *   tags={['React', 'JavaScript', 'Python', 'Java']}
 *   direction="left"
 *   speed={15}
 *   pauseOnHover={true}
 * />
 */

import React from 'react';
import { motion } from 'framer-motion';

function ScrollingTags({ 
  tags, 
  direction = 'left', 
  speed = 20, 
  height = '80px',
  className = '',
  tagClassName = '',
  pauseOnHover = false 
}) {
  /**
   * 방향에 따른 애니메이션 설정
   * @param {string} direction - 스크롤 방향
   * @returns {object} 애니메이션 설정 객체
   */
  const getAnimationConfig = (direction) => {
    const baseConfig = {
      repeat: Infinity,
      duration: speed,
      ease: 'linear'
    };

    switch (direction) {
      case 'right':
        return {
          ...baseConfig,
          x: ['100%', '-100%']
        };
      case 'left':
      default:
        return {
          ...baseConfig,
          x: ['-100%', '100%']
        };
    }
  };

  /**
   * 태그가 없거나 빈 배열인 경우 null 반환
   */
  if (!tags || tags.length === 0) {
    return null;
  }

  /**
   * 기본 태그 스타일 클래스
   */
  const defaultTagClassName = `
    px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap
    ${tagClassName}
  `;

  /**
   * 태그들을 두 번 반복하여 무한 스크롤 효과 생성
   * 첫 번째 세트가 화면을 벗어날 때 두 번째 세트가 나타나도록 함
   */
  const duplicatedTags = [...tags, ...tags];

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      <div className="absolute inset-0 flex items-center">
        <motion.div
          animate={getAnimationConfig(direction)}
          className="flex gap-6 whitespace-nowrap"
          style={{ width: '200%' }}
          // 호버 시 애니메이션 일시정지 설정
          whileHover={pauseOnHover ? { animationPlayState: 'paused' } : {}}
        >
          {duplicatedTags.map((tag, index) => (
            <motion.span
              key={`${tag}-${index}`}
              className={defaultTagClassName}
              style={{
                backgroundColor: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
              // 개별 태그 호버 효과
              whileHover={{
                scale: 1.05,
                backgroundColor: 'var(--glass-bg-hover)',
                transition: { duration: 0.2 }
              }}
              // 스태거 애니메이션을 위한 초기 지연
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: (index % tags.length) * 0.1,
                  duration: 0.5 
                }
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* 좌우 그라데이션 페이드 효과 */}
      <div 
        className="absolute top-0 left-0 w-20 h-full pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%)`
        }}
      />
      <div 
        className="absolute top-0 right-0 w-20 h-full pointer-events-none z-10"
        style={{
          background: `linear-gradient(270deg, var(--bg-primary) 0%, transparent 100%)`
        }}
      />
    </div>
  );
}

export default ScrollingTags; 