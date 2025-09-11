import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave, FaCode, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { API_ENDPOINTS } from '../config/apiConfig';
import { getLanguageInfo, getCategoryEmoji, getLevelColorClass } from '../utils/languageUtils';

function ChallengeRegister() {
  const navigate = useNavigate();
  
  // 문제 정보 상태
  const [challengeData, setChallengeData] = useState({
    challenge_title: '',
    level_id: '',
    category_id: '',
    language: '',
    content: '',
    hint: '',
    correct: ''
  });

  // 드롭다운 옵션 상태
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 언어 옵션 (동적 로딩)
  const [languages, setLanguages] = useState([]);

  // 컴포넌트 마운트 시 모든 데이터 가져오기
  useEffect(() => {
    // 기본 난이도 옵션 (API 실패 시 사용)
    const defaultLevels = [
      { level_id: 1, level_name: '초급', color: 'green', exp: 100 },
      { level_id: 2, level_name: '중급', color: 'yellow', exp: 300 },
      { level_id: 3, level_name: '고급', color: 'red', exp: 500 }
    ];

    // 기본 카테고리 옵션 (API 실패 시 사용)
    const defaultCategories = [
      { category_id: 1, category_name: '알고리즘' },
      { category_id: 2, category_name: '자료구조' },
      { category_id: 3, category_name: '웹개발' },
      { category_id: 4, category_name: '프론트엔드' },
      { category_id: 5, category_name: '백엔드' },
      { category_id: 6, category_name: '시스템' }
    ];

    // 기본 언어 옵션 (API 실패 시 사용)
    const defaultLanguages = [
      'Java', 'Python', 'JavaScript', 'C++', 'C', 'Go', 'Rust'
    ];

    // 먼저 기본값으로 설정
    setLevels(defaultLevels);
    setCategories(defaultCategories);
    setLanguages(defaultLanguages);
    
    // API에서 데이터 가져오기 시도
    fetchAllData();
  }, []);

  // 모든 데이터 가져오기 (레벨, 카테고리, 언어)
  const fetchAllData = async () => {
    try {
      // 병렬로 모든 API 호출
      const [levelsResponse, categoriesResponse, languagesResponse] = await Promise.all([
        fetch(API_ENDPOINTS.CHALLENGE.LEVELS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }),
        fetch(API_ENDPOINTS.CHALLENGE.CATEGORIES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }),
        fetch(API_ENDPOINTS.CHALLENGE.LANGUAGES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      ]);

      // 레벨 목록 처리
      if (levelsResponse.ok) {
        const levelsResult = await levelsResponse.json();
        if (levelsResult.success && levelsResult.levels && levelsResult.levels.length > 0) {
          console.log('✅ API에서 레벨 목록 가져오기 성공:', levelsResult.levels);
          setLevels(levelsResult.levels);
        } else {
          console.log('⚠️ API 레벨 목록이 비어있음, 기본값 사용');
        }
      } else {
        console.log('❌ 레벨 API 응답 실패, 기본값 사용');
      }

      // 카테고리 목록 처리
      if (categoriesResponse.ok) {
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.success && categoriesResult.categories && categoriesResult.categories.length > 0) {
          console.log('✅ API에서 카테고리 목록 가져오기 성공:', categoriesResult.categories);
          setCategories(categoriesResult.categories);
        } else {
          console.log('⚠️ API 카테고리 목록이 비어있음, 기본값 사용');
        }
      } else {
        console.log('❌ 카테고리 API 응답 실패, 기본값 사용');
      }

      // 언어 목록 처리
      if (languagesResponse.ok) {
        const languagesResult = await languagesResponse.json();
        if (languagesResult.success && languagesResult.languages && languagesResult.languages.length > 0) {
          console.log('✅ API에서 언어 목록 가져오기 성공:', languagesResult.languages);
          setLanguages(languagesResult.languages);
        } else {
          console.log('⚠️ API 언어 목록이 비어있음, 기본값 사용');
        }
      } else {
        console.log('❌ 언어 API 응답 실패, 기본값 사용');
      }

    } catch (error) {
      console.error('❌ 데이터 가져오기 실패, 기본값 사용:', error);
      // 에러 발생 시에도 기본값은 이미 설정되어 있으므로 추가 작업 불필요
    }
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChallengeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 문제 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 데이터 타입 변환
      const submitData = {
        ...challengeData,
        level_id: parseInt(challengeData.level_id) || 0,
        category_id: parseInt(challengeData.category_id) || 0
      };

      console.log('문제 등록 데이터:', submitData);
      
      const response = await fetch(API_ENDPOINTS.CHALLENGE.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const responseText = await response.text();
      console.log('응답 텍스트:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('파싱된 응답 데이터:', result);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        alert('서버에서 잘못된 응답을 받았습니다. 백엔드 서버를 확인해주세요.');
        return;
      }
      
      if (result.success) {
        alert(result.message || '문제가 성공적으로 등록되었습니다!');
        navigate('/mypage-admin');
      } else {
        alert(result.message || '문제 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('문제 등록 실패:', error);
      alert('문제 등록 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-layout page-layout-relative">
      {/* 배경 효과 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
            style={{ lineHeight: '1.2' }}
          >
            문제 등록
          </h1>
          <p 
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}
          >
            새로운 코딩 문제를 등록하여 사용자들에게 도전 기회를 제공하세요.
          </p>
        </motion.div>

        {/* 등록 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="glass-effect rounded-3xl p-8 mb-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/mypage-admin')}
              className="p-3 rounded-xl glass-effect hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h2 className="text-2xl font-bold gradient-text">문제 정보 입력</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 문제 제목 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  문제 제목 *
                </label>
                <input
                  type="text"
                  name="challenge_title"
                  value={challengeData.challenge_title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="예: 두 수의 합 구하기"
                />
              </div>

              {/* 난이도 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  난이도 *
                </label>
                <select
                  name="level_id"
                  value={challengeData.level_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="">난이도를 선택하세요</option>
                  {levels.map(level => (
                    <option key={level.level_id} value={level.level_id}>
                      {level.level_name} ({level.exp}exp) - {level.color}
                    </option>
                  ))}
                </select>
                {/* 선택된 난이도 정보 표시 */}
                {challengeData.level_id && (
                  <div className="mt-2 p-2 rounded-lg glass-effect">
                    {(() => {
                      const selectedLevel = levels.find(l => l.level_id == challengeData.level_id);
                      if (selectedLevel) {
                        const colorClass = getLevelColorClass(selectedLevel.color);
                        return (
                          <span className={`text-sm font-medium ${colorClass}`}>
                            선택된 난이도: {selectedLevel.level_name} ({selectedLevel.exp} 경험치)
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  카테고리 *
                </label>
                <select
                  name="category_id"
                  value={challengeData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
                {/* 선택된 카테고리 정보 표시 */}
                {challengeData.category_id && (
                  <div className="mt-2 p-2 rounded-lg glass-effect">
                    {(() => {
                      const selectedCategory = categories.find(c => c.category_id == challengeData.category_id);
                      if (selectedCategory) {
                        const emoji = getCategoryEmoji(selectedCategory.category_name);
                        return (
                          <span className="text-sm font-medium text-blue-400">
                            {emoji} 선택된 카테고리: {selectedCategory.category_name}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>

              {/* 언어 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  프로그래밍 언어 *
                </label>
                <select
                  name="language"
                  value={challengeData.language}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="">언어를 선택하세요</option>
                  {languages.map(language => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                {/* 선택된 언어 정보 표시 */}
                {challengeData.language && (
                  <div className="mt-2 p-2 rounded-lg glass-effect">
                    {(() => {
                      const info = getLanguageInfo(challengeData.language);
                      return (
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${info.color}`}>
                            {info.emoji} {challengeData.language}
                          </span>
                          <span className="text-xs text-gray-400">
                            {info.description}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* 문제 내용 */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                <FaCode className="inline mr-2" />
                문제 설명 *
              </label>
              <textarea
                name="content"
                value={challengeData.content}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                style={{ color: 'var(--text-primary)' }}
                placeholder="문제에 대한 상세한 설명을 입력하세요.&#10;&#10;예:&#10;두 정수 A와 B를 입력받은 다음, A+B를 출력하는 프로그램을 작성하시오.&#10;&#10;입력:&#10;첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)&#10;&#10;출력:&#10;첫째 줄에 A+B를 출력한다."
              />
            </div>

            {/* 힌트 */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                <FaLightbulb className="inline mr-2" />
                힌트 (선택사항)
              </label>
              <textarea
                name="hint"
                value={challengeData.hint}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                style={{ color: 'var(--text-primary)' }}
                placeholder="문제 해결에 도움이 되는 힌트를 입력하세요. (선택사항)"
              />
            </div>

            {/* 정답 */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                정답 코드 *
              </label>
              <textarea
                name="correct"
                value={challengeData.correct}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                style={{ color: 'var(--text-primary)' }}
                placeholder="정답 코드를 입력하세요.&#10;&#10;예:&#10;import java.util.Scanner;&#10;&#10;public class Main {&#10;    public static void main(String[] args) {&#10;        Scanner sc = new Scanner(System.in);&#10;        int A = sc.nextInt();&#10;        int B = sc.nextInt();&#10;        System.out.println(A + B);&#10;    }&#10;}"
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/mypage-admin')}
                className="px-6 py-3 rounded-xl glass-effect hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-primary)' }}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
                disabled={isSubmitting}
              >
                <FaSave />
                {isSubmitting ? '등록 중...' : '문제 등록'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default ChallengeRegister;