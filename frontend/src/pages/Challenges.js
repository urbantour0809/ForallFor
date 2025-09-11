/**
 * Challenges 컴포넌트 (챌린지 페이지)
 *
 * 사용자가 다양한 프로그래밍 챌린지를 탐색하고 참여할 수 있는 페이지입니다.
 * 난이도별, 카테고리별 필터링 기능과 함께 각 챌린지의 상세 정보를 제공합니다.
 *
 * 주요 기능:
 * - 난이도별 필터링 (초급/중급/고급)
 * - 카테고리별 필터링 (알고리즘, 웹개발, 데이터분석, 머신러닝)
 * - 챌린지 카드 형태의 직관적인 UI
 * - 예상 소요시간, 포인트, 완료자 수 표시
 * - 반응형 그리드 레이아웃
 * - 부드러운 호버 애니메이션 및 상태 전환
 *
 * 데이터 구조:
 * - id: 고유 식별자 (challenge_id)
 * - title: 챌린지 제목 (challenge_title)
 * - description: 설명 (content)
 * - difficulty: 난이도 (level_name → beginner/intermediate/advanced)
 * - category: 카테고리 (category_name → algorithm/web/frontend/backend/system)
 * - language: 사용 언어
 * - points: 획득 포인트 (exp)
 * - completed: 완료자 수
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTrophy, FaCode, FaChartLine, FaDatabase, FaPalette, FaServer, FaCog, FaSpinner } from 'react-icons/fa';
import axios from 'axios'; // 🎯 axios 추가
import '../styles/style.css';
import { API_ENDPOINTS } from '../config/apiConfig';

// 🎯 언어 이미지들 import (Languages.js와 동일)
import javaLogo from '../assets/images/java.png';
import pythonLogo from '../assets/images/python.png';
import javascriptLogo from '../assets/images/javascript.png';
import cLogo from '../assets/images/c.png';
import cppLogo from '../assets/images/c++.png';
import rustLogo from '../assets/images/rust.png';
import goLogo from '../assets/images/go.png';

function Challenges() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // 🎯 URL 파라미터 처리용

  // 필터 상태
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all'); // 🎯 언어 필터 추가

  // API 데이터 상태
  const [challenges, setChallenges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // 🎯 언어별 아이콘 매핑 (Languages.js와 동일)
  const languageIcons = {
    'Java': javaLogo,
    'Python': pythonLogo,
    'JavaScript': javascriptLogo,
    'C': cLogo,
    'C++': cppLogo,
    'Rust': rustLogo,
    'Go': goLogo
  };

  // 🔥 헬퍼 함수들 - 먼저 정의
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/10';
      case 'advanced': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '미지정';
    }
  };

  // 🎯 언어별 배경색 매핑 (Languages.js와 동일)
  const getLanguageBgColor = (language) => {
    switch (language) {
      case 'Java': return 'bg-orange-500/10';
      case 'Python': return 'bg-blue-500/10';
      case 'JavaScript': return 'bg-yellow-500/10';
      case 'C': return 'bg-blue-500/10';
      case 'C++': return 'bg-blue-600/10';
      case 'Rust': return 'bg-orange-600/10';
      case 'Go': return 'bg-cyan-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  // 데이터 매핑 테이블
  const difficultyMapping = {
    '초급': 'beginner',
    '중급': 'intermediate',
    '고급': 'advanced'
  };

  const categoryMapping = {
    '알고리즘': 'algorithm',
    '자료구조': 'data-structure',
    '웹개발': 'web',
    '프론트엔드': 'frontend',
    '백엔드': 'backend',
    '시스템': 'system'
  };

  // 카테고리 아이콘 매핑
  const categoryIcons = {
    'algorithm': FaChartLine,
    'data-structure': FaDatabase,
    'web': FaCode,
    'frontend': FaPalette,
    'backend': FaServer,
    'system': FaCog
  };

  // 🎯 API에서 데이터를 가져와서 기존 구조로 변환 (axios 사용, 언어 파라미터 지원)
  const fetchChallengeData = async (language = 'all') => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 챌린지 데이터 로딩 시작... (언어: ${language})`);

      // 🎯 axios 사용으로 변경 및 언어 파라미터 추가
      const response = await axios.get('http://localhost:8080/FAF/api/challenges', {
        params: {
          language: language,
          difficulty: 'all',
          category: 'all'
        }
      });

      const data = response.data; // 🎯 axios는 response.data에 데이터가 있음

      if (!data.success) {
        throw new Error(data.message || '데이터 로딩 실패');
      }

      console.log('✅ API 응답:', data);
      console.log('🔍 언어별 챌린지 분포:');
      const languageCount = {};
      data.challenges.forEach(challenge => {
        languageCount[challenge.language] = (languageCount[challenge.language] || 0) + 1;
      });
      console.log('📊 언어별 챌린지 수:', languageCount);
      console.log('🔍 C++ 챌린지 확인:');
      const cppChallenges = data.challenges.filter(c => c.language === 'C++');
      console.log('   - C++ 챌린지 수:', cppChallenges.length);
      cppChallenges.forEach(challenge => {
        console.log('   - ' + challenge.challenge_title + ' (' + challenge.language + ')');
      });

      // 🔥 완료자 수 맵 가져오기 (실제 DB 데이터)
      const completedCountMap = data.completedCountMap || {};

      // 🔥 통계 데이터 가져오기 (실제 DB 데이터)
      const statistics = data.statistics || {};
      console.log('📊 실제 DB 통계 데이터:', statistics);

      // 챌린지 데이터 변환
      const transformedChallenges = data.challenges.map(challenge => {
        // 난이도 정보 찾기
        const levelInfo = data.levels.find(level => level.level_id === challenge.level_id);
        const difficultyKey = levelInfo ? difficultyMapping[levelInfo.level_name] : 'beginner';

        // 카테고리 정보 찾기
        const categoryInfo = data.categories.find(cat => cat.category_id === challenge.category_id);
        const categoryKey = categoryInfo ? categoryMapping[categoryInfo.category_name] : 'algorithm';

        // 🔥 실제 완료자 수 사용 (더미데이터 제거)
        const actualCompleted = completedCountMap[challenge.challenge_id] || 0;

        console.log(`🎯 챌린지 "${challenge.challenge_title}" 완료자: ${actualCompleted}명 (실제 DB)`);

        return {
          id: challenge.challenge_id,
          title: challenge.challenge_title,
          description: challenge.content,
          difficulty: difficultyKey,
          category: categoryKey,
          language: challenge.language,
          points: levelInfo?.exp || 100,
          completed: actualCompleted, // 🔥 실제 DB 데이터 사용
          tags: [] // DB에 태그 정보가 없으므로 빈 배열
        };
      });

      // 카테고리 데이터 변환
      const transformedCategories = [
        { id: 'all', name: '전체', icon: FaCode },
        ...data.categories.map(cat => ({
          id: categoryMapping[cat.category_name] || 'algorithm',
          name: cat.category_name,
          icon: categoryIcons[categoryMapping[cat.category_name]] || FaCode
        }))
      ];

      // 난이도 데이터 변환
      const transformedDifficulties = [
        { id: 'all', name: '전체', color: 'text-gray-400' },
        ...data.levels.map(level => {
          const diffKey = difficultyMapping[level.level_name];
          return {
            id: diffKey,
            name: level.level_name,
            color: level.color === 'green' ? 'text-green-400' :
                level.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
          };
        })
      ];

      // 상태 업데이트
      setChallenges(transformedChallenges);
      setCategories(transformedCategories);
      setLevels(transformedDifficulties);

      // 🔥 실제 완료자 수 합계 계산 및 디버깅
      const totalActualCompleted = transformedChallenges.reduce((sum, c) => sum + c.completed, 0);
      const uniqueLanguages = new Set(transformedChallenges.map(c => c.language)).size;

      console.log('✅ 데이터 변환 완료:', {
        challenges: transformedChallenges.length,
        categories: transformedCategories.length,
        levels: transformedDifficulties.length,
        totalCompletedUsers: totalActualCompleted,
        uniqueLanguages: uniqueLanguages
      });

      // 🔥 디버깅: DB 데이터가 없는 경우 안내
      if (totalActualCompleted === 0) {
        console.warn('⚠️ 완료자 수가 0입니다. Challenge_sub 테이블에 데이터가 없는 것 같습니다.');
        console.log('💡 테스트용 데이터 생성 방법:');
        console.log('   1. MySQL에 접속');
        console.log('   2. 다음 SQL 실행:');
        console.log('      INSERT INTO Challenge_sub (challenge_id, user_id, correct_answer, exp_count) VALUES (1, 1, "test", 100);');
        console.log('      INSERT INTO Challenge_sub (challenge_id, user_id, correct_answer, exp_count) VALUES (2, 1, "test", 200);');
      }

    } catch (error) {
      console.error('❌ 데이터 로딩 실패:', error);
      setError('챌린지 데이터를 불러오는데 실패했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 컴포넌트 마운트 시 데이터 로드 및 언어 변경 시 재로드
  useEffect(() => {
    const languageParam = searchParams.get('language');
    if (languageParam) {
      // 🔥 URL 디코딩 문제 해결: decodeURIComponent 사용
      const decodedLanguage = decodeURIComponent(languageParam);
      console.log(`🔗 URL에서 언어 파라미터 감지: ${languageParam}`);
      console.log(`🔧 디코딩된 언어명: "${decodedLanguage}"`);
      setSelectedLanguage(decodedLanguage);
      fetchChallengeData(decodedLanguage); // 🎯 디코딩된 언어 파라미터와 함께 API 호출
    } else {
      fetchChallengeData('all'); // 🎯 언어 파라미터 없으면 전체 조회
    }


  }, [searchParams]);

  // 필터링된 챌린지 목록
  const filteredChallenges = challenges.filter(challenge => {
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory;
    const languageMatch = selectedLanguage === 'all' || challenge.language === selectedLanguage; // 🎯 언어 필터 추가
    
    // 🔥 디버깅: 언어 매칭 확인
    if (selectedLanguage !== 'all') {
      console.log(`🔍 언어 매칭 확인: 선택된 언어="${selectedLanguage}", 챌린지 언어="${challenge.language}", 매칭=${challenge.language === selectedLanguage}`);
    }
    
    return difficultyMatch && categoryMatch && languageMatch;
  });



  // 로딩 상태
  if (loading) {
    return (
        <div className="page-layout page-layout-relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <FaSpinner className="animate-spin text-6xl mb-4 mx-auto" style={{ color: 'var(--text-primary)' }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  챌린지 로딩 중...
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  잠시만 기다려주세요
                </p>
              </div>
            </div>
          </div>
        </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
        <div className="page-layout page-layout-relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-2 text-red-400">
                  데이터 로딩 실패
                </h2>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {error}
                </p>
                <motion.button
                    onClick={fetchChallengeData}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-6 py-3 rounded-xl"
                >
                  다시 시도
                </motion.button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="page-layout page-layout-relative">
        {/* 배경 효과 */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-20 right-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
          >
            <h1
                className="text-5xl md:text-7xl font-bold mb-8 gradient-text"
                style={{
                  lineHeight: '1.2',
                  paddingTop: '0.2em',
                  paddingBottom: '0.2em'
                }}
            >
              Coding Challenges
            </h1>
            <p
                className="text-xl md:text-2xl max-w-3xl mx-auto mt-6"
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}
            >
              실전 코딩 문제를 통해 실력을 향상시키고 개발자로서 성장해보세요.
            </p>
            
            


          </motion.div>

          {/* 필터 섹션 */}
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-12"
          >
            {/* 난이도 필터 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>난이도</h3>
              <div className="flex flex-wrap gap-3">
                {levels.map(level => (
                    <motion.button
                        key={level.id}
                        onClick={() => setSelectedDifficulty(level.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                            selectedDifficulty === level.id
                                ? 'glass-effect border-2 border-blue-500'
                                : 'glass-effect border border-transparent'
                        }`}
                        style={{ color: 'var(--text-primary)' }}
                    >
                      {level.name}
                    </motion.button>
                ))}
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>카테고리</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                    <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-150 ${
                            selectedCategory === category.id
                                ? 'glass-effect border-2 border-blue-500'
                                : 'glass-effect border border-transparent'
                        }`}
                        style={{ color: 'var(--text-primary)' }}
                    >
                      <category.icon className="text-sm" />
                      <span>{category.name}</span>
                    </motion.button>
                ))}
              </div>
            </div>


          </motion.div>

          {/* 챌린지 카드 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge, index) => (
                <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.15 }
                    }}
                    className={`glass-effect rounded-3xl p-6 group cursor-pointer gpu-accelerated flex flex-col h-full ${getLanguageBgColor(challenge.language)}`}
                >
                  {/* 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {challenge.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {/* 🎯 언어 아이콘 추가 */}
                        {languageIcons[challenge.language] && (
                          <img 
                            src={languageIcons[challenge.language]} 
                            alt={`${challenge.language} 로고`}
                            className="w-6 h-6 object-contain"
                            loading="lazy"
                          />
                        )}
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                          {getDifficultyText(challenge.difficulty)}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full glass-effect" style={{ color: 'var(--text-secondary)' }}>
                          {challenge.language}
                        </span>
                      </div>
                    </div>
                    
                  </div>

                  {/* 설명 */}
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {challenge.description}
                  </p>

                  {/* 태그들 - 조건부 렌더링 */}
                  {challenge.tags && challenge.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {challenge.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded glass-effect"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                      #{tag}
                    </span>
 ))}
                      </div>
                  )}

                  {/* 하단 정보 */}
                  <div className="flex items-center justify-center mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center space-x-1">
                      <FaTrophy />
                      <span>{challenge.completed}명 완료</span>
                    </div>
                  </div>

                  {/* 액션 버튼 - 하단에 고정 */}
                  <div className="mt-auto">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full btn-primary py-3 rounded-xl font-semibold"
                        onClick={() => {
                          // 챌린지 ID를 사용하여 Problem Solver 페이지로 이동
                          navigate(`/challenge/${challenge.id}`);
                        }}
                    >
                      도전하기
                    </motion.button>
                  </div>
                </motion.div>
            ))}
          </div>

          {/* 빈 결과 처리 */}
          {filteredChallenges.length === 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  검색 결과가 없습니다
                </h3>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  다른 필터 조건을 선택해보세요
                </p>
                <motion.button
                    onClick={() => {
                      setSelectedDifficulty('all');
                      setSelectedCategory('all');
                      setSelectedLanguage('all'); // 🎯 언어 필터도 초기화
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-6 py-3 rounded-xl"
                >
                  전체 보기
                </motion.button>
              </motion.div>
          )}

          {/* 통계 섹션 - 완전한 DB 연동 */}
          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-20 glass-effect rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-8 gradient-text">챌린지 통계</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2 gradient-text">{challenges.length}</div>
                <div style={{ color: 'var(--text-secondary)' }}>총 문제 수</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 gradient-text">{new Set(challenges.map(c => c.language)).size}</div>
                <div style={{ color: 'var(--text-secondary)' }}>지원 언어</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 gradient-text">
                  {challenges.reduce((sum, c) => sum + c.completed, 0).toLocaleString()}
                  {/* 🔥 디버깅 표시 */}
                  {challenges.reduce((sum, c) => sum + c.completed, 0) === 0 && (
                      <span className="text-xs text-orange-400 block">(DB 데이터 없음)</span>
                  )}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>총 참여자</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 gradient-text">24/7</div>
                <div style={{ color: 'var(--text-secondary)' }}>자동 채점</div>
              </div>
            </div>
          </motion.div>
        </div>

        
      </div>
  );
}

export default Challenges;