/**
 * MainPage 컴포넌트 (메인 홈페이지)
 * 
 * 웹사이트의 랜딩 페이지로, Codeit.kr 스타일을 모방한 현대적인 디자인을 제공합니다.
 * 다양한 섹션으로 구성되어 있으며, 각각 고유한 애니메이션과 인터랙션을 포함합니다.
 * 
 * 주요 섹션:
 * 1. 히어로 섹션 - "5분마다 실력이 늘어나는 코딩 학습" 메인 메시지
 * 2. 흐르는 카테고리 태그 - 무한 스크롤 애니메이션으로 강의 카테고리 표시
 * 3. 통계 정보 - 98% 완주율, 5분 학습 사이클, 160+ 수료증 등
 * 4. 특징 소개 - 학습 방법론 및 서비스 특징
 * 5. 언어 소개 - 지원하는 프로그래밍 언어들
 * 6. CTA 섹션 - 행동 유도 버튼
 * 
 * 기술적 특징:
 * - Framer Motion을 활용한 부드러운 스크롤 애니메이션
 * - 반응형 디자인 (모바일 우선)
 * - 다크/라이트 테마 지원
 * - CSS 변수를 통한 동적 스타일링
 * - 접근성을 고려한 시맨틱 마크업
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaRocket, FaTrophy, FaUsers, FaBrain, FaMoon, FaSun } from 'react-icons/fa';
import '../styles/style.css';



// 중앙 데이터 관리 시스템에서 언어 데이터와 유틸리티 함수들을 import
// 이미지들도 중앙에서 관리하므로 개별 import 불필요
import { getSimpleLanguageData } from '../data/languageData';
import { LanguageCardGrid } from '../components/LanguageCard';



function MainPage() {
  /**
   * 컴포넌트 상태 관리 및 초기화
   */
  
  // 다크/라이트 테마 상태 (기본값: 다크모드)
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // 페이지 스크롤 진행도를 추적 (0-1 사이의 값)
  const { scrollYProgress } = useScroll();
  
  // 스크롤 진행도에 따른 패럴랙스 효과를 위한 Y축 변환
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  /**
   * 컴포넌트 마운트 시 테마 설정 초기화
   * localStorage에서 저장된 테마를 불러오거나 시스템 설정을 따름
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 저장된 테마 우선, 없으면 시스템 다크모드 설정 따름
    const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkMode(initialTheme);
    
    // HTML 루트 요소에 테마 속성 설정하여 CSS 변수 적용
    document.documentElement.setAttribute('data-theme', initialTheme ? 'dark' : 'light');
  }, []);

  /**
   * 테마 토글 함수
   * 다크모드와 라이트모드를 전환하고 localStorage에 저장
   */
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    const themeValue = newTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeValue);
    localStorage.setItem('theme', themeValue);
  };



  /**
   * 언어 데이터 - 중앙 관리 시스템에서 가져옴
   * 메인 페이지에서는 간소화된 언어 정보만 필요하므로 getSimpleLanguageData() 사용
   * 이미지, 설명, 색상 등 기본 정보만 포함
   */
  const languages = getSimpleLanguageData();

  // 기능 데이터
  const features = [
    {
      icon: FaRocket,
      title: '실시간 코딩',
      description: '브라우저에서 바로 코드를 작성하고 실행해보세요',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      icon: FaTrophy,
      title: '챌린지 시스템',
      description: '다양한 난이도의 문제로 실력을 향상시키세요',
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      icon: FaUsers,
      title: '커뮤니티',
      description: '다른 개발자들과 함께 학습하고 성장하세요',
      gradient: 'from-green-400 to-blue-400'
    },
    {
      icon: FaBrain,
      title: 'AI 튜터링',
      description: 'AI가 개인화된 학습 경험을 제공합니다',
      gradient: 'from-blue-400 to-purple-400'
    }
  ];

  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      backgroundColor: 'var(--bg-primary)', 
      color: 'var(--text-primary)' 
    }}>

      {/* Animated Background */}
      <div className="fixed inset-0" style={{ zIndex: -2 }}>

        <div className={`absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse background-orb ${
          isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
        }`} />
        <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 background-orb ${
          isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
        }`} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-bounce-slow background-orb ${
          isDarkMode ? 'bg-pink-500/10' : 'bg-pink-500/5'
        }`} />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-40 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center relative overflow-hidden" style={{ paddingBottom: '10rem' }}>
        
        <div className="max-w-7xl mx-auto text-center w-full relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12 py-8"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight hero-title mb-6 lg:mb-8"
              style={{ lineHeight: '1.2' }}
            >
              <span style={{ display: 'block', marginBottom: '0.2em', color: 'var(--text-primary)' }}>5분마다</span>
              <span className="gradient-text" style={{ display: 'block', marginBottom: '0.2em' }}>실력이 늘어나는</span>
              <span style={{ display: 'block', color: 'var(--text-primary)' }}>코딩 학습</span>
            </motion.h1>
            
            {/* 흐르는 카테고리 태그 애니메이션 */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden mb-12 py-6"
              style={{ height: '80px' }}
            >
              <div className="absolute inset-0 flex items-center">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 20, 
                    ease: 'linear' 
                  }}
                  className="flex gap-6 whitespace-nowrap"
                  style={{ width: '200%' }}
                >
                  {[
                    '코딩 기초', '데이터 분석', '웹 개발', '디자인', '프로그래밍 언어',
                    '생성형 AI 활용', '머신러닝', '딥러닝', 'IT 실무', '비즈니스',
                    '개발 도구', '컴퓨터 과학', 'React', 'Node.js', 'Python',
                    'JavaScript', 'Java', 'C++', 'Rust', 'Go'
                  ].map((tag, index) => (
                    <span
                      key={index}
                      className="px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: 'var(--glass-bg)',
                        backdropFilter: 'blur(10px)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl max-w-xl lg:max-w-2xl mx-auto leading-relaxed hero-text mb-8 lg:mb-12"
              style={{ color: 'var(--text-secondary)' }}
            >
              Codes for <strong style={{ color: 'var(--text-primary)' }}>Everyone</strong>
              <br />
              <span className="text-base opacity-80">5분 학습 사이클로 높아지는 기억력과 실력</span>
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 btn-primary rounded-xl text-lg font-semibold glass-effect cursor-glow"
              >
                무료 체험 시작하기
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-150"
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                멤버십 알아보기
              </motion.button>
            </motion.div>

            {/* 추가 정보 섹션 */}
            <motion.div 
              variants={itemVariants}
              className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  강의 1개 이상 완주율
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">5분</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  핵심만 쏙! 학습 사이클
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">160+</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  수료증 제공 강의
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-20 gradient-text"
          >
            지원하는 언어들
          </motion.h2>
          
          {/* 언어 카드 그리드 - 최적화된 재사용 가능한 컴포넌트 사용 */}
          <LanguageCardGrid 
            languages={languages}
            variant="simple"
            gridCols="grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
            onCardClick={(language) => {
              // 언어 카드 클릭 시 언어 페이지로 이동하는 로직
              console.log(`Navigate to ${language.name} page`);
              // 실제 구현에서는 React Router의 navigate 함수 사용
              // navigate(`/languages/${language.id}`);
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-20"
            style={{ color: 'var(--text-primary)' }}
          >
            왜 <span className="gradient-text">forallfor</span>인가요?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                }}
                className="feature-card glass-effect rounded-2xl p-8 text-center group cursor-pointer gpu-accelerated"
              >
                <div className={`feature-icon-wrapper w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:opacity-90 transition-all" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="group-hover:opacity-80 transition-all" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-12 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              지금 시작해보세요!
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              수천 명의 개발자들이 이미 forallfor와 함께 성장하고 있습니다.
              당신도 함께 하세요!
            </p>
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 25px 50px rgba(102, 126, 234, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-12 py-6 rounded-2xl text-xl font-bold text-white animate-glow cursor-glow"
            >
              무료로 시작하기
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: 'var(--text-secondary)' }}
          >
            <p>&copy; 2025 forallfor(fAf). 모든 권리 보유.</p>
            <p className="mt-2">코딩으로 연결된 세상을 만들어갑니다.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;
