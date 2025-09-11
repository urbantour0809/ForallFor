/**
 * Test 컴포넌트 (시험 페이지)
 * 
 * 기업체 또는 관리자가 출제한 정식 시험 문제들을 제공하는 페이지입니다.
 * Challenges와 차별화하여 더 엄격한 시험 환경과 평가 시스템을 제공합니다.
 * 
 * 주요 기능:
 * - 기업체별/난이도별 필터링
 * - 시험 시간 제한 표시
 * - 합격/불합격 기준 표시
 * - 인증서 발급 가능 표시
 * - 실전 면접 대비 문제
 * 
 * Challenges와의 차별점:
 * - 제한 시간이 있는 정식 시험
 * - 합격 기준이 명확함
 * - 기업체에서 출제한 실제 문제
 * - 인증서 발급 및 이력서 첨부 가능
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaCertificate, 
  FaClock, 
  FaBuilding, 
  FaGraduationCap, 
  FaAward,
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
  FaChartBar,
  FaCode,
  FaDatabase,
  FaBug,
  FaCogs
} from 'react-icons/fa';
import '../styles/style.css';
import axios from 'axios'; // 백엔드 통신 방식

function Test() {
  const navigate = useNavigate();
  
  // 현재 선택된 필터들
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // 시험 데이터 상태
  const [tests, setTests] = useState([]);
  const [testCategories, setTestCategories] = useState([]);
  const [testLevels, setTestLevels] = useState([]);
  const [testWriters, setTestWriters] = useState([]);

  // 컴포넌트 마운트 시 시험 데이터 가져오기
  useEffect(() => {
    fetchTests();
  }, []);

  /**
   * 백엔드에서 시험 데이터를 가져오는 함수
   */
  const fetchTests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/FAF/api/tests', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      


      // Controller에서 넘겨주는 데이터 구조에 맞게 처리
      if (data) {
        // 시험 리스트
        if (data.testList && Array.isArray(data.testList)) {
          setTests(data.testList);
        }
        
        // 시험 카테고리 리스트
        if (data.testCategoryList && Array.isArray(data.testCategoryList)) {
          setTestCategories(data.testCategoryList);
        }
        
        // 시험 난이도 리스트
        if (data.testLevelList && Array.isArray(data.testLevelList)) {
          setTestLevels(data.testLevelList);
        }
        
        // 시험 출제자 리스트 (회사명으로 사용)
        if (data.testWriterList && Array.isArray(data.testWriterList)) {
          setTestWriters(data.testWriterList);
        }
        

      }
      
      // 서버에서 데이터를 가져오지 못한 경우 기본 데이터 사용
      if (!data || !data.testList || !Array.isArray(data.testList) || data.testList.length === 0) {
        setTests(getDefaultTests());
      }
    } catch (error) {
      console.error('시험 데이터 가져오기 오류:', error);
      // 오류 발생 시 기본 데이터 사용
      setTests(getDefaultTests());
    }
  };

  /**
   * 기본 시험 데이터 (서버 연결 실패 시 사용)
   */
  const getDefaultTests = () => [
    {
      id: 1,
      title: "네이버 신입 개발자 코딩테스트",
      description: "네이버에서 출제한 실제 신입 개발자 채용 문제입니다. 자료구조와 알고리즘 문제로 구성되어 있습니다.",
      difficulty: "intermediate",
      company: "naver",
      type: "algorithm",
      timeLimit: 120, // 분 단위
      passingScore: 70,
      participants: 3247,
      passRate: 23.5,
      certification: true,
      tags: ["자료구조", "알고리즘", "효율성"],
      dateCreated: "2024-12-15"
    },
    {
      id: 2,
      title: "카카오 프론트엔드 개발자 실무 평가",
      description: "카카오에서 출제한 프론트엔드 개발자 실무 능력 평가 문제입니다. React와 JavaScript 고급 개념을 다룹니다.",
      difficulty: "advanced",
      company: "kakao",
      type: "language",
      timeLimit: 180,
      passingScore: 80,
      participants: 1523,
      passRate: 18.2,
      certification: true,
      tags: ["React", "JavaScript", "State Management"],
      dateCreated: "2024-11-28"
    },
    {
      id: 3,
      title: "삼성 SW 역량테스트 A형",
      description: "삼성전자에서 출제한 SW 역량테스트 A형 문제입니다. 복잡한 시뮬레이션과 구현 문제로 구성되어 있습니다.",
      difficulty: "advanced",
      company: "samsung",
      type: "data-structure",
      timeLimit: 180,
      passingScore: 75,
      participants: 5634,
      passRate: 15.8,
      certification: true,
      tags: ["시뮬레이션", "구현", "최적화"],
      dateCreated: "2024-12-01"
    },
    {
      id: 4,
      title: "LG CNS 데이터 분석 역량 평가",
      description: "LG CNS에서 출제한 데이터 분석 전문가 역량 평가 문제입니다. Python과 SQL을 활용한 실무 문제입니다.",
      difficulty: "intermediate",
      company: "lg",
      type: "practical",
      timeLimit: 150,
      passingScore: 65,
      participants: 892,
      passRate: 31.2,
      certification: true,
      tags: ["Python", "SQL", "데이터분석"],
      dateCreated: "2024-11-20"
    },
    {
      id: 5,
      title: "쿠팡 백엔드 시스템 설계 평가",
      description: "쿠팡에서 출제한 백엔드 시스템 설계 및 구현 평가 문제입니다. 대용량 트래픽 처리와 DB 설계를 다룹니다.",
      difficulty: "advanced",
      company: "coupang",
      type: "debugging",
      timeLimit: 240,
      passingScore: 85,
      participants: 672,
      passRate: 12.4,
      certification: true,
      tags: ["시스템설계", "DB", "성능최적화"],
      dateCreated: "2024-12-10"
    },
    {
      id: 6,
      title: "라인 플러스 모바일 개발 실무",
      description: "라인플러스에서 출제한 모바일 앱 개발 실무 능력 평가입니다. Android/iOS 네이티브 개발 지식을 요구합니다.",
      difficulty: "advanced",
      company: "line",
      type: "practical",
      timeLimit: 200,
      passingScore: 75,
      participants: 445,
      passRate: 22.7,
      certification: true,
      tags: ["Android", "iOS", "모바일"],
      dateCreated: "2024-11-15"
    }
  ];

  // 회사 필터 옵션
  const companies = [
    { id: 'all', name: '전체', icon: FaBuilding },
    { id: 'naver', name: '네이버', icon: FaBuilding },
    { id: 'kakao', name: '카카오', icon: FaBuilding },
    { id: 'samsung', name: '삼성', icon: FaBuilding },
    { id: 'lg', name: 'LG', icon: FaBuilding },
    { id: 'coupang', name: '쿠팡', icon: FaBuilding },
    { id: 'line', name: '라인', icon: FaBuilding }
  ];

  // 시험 유형 필터 옵션
  const testTypes = [
    { id: 'all', name: '전체', icon: FaGraduationCap },
    { id: 'practical', name: '실무 능력', icon: FaCogs },
    { id: 'algorithm', name: '알고리즘 구조', icon: FaCode },
    { id: 'data-structure', name: '자료구조 활용', icon: FaDatabase },
    { id: 'language', name: '언어 활용 능력', icon: FaStar },
    { id: 'debugging', name: '디버깅 및 테스트', icon: FaBug }
  ];

  // 난이도 필터 옵션
  const difficulties = [
    { id: 'all', name: '전체', color: 'text-gray-400' },
    { id: 'beginner', name: '초급', color: 'text-green-400' },
    { id: 'intermediate', name: '중급', color: 'text-yellow-400' },
    { id: 'advanced', name: '고급', color: 'text-red-400' }
  ];

  // 유틸리티 함수들

  const getDifficultyText = (levelId) => {
    if (!levelId || !testLevels || testLevels.length === 0) return '미지정';
    const level = testLevels.find(l => l.level_id === levelId);
    return level ? level.name : '미지정';
  };

  const getDifficultyColor = (levelId) => {
    if (!levelId || !testLevels || testLevels.length === 0) return 'text-gray-400 bg-gray-500/10';
    const level = testLevels.find(l => l.level_id === levelId);
    if (!level) return 'text-gray-400 bg-gray-500/10';
    
    switch (level.name) {
      case '초급': return 'text-green-400 bg-green-500/10';
      case '중급': return 'text-yellow-400 bg-yellow-500/10';
      case '고급': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getCompanyName = (userId) => {
    if (!userId || !testWriters || testWriters.length === 0) return '기타';
    const writer = testWriters.find(w => w.user_id === userId);
    return writer ? writer.nickname : '기타';
  };

  const getTestTypeName = (categoryId) => {
    if (!categoryId || !testCategories || testCategories.length === 0) return '기타';
    const category = testCategories.find(c => c.category_id === categoryId);
    return category ? category.name : '기타';
  };

  const getPassRateColor = (passRate) => {
    if (passRate >= 30) return 'text-green-400';
    if (passRate >= 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  // 필터링된 시험 목록
  const filteredTests = tests.filter(test => {
    // 백엔드 데이터인지 기본 데이터인지 구분
    const isBackendData = test.test_id !== undefined;
    
    if (isBackendData) {
      // 백엔드 데이터: 카드에 표시되는 실제 값으로 필터링
      const actualDifficulty = testLevels[test.level_id % testLevels.length]?.name;
      const actualCategory = testCategories[test.category_id % testCategories.length]?.name;
      
      const difficultyMatch = selectedDifficulty === 'all' || 
        (actualDifficulty && difficulties.find(d => d.name === actualDifficulty)?.id === selectedDifficulty);
      const typeMatch = selectedType === 'all' || 
        (actualCategory && testTypes.find(t => t.name === actualCategory)?.id === selectedType);
      
      return difficultyMatch && typeMatch;
    } else {
      // 기본 데이터: 기존 필터링 로직 사용
      const difficultyMatch = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
      const typeMatch = selectedType === 'all' || test.type === selectedType;
      return difficultyMatch && typeMatch;
    }
  });

  return (
    <div className="page-layout page-layout-relative">
      {/* 배경 효과 - 더 전문적인 느낌 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-20 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <FaCertificate className="text-4xl text-blue-400 mr-4" />
            <FaGraduationCap className="text-4xl text-purple-400" />
          </div>
          <h1 
            className="text-5xl md:text-7xl font-bold mb-8 gradient-text"
            style={{ 
              lineHeight: '1.2',
              paddingTop: '0.2em',
              paddingBottom: '0.2em'
            }}
          >
            Professional Tests
          </h1>
          <p 
            className="text-xl md:text-2xl max-w-4xl mx-auto mt-6" 
            style={{ 
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}
          >
            기업체와 관리자가 출제한 실전 시험으로 실무 역량을 검증 받으세요. <br />
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              난이도
            </h3>
            <div className="flex flex-wrap gap-3">
              {difficulties.map((difficulty) => (
                <motion.button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedDifficulty === difficulty.id
                      ? 'glass-effect border-2 border-blue-500/50 shadow-lg'
                      : 'glass-effect hover:bg-white/5'
                  }`}
                  style={{
                    color: selectedDifficulty === difficulty.id ? '#60a5fa' : 'var(--text-secondary)'
                  }}
                >
                  {difficulty.name}
                </motion.button>
              ))}
            </div>
          </div>


          {/* 시험 유형 필터 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              시험 유형
            </h3>
            <div className="flex flex-wrap gap-3">
              {testTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedType === type.id
                      ? 'glass-effect border-2 border-green-500/50 shadow-lg'
                      : 'glass-effect hover:bg-white/5'
                  }`}
                  style={{
                    color: selectedType === type.id ? '#4ade80' : 'var(--text-secondary)'
                  }}
                >
                  <type.icon />
                  <span>{type.name}</span>
                </motion.button>
              ))}
            </div>
          </div>


        </motion.div>

        {/* 결과 개수 표시 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <p style={{ color: 'var(--text-secondary)' }}>
            총 <span className="text-blue-400 font-bold">{filteredTests.length}</span>개의 시험이 있습니다.
          </p>
        </motion.div>

        {/* 시험 카드 그리드 */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {filteredTests.map((test, index) => (
            <motion.div
              key={test.test_id || test.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-effect rounded-2xl p-6 h-full flex flex-col cursor-pointer group"
              style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--border-color)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* 상단 헤더 - 회사와 인증서 표시 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FaBuilding className="text-purple-400" />
                  <span className="font-semibold text-purple-400">
                    {testWriters[test.user_id % testWriters.length]?.nickname || '기타'}
                  </span>
                </div>
              </div>

              {/* 제목과 설명 */}
              <h3 
                className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                {test.title}
              </h3>
              <p 
                className="text-sm leading-relaxed mb-4 flex-grow"
                style={{ color: 'var(--text-secondary)' }}
              >
                {test.content || test.description}
              </p>


              {/* 난이도와 시험 유형 */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${getDifficultyColor(test.level_id)}`}>
                  {testLevels[test.level_id % testLevels.length]?.name || '미지정'}
                </span>
                <span className="text-sm text-indigo-400 font-medium">
                  {testCategories[test.category_id % testCategories.length]?.name || '기타'}
                </span>
              </div>

              {/* 시험 정보 - 백엔드 데이터가 있을 때만 표시 */}
              {test.participants && test.passRate && (
                <div className="space-y-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <FaUsers />
                      <span>응시자</span>
                    </div>
                    <span className="font-semibold">{test.participants.toLocaleString()}명</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <FaChartBar />
                      <span>합격률</span>
                    </div>
                    <span className={`font-semibold ${getPassRateColor(test.passRate)}`}>
                      {test.passRate}%
                    </span>
                  </div>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="mt-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                  onClick={() => {
                    // 시험 ID를 사용하여 Test Solver 페이지로 이동
                    //navigate(`/test-solver/${test.id}`);
                    navigate(`/tests`);
                  }}
                >
                  <FaGraduationCap />
                  <span>시험 응시</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        
      </div>
    </div>
  );
}

export default Test; 