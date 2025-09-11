/**
 * ProblemSolver 페이지
 * 
 * 코딩 문제를 풀 수 있는 통합된 환경을 제공하는 페이지입니다.
 * LeetCode, HackerRank 등의 온라인 저지 스타일을 참고하여 제작했습니다.
 * 
 * 주요 기능:
 * - 분할된 레이아웃 (문제 설명 | 코드 에디터)
 * - 언어 선택 및 자동 템플릿 로딩
 * - 실시간 AI 채팅 도우미
 * - 코드 실행 및 테스트
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
  FaChevronRight
} from 'react-icons/fa';

// 컴포넌트 imports
import ProblemDescription from '../components/ProblemDescription';
import CodeEditor from '../components/CodeEditor';
import { getLanguageTemplate, getMonacoLanguageId } from '../components/LanguageSelector';
import ChatSidebar from '../components/ChatSidebar';
import { simpleCodeValidation } from '../services/apiService';
import '../styles/style.css';

// API imports
import { challengeAPI, transformChallengeData, handleAPIError } from '../utils/api';

function ProblemSolver() {
  const { challenge_id  } = useParams();
  
  // 에디터 ref
  const editorRef = useRef(null);
  
  // 스크롤 위치 유지를 위한 ref
  const scrollContainerRef = useRef(null);
  const lastScrollPositionRef = useRef(0);
  
  // 상태 관리
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProblemOpen, setIsProblemOpen] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const handleRunComplete = useCallback((result) => {
    // result: { success: boolean, runtimeMs: number, error: string|null, logs: string[] }
    setIsRunning(false);
    const success = !!result && result.success === true && !result.error;
    const outputText = Array.isArray(result?.logs) ? result.logs.join('\n') : '';
    const runtime = typeof result?.runtimeMs === 'number' ? result.runtimeMs : 0;
    const testResult = {
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
    setTestResults(testResult);
  }, []);
  const [resultsPanelHeight, setResultsPanelHeight] = useState(0);
  const [isResizingResults, setIsResizingResults] = useState(false);
  const resultsPanelRef = useRef(null);
  const resultsDragStartRef = useRef({ startY: 0, startHeight: 0 });
  
  // 패널 크기 상태 (px 단위) - 더 합리적인 기본값으로 조정
  const [problemPanelWidth, setProblemPanelWidth] = useState(350);
  const [chatPanelWidth, setChatPanelWidth] = useState(350);
  const [isDragging, setIsDragging] = useState({ problem: false, chat: false });

  // 문제 데이터 및 로딩 상태
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 헬퍼 함수들 - 먼저 정의
  const getDifficultyColor = (difficulty) => {
    console.log('🔍 getDifficultyColor 호출:', difficulty);
    switch (difficulty) {
      case 'beginner': 
        console.log('✅ beginner 케이스 실행');
        return 'text-green-400 bg-green-500/10';
      case 'intermediate': 
        console.log('✅ intermediate 케이스 실행');
        return 'text-yellow-400 bg-yellow-500/10';
      case 'advanced': 
        console.log('✅ advanced 케이스 실행');
        return 'text-red-400 bg-red-500/10';
      default: 
        console.log('⚠️ default 케이스 실행 - 매칭되지 않음:', difficulty);
        return 'text-gray-400 bg-gray-500/10';
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

  // 데이터 매핑 테이블
  const difficultyMapping = {
    '초급': 'beginner',
    '중급': 'intermediate',
    '고급': 'advanced'
  };

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

  // 문제 데이터 로딩
  useEffect(() => {
    const loadProblemData = async (id) => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🎯 문제 데이터 로딩 시작 - ID: ${id}`);
        
        // 백엔드 API 호출
        const response = await challengeAPI.getChallengeDetail(id);
        const problemData = transformChallengeData(response);
        
        console.log(`✅ API에서 문제 데이터 로딩 완료:`, problemData);
        setProblem(problemData);
        
      } catch (error) {
        console.error(`❌ 문제 데이터 로딩 실패:`, error);
        
        // 사용자 친화적인 에러 메시지
        let errorMessage = '문제를 불러오는 중 오류가 발생했습니다.';
        
        if (error.message.includes('Failed to fetch')) {
          errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
        } else if (error.message.includes('404')) {
          errorMessage = '요청한 문제를 찾을 수 없습니다.';
        } else if (error.message.includes('500')) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (challenge_id) {
      loadProblemData(challenge_id);
    }
  }, [challenge_id]);
    
    // 문제가 변경되면 코드도 해당 언어의 기본 템플릿으로 초기화
  useEffect(() => {
    if (problem) {
      // 백엔드 언어명을 프론트엔드 언어 ID로 변환
      const getLanguageIdFromBackend = (backendLanguage) => {
        const languageMap = {
          'C++': 'cpp',
          'Java': 'java',
          'Python': 'python',
          'JavaScript': 'javascript',
          'C': 'c',
          'Rust': 'rust',
          'Go': 'go'
        };
        return languageMap[backendLanguage] || 'javascript';
      };
      
      const languageId = getLanguageIdFromBackend(problem.language);
      setSelectedLanguage(languageId);
      const template = getLanguageTemplate(languageId);
    setCode(template);
    }
  }, [problem]);

  // 컴포넌트 언마운트 시 클린업
  useEffect(() => {
    return () => {
      // 모든 timeout 정리
      if (window.chatToggleTimeout) {
        clearTimeout(window.chatToggleTimeout);
        window.chatToggleTimeout = null;
      }
      if (window.problemToggleTimeout) {
        clearTimeout(window.problemToggleTimeout);
        window.problemToggleTimeout = null;
      }
    };
  }, []);

  // 언어 변경 시 템플릿 로딩
  useEffect(() => {
    const template = getLanguageTemplate(selectedLanguage);
    setCode(template);
  }, [selectedLanguage]);

  // 언어 변경 핸들러
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.id);
  };

  // 코드 실행 핸들러 (개선된 피드백)
  const handleRunCode = useCallback(async () => {
    if (isRunning) return;
    
    if (!code.trim()) {
      // 사용자에게 피드백 제공
      if (editorRef.current?.getEditor) {
        const editor = editorRef.current.getEditor();
        editor.focus();
      }
      return;
    }

    setIsRunning(true);
    setTestResults(null);
    // 임시 실행 모의 제거: 실행은 에디터 내부(JS는 워커 실행, 그 외 언어는 미지원 안내)
    setTimeout(() => setIsRunning(false), 100);
  }, [isRunning, code]);

  // 코드 제출 핸들러 (LLM 검증)
  const handleSubmitCode = async () => {
    if (isSubmitting || !code.trim()) return;

    if (!problem) {
      console.error('❌ 문제 정보가 없습니다.');
      return;
    }

    console.log('🚀 코드 제출 시작:', {
      language: selectedLanguage,
      codeLength: code.length,
      problemTitle: problem.title
    });

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {

      // LLM을 통한 코드 검증 API 호출
      const validationResult = await simpleCodeValidation(
        code.trim(),
        problem.description || problem.title,
        selectedLanguage
      );

      // 📊 로그 출력 - LLM 검증 결과
      console.log('📊 LLM 코드 검증 결과:', {
        passed: validationResult.passed,
        feedback: validationResult.feedback,
        suggestions: validationResult.suggestions
      });

      // ✅/❌ 최종 판정 로그
      if (validationResult.passed) {
        console.log('✅ 코드 제출 성공! LLM 판정: PASS (true)');
      } else {
        console.log('❌ 코드 제출 실패! LLM 판정: FAIL (false)');
      }

      // 제출 결과를 상태에 저장
      setSubmissionResult({
        passed: validationResult.passed,
        feedback: validationResult.feedback,
        suggestions: validationResult.suggestions || [],
        timestamp: new Date().toISOString()
      });

      // 사용자에게 알림 (선택사항)
      if (validationResult.passed) {
        console.log('🎉 축하합니다! 문제를 성공적으로 해결했습니다!');
      } else {
        console.log('💡 아직 개선할 점이 있어요. LLM의 피드백을 확인해보세요.');
      }

    } catch (error) {
      console.error('❌ 코드 제출 오류:', error);
      
      // 에러 로그
      console.log('❌ LLM 판정: ERROR (API 호출 실패)');
      
      setSubmissionResult({
        passed: false,
        feedback: '코드 제출 중 오류가 발생했습니다. 다시 시도해주세요.',
        suggestions: ['네트워크 연결을 확인해보세요', '잠시 후 다시 시도해보세요'],
        timestamp: new Date().toISOString(),
        error: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 뒤로가기
  const handleGoBack = () => {
    window.history.back();
  };

  // 드래그 핸들러들
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
      // 문제 패널: 마우스 X 위치가 패널 너비가 됨 (최소 250px, 최대 600px)
      const containerRect = scrollContainerRef.current?.getBoundingClientRect();
      const containerLeft = containerRect?.left || 0;
      const relativeX = e.clientX - containerLeft;
      const newWidth = Math.max(250, Math.min(600, relativeX));
      setProblemPanelWidth(newWidth);
    }
    
    if (isDragging.chat) {
      // 채팅 패널: 화면 오른쪽에서 마우스까지의 거리가 패널 너비가 됨
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
      const delta = resultsDragStartRef.current.startY - e.clientY; // 위로 드래그 시 높이 증가
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

  // 스크롤 위치 저장
  const saveScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      lastScrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  }, []);

  // 스크롤 위치 복원
  const restoreScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: lastScrollPositionRef.current,
        behavior: 'auto'
      });
    }
  }, []);

  // AI 채팅 토글 (스크롤 위치 유지 포함)
  const debouncedToggleChat = useCallback(() => {
    if (window.chatToggleTimeout) return;
    
    // 현재 스크롤 위치 저장
    saveScrollPosition();
    
    window.chatToggleTimeout = setTimeout(() => {
      setIsChatOpen(prev => !prev);
      
      // 레이아웃 변경 후 스크롤 위치 복원 및 에디터 업데이트
      setTimeout(() => {
        restoreScrollPosition();
        if (editorRef.current?.updateLayout) {
          editorRef.current.updateLayout();
        }
      }, 350);
      
      window.chatToggleTimeout = null;
    }, 50); // 더 빠른 응답을 위해 300ms에서 50ms로 변경
  }, [saveScrollPosition, restoreScrollPosition]);

  // 문제 패널 토글 (스크롤 위치 유지 포함)
  const debouncedToggleProblem = useCallback(() => {
    if (window.problemToggleTimeout) return;
    
    // 현재 스크롤 위치 저장
    saveScrollPosition();
    
    window.problemToggleTimeout = setTimeout(() => {
      setIsProblemOpen(prev => !prev);
      
      // 레이아웃 변경 후 스크롤 위치 복원 및 에디터 업데이트
      setTimeout(() => {
        restoreScrollPosition();
        if (editorRef.current?.updateLayout) {
          editorRef.current.updateLayout();
        }
      }, 350);
      
      window.problemToggleTimeout = null;
    }, 50); // 더 빠른 응답을 위해 300ms에서 50ms로 변경
  }, [saveScrollPosition, restoreScrollPosition]);

  // 키보드 단축키 지원 (함수들이 정의된 후에 위치)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shift + P: 문제 패널 토글
      if (e.shiftKey && e.key === 'P') {
        e.preventDefault();
        debouncedToggleProblem();
      }
      // Shift + A: AI 채팅 패널 토글
      else if (e.shiftKey && e.key === 'A') {
        e.preventDefault();
        debouncedToggleChat();
      }
      // Ctrl/Cmd + R: 코드 실행
      else if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (!isRunning && code.trim()) {
          handleRunCode();
        }
      }
      // F11: 전체화면 (에디터)
      else if (e.key === 'F11') {
        e.preventDefault();
        // 에디터 전체화면 토글 로직 (필요시 구현)
      }
      // ESC: 현재 실행 중인 작업 취소
      else if (e.key === 'Escape') {
        if (isRunning) {
          // 실행 취소 로직 (필요시 구현)
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [debouncedToggleProblem, debouncedToggleChat, handleRunCode, isRunning, code]);

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>문제를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            문제를 불러올 수 없습니다
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {error}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  // 문제 데이터가 없는 경우
  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❓</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            문제를 찾을 수 없습니다
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            요청한 문제 ID: {challenge_id }
          </p>
        </div>
      </div>
    );
  }

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

          {/* 언어 표시 */}
          {problem.language && (
            <span 
              className="text-xs px-2 py-1 rounded-full font-bold"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: '1px solid #1d4ed8',
                display: 'inline-block',
                minWidth: '50px',
                textAlign: 'center'
              }}
            >
              {problem.language}
            </span>
          )}

          {/* 문제 제목 */}
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {problem.title}
            </h1>
            <span className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              // 🔥 인라인 스타일로 강제 적용 (Tailwind CSS 문제 우회)
              backgroundColor: problem.difficulty === '고급' ? 'rgba(239, 68, 68, 0.1)' : 
                             problem.difficulty === '중급' ? 'rgba(234, 179, 8, 0.1)' : 
                             problem.difficulty === '초급' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
              color: problem.difficulty === '고급' ? '#f87171' : 
                    problem.difficulty === '중급' ? '#eab308' : 
                    problem.difficulty === '초급' ? '#4ade80' : '#9ca3af'
            }}>
              {getDifficultyText(difficultyMapping[problem.difficulty])}
            </span>
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
                  문제 설명
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
                <ProblemDescription
                  problem={problem}
                  onBookmark={() => {}}
                  onShare={() => {}}
                  isBookmarked={false}
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
              value={code}
              onChange={setCode}
              language={getMonacoLanguageId(selectedLanguage)}
              height="100%"
              showToolbar={true}
              onRun={handleRunCode}
              onRunComplete={handleRunComplete}
              isRunning={isRunning}
              onSubmit={handleSubmitCode}
              isSubmitting={isSubmitting}
              submissionResult={submissionResult}
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

          {/* LLM 제출 결과 */}
          {submissionResult && (
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
                  resultsDragStartRef.current.startHeight = resultsPanelHeight || (resultsPanelRef.current?.getBoundingClientRect().height || 200);
                  setIsResizingResults(true);
                }}
                className="w-full h-2 cursor-row-resize hover:bg-blue-500/30"
                aria-label="검증 패널 크기 조정"
                title="위/아래로 드래그하여 크기 조절"
              />
              <div className="p-4 overflow-y-auto" style={{ maxHeight: resultsPanelHeight ? resultsPanelHeight - 16 : 240 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    LLM 검증 결과
                  </h3>
                  {submissionResult.passed ? (
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
                  <span>{new Date(submissionResult.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* LLM 피드백 */}
              <div className={`p-3 rounded-lg border ${
                submissionResult.passed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className={`flex items-center space-x-2 mb-2 ${
                  submissionResult.passed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {submissionResult.passed ? <FaCheck /> : <FaTimes />}
                  <span className="font-medium">AI 멘토의 피드백</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {submissionResult.feedback}
                </p>
              </div>

              {/* LLM 제안사항 */}
              {submissionResult.suggestions && submissionResult.suggestions.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    개선 제안사항:
                  </h4>
                  <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {submissionResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
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
                  currentCode={code}
                  currentLanguage={selectedLanguage}
                  problemDescription={problem?.description || ''}
                  problemTopic={problem?.category || ''}
                  difficultyLevel={problem?.difficulty?.toLowerCase() || 'beginner'}
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

      {/* 드래그 중일 때 전체 화면 오버레이 - 개선된 UI */}
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

export default ProblemSolver; 