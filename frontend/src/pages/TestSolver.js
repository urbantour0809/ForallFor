/**
 * TestSolver 페이지
 * 
 * 5개 문제로 구성된 코딩 테스트를 풀 수 있는 통합된 환경을 제공하는 페이지입니다.
 * ProblemSolver를 기반으로 하되, 5개 문제 네비게이션 기능이 추가되었습니다.
 * 
 * 주요 기능:
 * - 5개 문제 네비게이션 (TestDescription 컴포넌트)
 * - 각 문제별 독립적인 코드 및 제출 결과 관리
 * - 문제별 통과/불통과 상태 시각화
 * - 실시간 AI 채팅 도우미
 * - 반응형 디자인 지원
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  FaListAlt,
  FaRobot, 
  FaCheck, 
  FaTimes,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaClock
} from 'react-icons/fa';

// 컴포넌트 imports
import TestDescription from '../components/TestDescription';
import CodeEditor from '../components/CodeEditor';
import { getLanguageTemplate, getMonacoLanguageId } from '../components/LanguageSelector';
import ChatSidebar from '../components/ChatSidebar';
import { simpleCodeValidation } from '../services/apiService';
import '../styles/style.css';

function TestSolver() {
  const { testId } = useParams();
  
  // 에디터 ref
  const editorRef = useRef(null);
  
  // 스크롤 위치 유지를 위한 ref
  const scrollContainerRef = useRef(null);
  const lastScrollPositionRef = useRef(0);
  
  // 기본 상태 관리
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProblemOpen, setIsProblemOpen] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRunComplete = useCallback((result) => {
    setIsRunning(false);
    const success = !!result && result.success === true && !result.error;
    const outputText = Array.isArray(result?.logs) ? result.logs.join('\n') : '';
    const runtime = typeof result?.runtimeMs === 'number' ? result.runtimeMs : 0;
    const newTestResults = {
      success,
      runtime,
      memory: 0,
      totalTests: 1,
      passedTests: success ? 1 : 0,
      error: result?.error || null,
      testCases: [
        {
          passed: success,
          runtime,
          input: '-',
          output: outputText || (result?.error ? '' : '(출력 없음)'),
          expected: '-'
        }
      ]
    };
    setTestResults(newTestResults);
  }, []);
  const [resultsPanelHeight, setResultsPanelHeight] = useState(0);
  const [isResizingResults, setIsResizingResults] = useState(false);
  const resultsPanelRef = useRef(null);
  const resultsDragStartRef = useRef({ startY: 0, startHeight: 0 });
  
  // 테스트 관련 상태 관리
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [testProblems, setTestProblems] = useState([]);
  const [problemCodes, setProblemCodes] = useState(Array(5).fill(''));
  const [problemResults, setProblemResults] = useState(Array(5).fill(null));
  // 제출/잠금/집계 상태
  const [submittedProblems, setSubmittedProblems] = useState(Array(5).fill(false));
  const [lockedProblems, setLockedProblems] = useState(Array(5).fill(false));
  const [allSubmitted, setAllSubmitted] = useState(false);
  const [allResultsReady, setAllResultsReady] = useState(false);
  
  // 패널 크기 상태
  const [problemPanelWidth, setProblemPanelWidth] = useState(350);
  const [chatPanelWidth, setChatPanelWidth] = useState(350);
  const [isDragging, setIsDragging] = useState({ problem: false, chat: false });

  // 기타 상태
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    // ResizeObserver 에러 무시 (Monaco Editor 관련 브라우저 에러)
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('ResizeObserver loop completed')) {
        return;
      }
      originalError(...args);
    };

    // 컴포넌트 언마운트 시 원래 console.error 복원
    return () => {
      console.error = originalError;
    };
  }, []);

  // 테스트 데이터 로딩
  useEffect(() => {
    const loadTestData = (id) => {
      // 실제 구현에서는 API 호출: await fetchTest(id);
      
      // 임시 테스트 데이터 - 5개 문제로 구성
      const testData = {
        1: [
          {
            id: 1,
            title: "배열 최댓값 찾기",
            difficulty: "Easy",
            description: `주어진 배열에서 최댓값을 찾는 알고리즘을 구현하세요.

**문제 설명:**
- 정수 배열 \`nums\`가 주어집니다.
- 배열에서 가장 큰 값을 찾아 반환하세요.
- 배열은 최소 1개 이상의 원소를 가집니다.`,
            examples: [
              {
                input: "nums = [3, 7, 2, 9, 1]",
                output: "9",
                explanation: "배열에서 가장 큰 값은 9입니다."
              }
            ],
            constraints: [
              "1 ≤ nums.length ≤ 10⁴",
              "-10⁹ ≤ nums[i] ≤ 10⁹"
            ],
            hints: [
              "배열을 한 번 순회하면서 최댓값을 추적하세요."
            ],
            tags: ["Array", "Math"],
            category: "Algorithm",
            timeLimit: "1분",
            memoryLimit: "256MB",
            acceptanceRate: 92.5,
            submissions: 15847,
            accepted: 14659
          },
          {
            id: 2,
            title: "문자열 뒤집기",
            difficulty: "Easy",
            description: `주어진 문자열을 뒤집어 반환하는 함수를 구현하세요.

**문제 설명:**
- 문자열 \`s\`가 주어집니다.
- 문자열을 뒤집어서 반환하세요.
- 공백과 특수문자도 포함됩니다.`,
            examples: [
              {
                input: 's = "hello"',
                output: '"olleh"',
                explanation: "문자열을 뒤집으면 olleh가 됩니다."
              }
            ],
            constraints: [
              "1 ≤ s.length ≤ 1000",
              "s는 영문자, 숫자, 공백, 특수문자로 구성"
            ],
            hints: [
              "문자열을 배열로 변환한 후 reverse()를 사용하세요."
            ],
            tags: ["String", "Two Pointers"],
            category: "String",
            timeLimit: "1분",
            memoryLimit: "256MB",
            acceptanceRate: 89.3,
            submissions: 12453,
            accepted: 11118
          },
          {
            id: 3,
            title: "짝수 개수 세기",
            difficulty: "Easy",
            description: `주어진 배열에서 짝수의 개수를 세는 함수를 구현하세요.

**문제 설명:**
- 정수 배열 \`nums\`가 주어집니다.
- 배열에서 짝수인 원소의 개수를 반환하세요.
- 0은 짝수로 간주합니다.`,
            examples: [
              {
                input: "nums = [1, 2, 3, 4, 5, 6]",
                output: "3",
                explanation: "2, 4, 6이 짝수이므로 3개입니다."
              }
            ],
            constraints: [
              "1 ≤ nums.length ≤ 1000",
              "-1000 ≤ nums[i] ≤ 1000"
            ],
            hints: [
              "num % 2 === 0 조건을 사용하여 짝수를 판별하세요."
            ],
            tags: ["Array", "Math"],
            category: "Math",
            timeLimit: "1분",
            memoryLimit: "256MB",
            acceptanceRate: 94.7,
            submissions: 8932,
            accepted: 8456
          },
          {
            id: 4,
            title: "팰린드롬 확인",
            difficulty: "Medium",
            description: `주어진 문자열이 팰린드롬인지 확인하는 함수를 구현하세요.

**문제 설명:**
- 문자열 \`s\`가 주어집니다.
- 대소문자와 공백을 무시하고 팰린드롬인지 확인하세요.
- 팰린드롬이면 true, 아니면 false를 반환하세요.`,
            examples: [
              {
                input: 's = "A man a plan a canal Panama"',
                output: "true",
                explanation: "공백과 대소문자를 무시하면 팰린드롬입니다."
              }
            ],
            constraints: [
              "1 ≤ s.length ≤ 1000",
              "s는 영문자와 공백으로 구성"
            ],
            hints: [
              "두 포인터를 사용하여 양 끝에서 중앙으로 비교하세요."
            ],
            tags: ["String", "Two Pointers"],
            category: "String",
            timeLimit: "2분",
            memoryLimit: "256MB",
            acceptanceRate: 76.2,
            submissions: 6745,
            accepted: 5141
          },
          {
            id: 5,
            title: "두 수의 합",
            difficulty: "Medium",
            description: `배열에서 두 수를 더해 특정 값이 되는 인덱스를 찾는 함수를 구현하세요.

**문제 설명:**
- 정수 배열 \`nums\`와 목표값 \`target\`이 주어집니다.
- 두 수를 더해서 target이 되는 두 인덱스를 반환하세요.
- 정확히 하나의 해가 존재한다고 가정합니다.`,
            examples: [
              {
                input: "nums = [2, 7, 11, 15], target = 9",
                output: "[0, 1]",
                explanation: "nums[0] + nums[1] = 2 + 7 = 9이므로 [0, 1]을 반환합니다."
              }
            ],
            constraints: [
              "2 ≤ nums.length ≤ 1000",
              "-1000 ≤ nums[i] ≤ 1000",
              "-1000 ≤ target ≤ 1000"
            ],
            hints: [
              "해시맵을 사용하여 O(n) 시간에 해결할 수 있습니다."
            ],
            tags: ["Array", "Hash Table"],
            category: "Algorithm",
            timeLimit: "3분",
            memoryLimit: "256MB",
            acceptanceRate: 68.9,
            submissions: 9876,
            accepted: 6803
          }
        ]
      };

      return testData[id] || testData[1];
    };
    
    const problems = loadTestData(parseInt(testId) || 1);
    setTestProblems(problems);
    
    // 각 문제별 초기 코드 템플릿 설정
    const initialCodes = problems.map(() => getLanguageTemplate(selectedLanguage));
    setProblemCodes(initialCodes);
    // 상태 초기화
    setProblemResults(Array(problems.length).fill(null));
    setSubmittedProblems(Array(problems.length).fill(false));
    setLockedProblems(Array(problems.length).fill(false));
    setAllSubmitted(false);
    setAllResultsReady(false);
  }, [testId, selectedLanguage]);

  // 언어 변경 시 모든 문제의 템플릿 업데이트
  useEffect(() => {
    if (testProblems.length > 0) {
      const newCodes = testProblems.map(() => getLanguageTemplate(selectedLanguage));
      setProblemCodes(newCodes);
    }
  }, [selectedLanguage, testProblems]);

  // 현재 코드 (현재 문제의 코드)
  const currentCode = problemCodes[currentProblemIndex] || '';

  // 코드 변경 핸들러
  const handleCodeChange = (newCode) => {
    setProblemCodes(prev => {
      const newCodes = [...prev];
      newCodes[currentProblemIndex] = newCode;
      return newCodes;
    });
  };

  // 문제 변경 핸들러
  const handleProblemChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < testProblems.length) {
      setCurrentProblemIndex(newIndex);
      // 테스트 결과 초기화 (새 문제로 변경 시)
      setTestResults(null);
    }
  };

  // 언어 변경 핸들러
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.id);
  };

  // 코드 실행 핸들러
  const handleRunCode = useCallback(async () => {
    if (isRunning) return;
    
    if (!currentCode.trim()) {
      if (editorRef.current?.getEditor) {
        const editor = editorRef.current.getEditor();
        editor.focus();
      }
      return;
    }

    setIsRunning(true);
    setTestResults(null);
    // 실행은 CodeEditor 컴포넌트 내에서 처리(JS 워커 실행). 여기서는 상태만 동기화.
    setTimeout(() => setIsRunning(false), 100);
  }, [isRunning, currentCode]);

  // 코드 제출 핸들러 (현재 문제만 제출)
  const handleSubmitCode = async () => {
    if (isSubmitting || !currentCode.trim()) return;

    const currentProblem = testProblems[currentProblemIndex];
    if (!currentProblem) {
      console.error('❌ 현재 문제 정보가 없습니다.');
      return;
    }

    console.log('🚀 문제 제출 시작:', {
      problemIndex: currentProblemIndex + 1,
      language: selectedLanguage,
      codeLength: currentCode.length,
      problemTitle: currentProblem.title
    });

    // 제출 즉시: 제출됨/잠금 처리, 다음 문제로 이동, 비동기 검증 시작
    setIsSubmitting(true);
    const submitIndex = currentProblemIndex;
    setSubmittedProblems(prev => { const n=[...prev]; n[submitIndex]=true; return n; });
    setLockedProblems(prev => { const n=[...prev]; n[submitIndex]=true; return n; });

    // 다음 문제로 자동 이동 (존재하면)
    const nextIndex = submitIndex + 1;
    if (nextIndex < testProblems.length) {
      handleProblemChange(nextIndex);
    } else {
      setAllSubmitted(true);
    }
    // 즉시 버튼 상태 해제(UX 비동기)
    setIsSubmitting(false);

    // 비동기 검증 실행
    (async () => {
      try {
        const validationResult = await simpleCodeValidation(
          currentCode.trim(),
          currentProblem.description || currentProblem.title,
          selectedLanguage
        );

        console.log(`📊 문제 ${submitIndex + 1} LLM 검증 결과:`, {
          passed: validationResult.passed,
          feedback: validationResult.feedback
        });

        setProblemResults(prev => {
          const newResults = [...prev];
          newResults[submitIndex] = {
            passed: validationResult.passed,
            feedback: validationResult.feedback,
            suggestions: validationResult.suggestions || [],
            timestamp: new Date().toISOString()
          };
          // 모든 제출이 완료되고 모든 결과가 채워졌는지 확인
          const allSubmittedNow = submittedProblems.map((v, i)=> i===submitIndex? true : v).every(Boolean);
          const allResolved = newResults.every((r, i) => submittedProblems[i] ? r !== null : true);
          if (allSubmittedNow && allResolved) {
            setAllSubmitted(true);
            setAllResultsReady(true);
          }
          return newResults;
        });
      } catch (error) {
        console.error(`❌ 문제 ${submitIndex + 1} 제출 오류:`, error);
        setProblemResults(prev => {
          const newResults = [...prev];
          newResults[submitIndex] = {
            passed: false,
            feedback: '코드 제출 중 오류가 발생했습니다. 다시 시도해주세요.',
            suggestions: ['네트워크 연결을 확인해보세요', '잠시 후 다시 시도해보세요'],
            timestamp: new Date().toISOString(),
            error: true
          };
          const allSubmittedNow = submittedProblems.map((v, i)=> i===submitIndex? true : v).every(Boolean);
          const allResolved = newResults.every((r, i) => submittedProblems[i] ? r !== null : true);
          if (allSubmittedNow && allResolved) {
            setAllSubmitted(true);
            setAllResultsReady(true);
          }
          return newResults;
        });
      }
    })();
  };

  // 현재 문제의 제출 결과
  const currentSubmissionResult = problemResults[currentProblemIndex];

  // 북마크 토글
  const handleBookmark = (problemId) => {
    setIsBookmarked(!isBookmarked);
  };

  // 문제 공유
  const handleShare = (problem) => {
    if (navigator.share) {
      navigator.share({
        title: problem.title,
        text: `${problem.title} - 코딩 테스트 문제`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.log('URL copied to clipboard');
    }
  };

  // 뒤로가기
  const handleGoBack = () => {
    window.history.back();
  };

  // 드래그 핸들러들 (ProblemSolver와 동일)
  const handleProblemResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, problem: true }));
  }, []);

  const handleChatResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, chat: true }));
  }, []);

  const handleMouseMove = useCallback((e) => {
    e.preventDefault();
    
    if (isDragging.problem) {
      const containerRect = scrollContainerRef.current?.getBoundingClientRect();
      const containerLeft = containerRect?.left || 0;
      const relativeX = e.clientX - containerLeft;
      const newWidth = Math.max(250, Math.min(600, relativeX));
      setProblemPanelWidth(newWidth);
    }
    
    if (isDragging.chat) {
      const containerRect = scrollContainerRef.current?.getBoundingClientRect();
      const containerRight = containerRect?.right || window.innerWidth;
      const relativeX = containerRight - e.clientX;
      const newWidth = Math.max(250, Math.min(600, relativeX));
      setChatPanelWidth(newWidth);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging({ problem: false, chat: false });
  }, []);

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging.problem || isDragging.chat) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 결과 패널 드래그 리사이즈 (세로)
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizingResults) return;
      const delta = resultsDragStartRef.current.startY - e.clientY;
      const newHeight = Math.max(120, Math.min(500, resultsDragStartRef.current.startHeight + delta));
      setResultsPanelHeight(newHeight);
    };
    const onMouseUp = () => setIsResizingResults(false);
    if (isResizingResults) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'row-resize';
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizingResults]);

  // 패널 크기 변경 시 에디터 레이아웃 업데이트
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editorRef.current?.updateLayout) {
        editorRef.current.updateLayout();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [problemPanelWidth, chatPanelWidth, isProblemOpen, isChatOpen]);

  // 스크롤 위치 관련 함수들 (ProblemSolver와 동일)
  const saveScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      lastScrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: lastScrollPositionRef.current,
        behavior: 'auto'
      });
    }
  }, []);

  // AI 채팅 토글
  const debouncedToggleChat = useCallback(() => {
    if (window.chatToggleTimeout) return;
    
    saveScrollPosition();
    
    window.chatToggleTimeout = setTimeout(() => {
      setIsChatOpen(prev => !prev);
      
      setTimeout(() => {
        restoreScrollPosition();
        if (editorRef.current?.updateLayout) {
          editorRef.current.updateLayout();
        }
      }, 350);
      
      window.chatToggleTimeout = null;
    }, 50);
  }, [saveScrollPosition, restoreScrollPosition]);

  // 문제 패널 토글
  const debouncedToggleProblem = useCallback(() => {
    if (window.problemToggleTimeout) return;
    
    saveScrollPosition();
    
    window.problemToggleTimeout = setTimeout(() => {
      setIsProblemOpen(prev => !prev);
      
      setTimeout(() => {
        restoreScrollPosition();
        if (editorRef.current?.updateLayout) {
          editorRef.current.updateLayout();
        }
      }, 350);
      
      window.problemToggleTimeout = null;
    }, 50);
  }, [saveScrollPosition, restoreScrollPosition]);

  // 키보드 단축키 지원
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === 'P') {
        e.preventDefault();
        debouncedToggleProblem();
      } else if (e.shiftKey && e.key === 'A') {
        e.preventDefault();
        debouncedToggleChat();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (!isRunning && currentCode.trim()) {
          handleRunCode();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [debouncedToggleProblem, debouncedToggleChat, handleRunCode, isRunning, currentCode]);

  if (!testProblems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentProblem = testProblems[currentProblemIndex];

  return (
    <div 
      ref={scrollContainerRef}
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* 상단 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b glass-effect flex-shrink-0 min-h-[80px]"
        style={{ 
          backgroundColor: 'var(--glass-bg)', 
          borderColor: 'var(--border-color)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div className="flex items-center space-x-4 flex-shrink-0 min-w-0">
          {/* 뒤로가기 버튼 */}
          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="뒤로가기"
          >
            <FaArrowLeft />
          </motion.button>

          {/* 테스트 제목 */}
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              코딩 테스트 #{testId} - 문제 {currentProblemIndex + 1}/5
            </h1>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                currentProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                currentProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {currentProblem.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <FaClock />
                <span>{currentProblem.timeLimit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 빈 공간 - 단순한 헤더로 만들기 위해 버튼들 제거 */}
        <div></div>
      </motion.header>

      {/* 메인 콘텐츠 영역 - 3단 레이아웃 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 문제 패널 토글 버튼 (닫혀있을 때) */}
        {!isProblemOpen && (
          <motion.button
            onClick={debouncedToggleProblem}
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 glass-effect rounded-r-lg border-l-0 shadow-lg"
            style={{
              backgroundColor: 'var(--glass-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            title="문제 설명 열기 (Shift+P)"
          >
            <FaChevronRight />
          </motion.button>
        )}

        {/* 1. 문제 설명 패널 (토글 가능) */}
        <motion.div
          initial={{ width: problemPanelWidth, opacity: 1 }}
          animate={{ 
            width: isProblemOpen ? problemPanelWidth : 0,
            opacity: isProblemOpen ? 1 : 0
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut",
            width: { duration: 0.3 },
            opacity: { duration: isProblemOpen ? 0.3 : 0.15, delay: isProblemOpen ? 0.05 : 0 }
          }}
          className={`${!isProblemOpen ? 'overflow-hidden' : ''} border-r relative flex-shrink-0`}
          style={{ 
            borderColor: 'var(--border-color)',
            minWidth: isProblemOpen ? 250 : 0,
            maxWidth: isProblemOpen ? 600 : 0
          }}
        >
          {isProblemOpen && (
            <div className="h-full relative flex flex-col">
              {/* 문제 패널 헤더 */}
              <div 
                className="flex items-center justify-between p-3 border-b glass-effect flex-shrink-0"
                style={{ 
                  backgroundColor: 'var(--glass-bg)', 
                  borderColor: 'var(--border-color)' 
                }}
              >
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  테스트 문제
                </h2>
                <motion.button
                  onClick={debouncedToggleProblem}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="문제 설명 패널 닫기"
                >
                  <FaChevronLeft />
                </motion.button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TestDescription
                  testProblems={testProblems}
                  currentProblemIndex={currentProblemIndex}
                  onProblemChange={handleProblemChange}
                  problemResults={problemResults}
                  submittedProblems={submittedProblems}
                  lockedProblems={lockedProblems}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  isBookmarked={isBookmarked}
                  problemPanelWidth={problemPanelWidth}
                  className="h-full"
                />
              </div>
            </div>
          )}
          
          {/* 문제 패널 리사이즈 핸들 */}
          {isProblemOpen && (
            <div
              className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition-all duration-200 group ${isDragging.problem ? 'bg-blue-500/70' : ''}`}
              onMouseDown={handleProblemResizeStart}
              style={{ zIndex: 10 }}
              aria-label="문제 패널 크기 조정"
            >
              <div className={`absolute right-0.5 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-blue-500/40 rounded-full ${isDragging.problem ? 'opacity-100 bg-blue-500' : 'opacity-0 group-hover:opacity-100'} transition-all duration-200`} />
              <div className={`absolute right-0.5 top-1/2 transform -translate-y-1/2 w-1 h-8 ${isDragging.problem ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'} transition-opacity duration-200`}>
                <div className="w-full h-0.5 bg-blue-400 mb-1" />
                <div className="w-full h-0.5 bg-blue-400 mb-1" />
                <div className="w-full h-0.5 bg-blue-400" />
              </div>
            </div>
          )}
        </motion.div>

        {/* 2. 코드 에디터 패널 (메인) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col min-w-0"
          style={{ 
            transitionProperty: 'margin-left, margin-right',
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease-in-out'
          }}
        >
          {/* 에디터 */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              ref={editorRef}
              value={currentCode}
              onChange={handleCodeChange}
              language={getMonacoLanguageId(selectedLanguage)}
              height="100%"
              showToolbar={true}
              onRun={handleRunCode}
              onRunComplete={handleRunComplete}
              isRunning={isRunning}
              onSubmit={handleSubmitCode}
              isSubmitting={isSubmitting}
              submissionResult={currentSubmissionResult}
              className="h-full"
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              showLanguageSelector={true}
            />
          </div>

          {/* 테스트 결과 */}
          {testResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              ref={resultsPanelRef}
              className="border-t glass-effect flex-shrink-0 select-none"
              style={{ 
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--glass-bg)',
                height: resultsPanelHeight || 'auto'
              }}
            >
              <div
                onMouseDown={(e) => {
                  resultsDragStartRef.current.startY = e.clientY;
                  resultsDragStartRef.current.startHeight = resultsPanelHeight || (resultsPanelRef.current?.getBoundingClientRect().height || 180);
                  setIsResizingResults(true);
                }}
                className="w-full h-2 cursor-row-resize hover:bg-blue-500/30"
                aria-label="결과 패널 크기 조정"
                title="위/아래로 드래그하여 크기 조절"
              />
              <div className="p-4 overflow-y-auto" style={{ maxHeight: resultsPanelHeight ? resultsPanelHeight - 16 : 200 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    테스트 결과
                  </h3>
                  {testResults.success ? (
                    <span className="flex items-center space-x-1 text-green-400 text-sm">
                      <FaCheck />
                      <span>통과</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-red-400 text-sm">
                      <FaTimes />
                      <span>실패</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>실행시간: {testResults.runtime}ms</span>
                  <span>메모리: {testResults.memory}MB</span>
                  {testResults.totalTests && (
                    <span>
                      {testResults.passedTests || 0}/{testResults.totalTests} 통과
                    </span>
                  )}
                </div>
              </div>

              {testResults.error ? (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-400">
                    <FaTimes />
                    <span className="font-medium">실행 오류</span>
                  </div>
                  <p className="text-sm text-red-300 mt-1">{testResults.error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {testResults.testCases?.map((testCase, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-sm ${
                        testCase.passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                      }`}
                    >
                      {testCase.passed ? (
                        <FaCheck className="text-green-400 flex-shrink-0" />
                      ) : (
                        <FaTimes className="text-red-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-4 mb-1">
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            테스트 케이스 {index + 1}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {testCase.runtime}ms
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-medium">입력:</span> {testCase.input}
                          </div>
                          <div style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-medium">출력:</span> {testCase.output}
                          </div>
                          <div style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-medium">예상:</span> {testCase.expected}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </motion.div>
          )}

          {/* LLM 제출 결과 (테스트 모드에서는 개별 결과 패널 숨김 처리 가능) */}
          {false && currentSubmissionResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t p-4 glass-effect flex-shrink-0"
              style={{ 
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--glass-bg)',
                maxHeight: '250px',
                overflowY: 'auto'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    문제 {currentProblemIndex + 1} LLM 검증 결과
                  </h3>
                  {currentSubmissionResult.passed ? (
                    <span className="flex items-center space-x-1 text-green-400 text-sm">
                      <FaCheck />
                      <span>통과</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-red-400 text-sm">
                      <FaTimes />
                      <span>불통과</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>{new Date(currentSubmissionResult.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* LLM 피드백 */}
              <div className={`p-3 rounded-lg border ${
                currentSubmissionResult.passed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className={`flex items-center space-x-2 mb-2 ${
                  currentSubmissionResult.passed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {currentSubmissionResult.passed ? <FaCheck /> : <FaTimes />}
                  <span className="font-medium">AI 멘토의 피드백</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {currentSubmissionResult.feedback}
                </p>
              </div>

              {/* LLM 제안사항 */}
              {currentSubmissionResult.suggestions && currentSubmissionResult.suggestions.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    개선 제안사항:
                  </h4>
                  <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {currentSubmissionResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* 전체 테스트 집계 결과 */}
          {allSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              ref={resultsPanelRef}
              className="border-t glass-effect flex-shrink-0 select-none"
              style={{ 
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--glass-bg)',
                height: resultsPanelHeight || 'auto'
              }}
            >
              <div
                onMouseDown={(e) => {
                  resultsDragStartRef.current.startY = e.clientY;
                  resultsDragStartRef.current.startHeight = resultsPanelHeight || (resultsPanelRef.current?.getBoundingClientRect().height || 220);
                  setIsResizingResults(true);
                }}
                className="w-full h-2 cursor-row-resize hover:bg-blue-500/30"
                aria-label="집계 패널 크기 조정"
                title="위/아래로 드래그하여 크기 조절"
              />
              <div className="p-4 overflow-y-auto" style={{ maxHeight: resultsPanelHeight ? resultsPanelHeight - 16 : 240 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  전체 테스트 결과
                </h3>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {allResultsReady ? '완료' : '검증 중...'}
                </div>
              </div>
              {allResultsReady ? (
                <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div>
                    총 {problemResults.filter(r=>r?.passed).length}/{testProblems.length} 문제 통과
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {testProblems.map((p, idx) => (
                      <li key={idx} className={`p-2 rounded border ${problemResults[idx]?.passed ? 'border-green-500/30 bg-green-500/10' : problemResults[idx] ? 'border-red-500/30 bg-red-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>문제 {idx+1}: {p.title}</span>
                          <span className={`text-xs ${problemResults[idx]?.passed ? 'text-green-400' : 'text-red-400'}`}>
                            {problemResults[idx]?.passed ? '통과' : (problemResults[idx] ? '불통과' : '대기')}
                          </span>
                        </div>
                        {problemResults[idx]?.feedback && (
                          <div className="mt-1 text-xs">{problemResults[idx]?.feedback}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  일부 문제가 아직 검증 중입니다. 결과를 집계하는 중...
                </div>
              )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* AI 채팅 패널 토글 버튼 (닫혀있을 때) */}
        {!isChatOpen && (
          <motion.button
            onClick={debouncedToggleChat}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 glass-effect rounded-l-lg border-r-0 shadow-lg"
            style={{
              backgroundColor: 'var(--glass-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            title="AI 도우미 열기 (Shift+A)"
          >
            <FaRobot />
          </motion.button>
        )}

        {/* 3. AI 채팅 패널 (토글 가능) */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: isChatOpen ? chatPanelWidth : 0,
            opacity: isChatOpen ? 1 : 0
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut",
            width: { duration: 0.3 },
            opacity: { duration: isChatOpen ? 0.3 : 0.15, delay: isChatOpen ? 0.05 : 0 }
          }}
          className={`${!isChatOpen ? 'overflow-hidden' : ''} border-l relative flex-shrink-0`}
          style={{ 
            borderColor: 'var(--border-color)',
            minWidth: isChatOpen ? 250 : 0,
            maxWidth: isChatOpen ? 600 : 0
          }}
        >
          {isChatOpen && (
            <div className="h-full relative flex flex-col">
              {/* AI 채팅 패널 헤더 */}
              <div 
                className="flex items-center justify-between p-3 border-b glass-effect flex-shrink-0"
                style={{ 
                  backgroundColor: 'var(--glass-bg)', 
                  borderColor: 'var(--border-color)' 
                }}
              >
                <div className="flex items-center space-x-2">
                  <FaRobot className="text-blue-400" />
                  <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    AI 코딩 도우미
                  </h2>
                </div>
                <motion.button
                  onClick={debouncedToggleChat}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="AI 도우미 패널 닫기"
                >
                  <FaChevronRight />
                </motion.button>
              </div>
              
              {/* 채팅 내용 */}
              <div className="flex-1 overflow-hidden">
                <ChatSidebar
                  isOpen={true}
                  onToggle={debouncedToggleChat}
                  currentCode={currentCode}
                  currentLanguage={selectedLanguage}
                  problemDescription={currentProblem?.description || ''}
                  problemTopic={currentProblem?.category || ''}
                  difficultyLevel={currentProblem?.difficulty?.toLowerCase() || 'beginner'}
                  className="border-0 h-full"
                  width="100%"
                />
              </div>
            </div>
          )}
          
          {/* AI 채팅 패널 리사이즈 핸들 */}
          {isChatOpen && (
            <div
              className={`absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/50 transition-all duration-200 group ${isDragging.chat ? 'bg-blue-500/70' : ''}`}
              onMouseDown={handleChatResizeStart}
              style={{ zIndex: 10 }}
              aria-label="AI 채팅 패널 크기 조정"
            >
              <div className={`absolute left-0.5 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-blue-500/40 rounded-full ${isDragging.chat ? 'opacity-100 bg-blue-500' : 'opacity-0 group-hover:opacity-100'} transition-all duration-200`} />
              <div className={`absolute left-0.5 top-1/2 transform -translate-y-1/2 w-1 h-8 ${isDragging.chat ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'} transition-opacity duration-200`}>
                <div className="w-full h-0.5 bg-blue-400 mb-1" />
                <div className="w-full h-0.5 bg-blue-400 mb-1" />
                <div className="w-full h-0.5 bg-blue-400" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* 드래그 중일 때 전체 화면 오버레이 */}
      {(isDragging.problem || isDragging.chat) && (
        <div 
          className="fixed inset-0 z-50 cursor-col-resize"
          style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            backdropFilter: 'blur(2px)'
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-black/90 text-white text-sm rounded-lg shadow-lg border border-blue-500/30">
            {isDragging.problem && (
              <div className="flex items-center space-x-2">
                <FaListAlt className="text-green-400" />
                <span>문제 패널: {problemPanelWidth}px</span>
              </div>
            )}
            {isDragging.chat && (
              <div className="flex items-center space-x-2">
                <FaRobot className="text-blue-400" />
                <span>AI 채팅 패널: {chatPanelWidth}px</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestSolver;
