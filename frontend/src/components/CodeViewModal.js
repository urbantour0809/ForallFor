import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaComments, FaCopy, FaUser, FaCode, FaCalendar, FaCheckCircle, FaTimesCircle, FaTrophy } from 'react-icons/fa';

const CodeViewModal = ({ isOpen, onClose, submission, onStartChat }) => {
  // 훅은 컴포넌트 최상단에서 호출되어야 함
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // 실제 데이터 구조: 단일 제출 내역
  const { 
    user_id, 
    test_id, 
    test_sub_id,
    user_name, 
    user_email, 
    submitted_date, 
    submitted_time, 
    result, 
    correct_count, 
    wrong_count, 
    test_title, 
    code, 
    language 
  } = submission || {};

  // 하드코딩된 5문제 정보 (백업)
  const fallbackProblems = [
    {
      problemId: 1,
      title: "배열 최댓값 찾기",
      result: "정답",
      code: `public class Solution {\n    public int findMax(int[] arr) {\n        int max = arr[0];\n        for (int i = 1; i < arr.length; i++) {\n            if (arr[i] > max) {\n                max = arr[i];\n            }\n        }\n        return max;\n    }\n}`,
      language: "Java"
    },
    {
      problemId: 2,
      title: "문자열 뒤집기",
      result: "정답",
      code: `public class Solution {\n    public String reverseString(String str) {\n        StringBuilder sb = new StringBuilder(str);\n        return sb.reverse().toString();\n    }\n}`,
      language: "Java"
    },
    {
      problemId: 3,
      title: "팩토리얼 계산",
      result: "오답",
      code: `public class Solution {\n    public int factorial(int n) {\n        // 잘못된 구현\n        int result = 1;\n        for (int i = 1; i <= n; i++) {\n            result *= i;\n        }\n        return result;\n    }\n}`,
      language: "Java"
    },
    {
      problemId: 4,
      title: "소수 판별",
      result: "정답",
      code: `public class Solution {\n    public boolean isPrime(int n) {\n        if (n <= 1) return false;\n        if (n <= 3) return true;\n        if (n % 2 == 0 || n % 3 == 0) return false;\n        \n        for (int i = 5; i * i <= n; i += 6) {\n            if (n % i == 0 || n % (i + 2) == 0) {\n                return false;\n            }\n        }\n        return true;\n    }\n}`,
      language: "Java"
    },
    {
      problemId: 5,
      title: "피보나치 수열",
      result: "정답",
      code: `public class Solution {\n    public int fibonacci(int n) {\n        if (n <= 1) return n;\n        \n        int prev = 0, curr = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = curr;\n            curr = prev + curr;\n            prev = temp;\n        }\n        return curr;\n    }\n}`,
      language: "Java"
    }
  ];

  // 결과 데이터 로드
  useEffect(() => {
    let ignore = false;
    async function fetchResult() {
      try {
        if (!isOpen || !user_id || !test_id) return;
        setIsLoading(true);
        setLoadError(null);
        // 서버에서 제출자별 테스트 문제 결과/코드 조회
        const res = await axios.get('http://localhost:8080/FAF/api/user/test/result', {
          params: { user_id: user_id, test_id: test_id },
          withCredentials: true
        });
        const data = res.data;
        console.log('모달 문제 결과 데이터:', data);
        if (ignore) return;

        // 백엔드 구조: { testSubDetailDTO, testSubAnswerDetailList, testProblemList }
        const testProblemList = data?.testProblemList;
        const testSubAnswerDetailList = data?.testSubAnswerDetailList;

        if (Array.isArray(testProblemList) && Array.isArray(testSubAnswerDetailList)) {
          const answerByProblemId = new Map(
            testSubAnswerDetailList.map(ad => [ad.test_problem_id, ad])
          );

          const mappedFromBackend = testProblemList.map((p, idx) => {
            const ad = answerByProblemId.get(p.test_problem_id) || {};
            const passFlag = typeof ad.pass === 'boolean'
              ? ad.pass
              : (ad.pass === 'Y' || ad.pass === '1');
            return {
              problemId: p.test_problem_id ?? (idx + 1),
              title: p.title ?? `문제 ${idx + 1}`,
              result: passFlag ? '정답' : '오답',
              code: ad.sub_code || '',
              language: 'Java'
            };
          });

          setProblems(mappedFromBackend);
          setSelectedProblemIndex(0);
          return;
        }

        // 유연한 매핑 (기존 대비 호환: data가 배열이거나 {problems:[...]} 형태)
        const items = Array.isArray(data) ? data : (data.problems || []);
        const mappedFallback = items.map((item, idx) => ({
          problemId: item.problemId ?? item.test_problem_id ?? (idx + 1),
          title: item.title ?? item.problem_title ?? `문제 ${idx + 1}`,
          result: (item.result ?? item.pass ?? item.correct) ? '정답' : '오답',
          code: item.code ?? item.sub_code ?? '',
          language: item.language ?? 'Java'
        }));
        setProblems(mappedFallback);
        setSelectedProblemIndex(0);
      } catch (e) {
        console.error('문제 결과 로드 실패:', e);
        setLoadError('문제 결과를 불러오지 못했습니다.');
        setProblems([]); // fallback 사용
      } finally {
        setIsLoading(false);
      }
    }
    fetchResult();
    return () => { ignore = true; };
  }, [isOpen, user_id, test_id]);

  // 표시용 문제 목록 (서버 응답 우선, 없으면 하드코딩)
  const effectiveProblems = problems.length > 0 ? problems : fallbackProblems;
  const safeIndex = Math.min(selectedProblemIndex, Math.max(0, effectiveProblems.length - 1));
  const currentProblem = effectiveProblems[safeIndex] || { title: '', code: '', result: '오답' };

  // 가드: 훅 호출 이후 배치 (규칙 준수)
  if (!isOpen || !submission) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentProblem.code || '');
    alert('코드가 복사되었습니다!');
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getResultIcon = (result) => {
    return result === '정답' ? (
      <FaCheckCircle className="text-green-400" size={16} />
    ) : (
      <FaTimesCircle className="text-red-400" size={16} />
    );
  };

  // 통계 계산
  const passedCount = effectiveProblems.filter(p => p.result === '정답').length;
  const failedCount = effectiveProblems.length - passedCount;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-600">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{user_name}님의 테스트 결과</h3>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{test_title}</span>
              <span className={`px-3 py-1 rounded text-sm font-bold ${
                result === '합격' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                결과: {result}
              </span>
              <span className="text-gray-400 text-sm">
                {submitted_date} {submitted_time}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* 왼쪽: 문제 목록 */}
          <div className="w-80 border-r border-gray-600 bg-gray-700/30 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">문제 목록 ({effectiveProblems.length}개)</h4>
                <div className="flex items-center gap-1">
                  <FaTrophy className="text-yellow-400" size={14} />
                  <span className="text-sm text-gray-300">{passedCount}/{effectiveProblems.length}</span>
                </div>
              </div>
              
              {/* 통계 요약 */}
              <div className="mb-4 p-3 bg-gray-600/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">정답: {passedCount}개</span>
                  <span className="text-red-400">오답: {failedCount}개</span>
                </div>
              </div>

              {isLoading && problems.length === 0 && (
                <div className="text-center text-gray-400 py-6">문제 결과를 불러오는 중...</div>
              )}
              {loadError && problems.length === 0 && (
                <div className="text-center text-red-400 py-6">{loadError}</div>
              )}

              <div className="space-y-3">
                {effectiveProblems.map((problem, index) => (
                  <div 
                    key={problem.problemId ?? index}
                    className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-600/50 ${
                      safeIndex === index ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-gray-600/30'
                    }`}
                    onClick={() => setSelectedProblemIndex(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">문제 {index + 1}</span>
                      {getResultIcon(problem.result)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-gray-200 truncate" title={problem.title}>
                        {problem.title}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          problem.result === '정답' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {problem.result}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 선택된 문제 코드 상세 */}
          <div className="flex-1 flex flex-col">
            {/* 선택된 문제 정보 */}
            <div className="p-6 border-b border-gray-600 bg-gray-700/30">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {safeIndex + 1}
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white mb-1">{currentProblem.title}</h5>
                    <p className="text-gray-400 text-sm">문제 {safeIndex + 1} / {effectiveProblems.length}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    <FaCopy size={14} />
                    복사
                  </button>
                  <button
                    onClick={() => onStartChat(submission)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    <FaComments size={14} />
                    채팅하기
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-400" size={14} />
                  <span className="text-sm text-gray-300">
                    <span className="text-gray-500">제출자:</span> {user_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getResultIcon(currentProblem.result)}
                  <span className={`px-3 py-1 rounded text-sm font-bold ${
                    currentProblem.result === '정답' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {currentProblem.result}
                  </span>
                </div>
              </div>
            </div>

            {/* 코드 영역 */}
            <div className="flex-1 p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-white">제출된 코드</h4>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">
                    문제 {safeIndex + 1} / {effectiveProblems.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProblemIndex(Math.max(0, safeIndex - 1))}
                      disabled={safeIndex === 0}
                      className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded transition-colors"
                    >
                      이전
                    </button>
                    <button
                      onClick={() => setSelectedProblemIndex(Math.min(effectiveProblems.length - 1, safeIndex + 1))}
                      disabled={safeIndex === effectiveProblems.length - 1}
                      className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded transition-colors"
                    >
                      다음
                    </button>
                  </div>
                </div>
              </div>

              {/* 코드 표시 영역 */}
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto h-full border border-gray-600">
                {currentProblem.code ? (
                  <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap leading-relaxed">
                    {currentProblem.code}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FaCode size={48} className="mx-auto mb-4 opacity-30" />
                      <p>코드가 제출되지 않았습니다.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-600 bg-gray-700/30 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {test_title} • 총 {effectiveProblems.length}문제 • 정답: {passedCount}개 • 오답: {failedCount}개 • 제출자: {user_name}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeViewModal; 