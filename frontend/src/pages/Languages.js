/**
 * Languages 컴포넌트
 * * 다양한 프로그래밍 언어들을 소개하는 페이지 컴포넌트입니다.
 * 각 언어별로 특징, 난이도, 인기도, 주요 기능 등을 카드 형태로 표시합니다.
 * * 주요 기능:
 * - 7개 프로그래밍 언어 소개 (Java, Python, JavaScript, C, C++, Rust, Go)
 * - 반응형 그리드 레이아웃 (모바일: 1열, 태블릿: 2열, 데스크톱: 3열)
 * - Framer Motion을 이용한 스크롤 애니메이션
 * - 언어별 특색있는 색상 그라데이션
 * - 난이도 및 인기도 시각화
 * - 호버 효과 및 인터랙티브 애니메이션
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

// 🎯 언어 이미지들 직접 import
import javaLogo from '../assets/images/java.png';
import pythonLogo from '../assets/images/python.png';
import javascriptLogo from '../assets/images/javascript.png';
import cLogo from '../assets/images/c.png';
import cppLogo from '../assets/images/c++.png';
import rustLogo from '../assets/images/rust.png';
import goLogo from '../assets/images/go.png';

function Languages() {
  // 🎯 React Router 네비게이션 함수
  const navigate = useNavigate();
  
  // 🎯 언어 데이터 (하드코딩)
  const languages = [
    { 
      name: 'Java', 
      logo: javaLogo, 
      color: 'from-orange-400 to-red-500', 
      bgColor: 'bg-orange-500/10',
      description: '엔터프라이즈급 애플리케이션 개발',
      features: ['객체지향 프로그래밍', 'Spring Framework', '마이크로서비스', 'Android 개발']
    },
    { 
      name: 'Python', 
      logo: pythonLogo, 
      color: 'from-blue-400 to-green-500', 
      bgColor: 'bg-blue-500/10',
      description: 'AI, 데이터 사이언스, 웹 개발',
      features: ['머신러닝', 'Django/Flask', '데이터 분석', '자동화']
    },
    { 
      name: 'JavaScript', 
      logo: javascriptLogo, 
      color: 'from-yellow-400 to-orange-500', 
      bgColor: 'bg-yellow-500/10',
      description: '웹 프론트엔드 및 백엔드 개발',
      features: ['React/Vue', 'Node.js', 'TypeScript', '모바일 앱']
    },
    { 
      name: 'C', 
      logo: cLogo, 
      color: 'from-blue-500 to-purple-600', 
      bgColor: 'bg-blue-500/10',
      description: '시스템 프로그래밍의 기초',
      features: ['시스템 프로그래밍', '임베디드', '운영체제', '컴파일러']
    },
    { 
      name: 'C++', 
      logo: cppLogo, 
      color: 'from-blue-600 to-indigo-700', 
      bgColor: 'bg-blue-600/10',
      description: '고성능 애플리케이션 개발',
      features: ['게임 개발', '시스템 소프트웨어', 'Qt Framework', '알고리즘']
    },
    { 
      name: 'Rust', 
      logo: rustLogo, 
      color: 'from-orange-600 to-red-700', 
      bgColor: 'bg-orange-600/10',
      description: '안전하고 빠른 시스템 프로그래밍',
      features: ['메모리 안전성', '동시성', '웹어셈블리', '블록체인']
    },
    { 
      name: 'Go', 
      logo: goLogo, 
      color: 'from-cyan-400 to-blue-500', 
      bgColor: 'bg-cyan-500/10',
      description: '클라우드 및 마이크로서비스',
      features: ['클라우드 네이티브', 'Docker/Kubernetes', 'gRPC', '동시성']
    }
  ];

  // 🎯 [수정된 부분] 임시 통계 데이터 객체 선언
  const stats = {
    total: 7,
    averagePopularity: 85,
    mostPopular: { name: 'JavaScript' },
    easiest: [{ name: 'Python' }, { name: 'JavaScript' }],
    difficultyDistribution: {
      intermediate: 3,
    },
    hardest: [{ name: 'C++' }, { name: 'Rust' }]
  };

  return (
        <div className="page-layout page-layout-relative">
      {/* 배경 효과 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            Programming Languages
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            다양한 프로그래밍 언어를 체계적으로 학습하고 실무 프로젝트에 적용해보세요.
          </p>
        </motion.div>

        {/* 🎯 언어 카드 그리드 - 직접 렌더링 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language, index) => (
            <motion.div
              key={language.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.15 }
              }}
              className={`glass-effect rounded-3xl p-8 ${language.bgColor} group cursor-pointer flex flex-col h-full`}
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

              {/* 특징 태그들 */}
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

              {/* 🎯 학습하기 버튼 - 하단에 고정 */}
              <div className="mt-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full btn-primary py-3 rounded-xl font-semibold"
                  onClick={() => {
                    // 🎯 언어별 챌린지 페이지로 이동 (언어 문자열 전달)
                    console.log(`🚀 ${language.name} 챌린지로 이동`);
                    console.log(`🔍 전달되는 언어명: "${language.name}"`);
                    // 🔥 URL 인코딩 문제 해결: encodeURIComponent 사용
                    const encodedLanguage = encodeURIComponent(language.name);
                    console.log(`🔧 인코딩된 언어명: "${encodedLanguage}"`);
                    navigate(`/challenges?language=${encodedLanguage}`);
                  }}
                >
                  {language.name} 학습하기
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 통계 섹션 - 중앙 데이터 시스템에서 실시간 통계 사용 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 glass-effect rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-8 gradient-text">학습 통계</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2 gradient-text">{stats.total}</div>
              <div style={{ color: 'var(--text-secondary)' }}>지원 언어</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 gradient-text">{stats.averagePopularity}%</div>
              <div style={{ color: 'var(--text-secondary)' }}>평균 인기도</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 gradient-text">{stats.mostPopular.name}</div>
              <div style={{ color: 'var(--text-secondary)' }}>가장 인기있는 언어</div>
            </div>
          </div>
          

        </motion.div>
      </div>
    </div>
  );
}

export default Languages;