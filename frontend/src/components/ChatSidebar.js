/**
 * ChatSidebar 컴포넌트
 * 
 * 코드 에디터 오른쪽에 위치하는 LLM 채팅 사이드바입니다.
 * 추후 Python 백엔드와 연동하여 Code LLM과 소통할 수 있는 인터페이스를 제공합니다.
 * 
 * 주요 기능:
 * - 토글 가능한 사이드바 (열기/닫기)
 * - 실시간 채팅 인터페이스
 * - 코드 블록 지원
 * - 메시지 히스토리 관리
 * - 로딩 상태 표시
 * - 채팅 내역 저장/불러오기
 * - 접근성 및 키보드 지원
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaUser, 
  FaCopy, 
  FaCode,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaCog
} from 'react-icons/fa';
import { useChatLLM, useCodeAnalysis, useStepByStepGuide } from '../hooks/useApi';
import '../styles/style.css';

function ChatSidebar({ 
  isOpen = false, 
  onToggle, 
  width = '400px',
  className = '',
  currentCode = '',
  currentLanguage = 'python',
  problemDescription = '',
  problemTopic = '',
  difficultyLevel = 'beginner'
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '안녕하세요! 코딩 도우미 AI입니다. 코드 작성, 디버깅, 최적화 등 무엇이든 도와드릴게요! 😊\n\n**사용 팁:**\n- 현재 코드를 분석받으려면 "코드 전송" 버튼을 클릭하세요\n- 구체적인 질문을 하시면 더 정확한 답변을 드릴 수 있어요\n- Ctrl+Enter로 빠르게 메시지를 전송할 수 있습니다',
      timestamp: new Date().toISOString(),
      isCode: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 메시지 스크롤 자동 조정
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 포커스 관리
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // 약간의 지연을 두어 애니메이션이 완료된 후 포커스
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // 에러 자동 클리어
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  // 복사 성공 메시지 자동 클리어
  useEffect(() => {
    if (copySuccess) {
      const timeoutId = setTimeout(() => {
        setCopySuccess(null);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [copySuccess]);

  // API 훅 사용
  const { sendMessage: sendChatMessage, loading: chatLoading, error: chatError } = useChatLLM();

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      isCode: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // 새로운 API 클라이언트 사용
      const request = {
        message: inputValue.trim(),
        code: currentCode,
        language: currentLanguage,
        history: messages.slice(-10), // 최근 10개 메시지만 컨텍스트로 전송
        difficulty_level: difficultyLevel, // 문제 난이도 사용
        problem_topic: problemTopic, // 문제 주제 사용
        problem_description: problemDescription, // 문제 설명 사용
        request_type: "chat" // 기본 채팅 모드
      };

      const data = await sendChatMessage(request);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        isCode: data.isCode,
        stepNumber: data.step_number,
        codeExample: data.code_example,
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.',
        timestamp: new Date().toISOString(),
        isCode: false
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('메시지 전송에 실패했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  // Enter 키 처리 (접근성 개선)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter 또는 Cmd+Enter로 전송
        e.preventDefault();
        handleSendMessage();
      } else if (!e.shiftKey) {
        // 일반 Enter로 전송 (Shift+Enter는 줄바꿈)
        e.preventDefault();
        handleSendMessage();
      }
    }
    // ESC 키로 채팅 닫기
    else if (e.key === 'Escape' && onToggle) {
      onToggle();
    }
  };

  // 코드 복사 (개선된 피드백)
  const handleCopyCode = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(messageId);
    } catch (error) {
      console.error('Failed to copy code:', error);
      setError('클립보드 복사에 실패했습니다.');
    }
  };

  // 현재 코드 전송
  const handleSendCurrentCode = () => {
    if (!currentCode.trim()) {
      setError('전송할 코드가 없습니다.');
      return;
    }

    const codeMessage = {
      id: Date.now(),
      type: 'user',
      content: `현재 ${currentLanguage} 코드를 검토해주세요:\n\n\`\`\`${currentLanguage}\n${currentCode}\n\`\`\``,
      timestamp: new Date().toISOString(),
      isCode: true
    };

    setMessages(prev => [...prev, codeMessage]);
    
    // 자동으로 메시지 전송
    setTimeout(() => {
      setInputValue('위 코드를 분석하고 개선점을 알려주세요.');
      handleSendMessage();
    }, 500);
  };

  // 채팅 내역 삭제
  const handleClearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'assistant',
      content: '채팅 내역이 삭제되었습니다. 새로운 대화를 시작해보세요! 😊',
      timestamp: new Date().toISOString(),
      isCode: false
    }]);
    setError(null);
    setCopySuccess(null);
  };

  // 모의 응답 생성 (더 다양하고 현실적인 응답)
  const generateMockResponse = (userInput) => {
    const responses = [
      '코드를 분석해보니 몇 가지 개선점이 있어 보입니다:\n\n1. **성능 최적화**: 중복 연산을 줄일 수 있습니다\n2. **가독성 향상**: 변수명을 더 명확하게 할 수 있어요\n3. **에러 처리**: 예외 상황에 대한 처리를 추가해보세요',
      
      '좋은 질문이네요! 이 문제는 다음과 같은 방법으로 해결할 수 있습니다:\n\n```javascript\n// 예시 코드\nfunction solution(arr) {\n  return arr.filter(item => item > 0);\n}\n```\n\n이 접근법의 장점은 **간결함**과 **가독성**입니다.',
      
      '해당 에러는 일반적으로 다음과 같은 원인으로 발생합니다:\n\n• **타입 불일치**: 예상한 타입과 다른 값이 전달됨\n• **null/undefined 접근**: 초기화되지 않은 변수 사용\n• **스코프 문제**: 변수의 유효 범위 확인 필요\n\n단계별로 디버깅해보겠습니다.',
      
      '더 효율적인 알고리즘을 제안드릴게요! 현재 시간 복잡도를 **O(n²)**에서 **O(n log n)**으로 개선할 수 있습니다:\n\n1. 정렬 기반 접근법 사용\n2. 해시 테이블 활용\n3. 투 포인터 기법 적용\n\n어떤 방법이 가장 적합할지 코드를 보여주시면 더 구체적으로 도와드릴게요!',
      
      '코드 리뷰 결과입니다:\n\n✅ **잘된 점:**\n- 함수 분리가 적절히 되어있음\n- 명명 규칙을 잘 따르고 있음\n\n⚠️ **개선점:**\n- 주석 추가로 가독성 향상\n- 에러 처리 로직 강화\n- 테스트 케이스 추가 권장'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // 메시지 렌더링 (Cursor AI/ChatGPT 스타일)
  const renderMessage = (message) => {
    // 코드 블록이 포함된 메시지인지 확인
    const hasCodeBlocks = message.content.includes('```') || message.codeExample;
    const isCodeMessage = message.isCode || hasCodeBlocks;
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
      >
        <div className={`max-w-[90%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
          {/* 메시지 헤더 */}
          <div className="flex items-center mb-2">
            {message.type === 'assistant' && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <FaRobot className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  AI 코딩 도우미
                </span>
                {message.stepNumber && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 font-medium">
                    {message.stepNumber}단계
                  </span>
                )}
              </div>
            )}
            {message.type === 'user' && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <FaUser className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  사용자
                </span>
              </div>
            )}
            <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
              {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          {/* 메시지 내용 */}
          <div
            className={`
              relative group
              ${message.type === 'user' 
                ? 'bg-blue-500/10 border border-blue-500/20' 
                : isCodeMessage 
                  ? 'bg-gray-800/50 border border-gray-700/50' 
                  : 'bg-gray-500/10 border border-gray-600/30'
              }
              rounded-xl overflow-hidden
            `}
          >
            {isCodeMessage ? (
              // 코드 전용 블록 (Cursor AI/ChatGPT 스타일)
              <div className="space-y-0">
                {/* 코드 블록 헤더 */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium ml-2" style={{ color: 'var(--text-secondary)' }}>
                      {currentLanguage.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    
                    <button
                      onClick={() => handleCopyCode(message.content, message.id)}
                      className="text-xs hover:text-blue-400 transition-colors p-1 rounded"
                      style={{ color: 'var(--text-secondary)' }}
                      aria-label="코드 복사"
                    >
                      {copySuccess === message.id ? (
                        <FaCheckCircle className="text-green-400" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* 코드 내용 */}
                <div className="p-4">
                  <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                    <code style={{ color: 'var(--text-primary)' }}>
                      {message.content}
                    </code>
                  </pre>
                </div>
                
                {/* 코드 예시가 있는 경우 */}
                {message.codeExample && (
                  <div className="border-t border-gray-700/50">
                    <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
                      <span className="text-xs font-medium text-blue-400">💡 코드 예시</span>
                    </div>
                    <div className="p-4">
                      <pre className="text-xs font-mono bg-black/30 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                        <code style={{ color: 'var(--text-primary)' }}>
                          {message.codeExample}
                        </code>
                      </pre>
                    </div>
                  </div>
                )}
                
                {/* 제안사항이 있는 경우 */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="border-t border-gray-700/50">
                    <div className="px-4 py-2 bg-green-500/10 border-b border-green-500/20">
                      <span className="text-xs font-medium text-green-400">💡 제안사항</span>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm flex items-start space-x-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 일반 대화 블록
              <div className="p-4 space-y-3">
                {/* 메인 내용 */}
                <div 
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: 'var(--text-primary)' }}
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 600;">$1</strong>')
                      .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>')
                      .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0;"><code>$2</code></pre>')
                  }}
                />
                
                {/* 복사 버튼 */}
                {message.type === 'assistant' && (
                  <button
                    onClick={() => handleCopyCode(message.content, message.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center space-x-1 p-2 rounded hover:bg-white/10"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label="메시지 복사"
                  >
                    {copySuccess === message.id ? (
                      <>
                        <FaCheckCircle className="text-green-400" />
                        <span className="text-green-400">복사됨!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${className}`} style={{ width }}>
      {/* 에러 알림 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg m-3 mb-0"
          >
            <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-300">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 ml-auto"
              aria-label="에러 메시지 닫기"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 툴바 */}
      <div 
        className="flex items-center justify-between p-2 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center space-x-3">
          
          {/* 현재 코드 전송 버튼 */}
          <motion.button
            onClick={handleSendCurrentCode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!currentCode.trim() || isLoading}
            className={`flex items-center space-x-1 px-3 py-2 text-xs rounded-lg transition-colors ${
              currentCode.trim() && !isLoading
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                : 'bg-gray-500/10 text-gray-500 cursor-not-allowed'
            }`}
            title={`현재 ${currentLanguage} 코드 전송`}
            aria-label="현재 코드를 AI에게 전송"
          >
            <FaCode />
            <span>코드 전송</span>
          </motion.button>

          {/* 채팅 삭제 버튼 */}
          <motion.button
            onClick={handleClearChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-2 text-xs rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="채팅 내역 삭제"
            aria-label="채팅 내역 모두 삭제"
          >
            <FaTrash />
            <span>삭제</span>
          </motion.button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map(renderMessage)}
        
        {/* 로딩 인디케이터 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-500/10 px-4 py-3 rounded-2xl glass-effect">
              <div className="flex items-center space-x-3">
                <FaSpinner className="animate-spin text-blue-400" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  AI가 응답 중...
                </span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div 
        className="p-4 border-t"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="AI에게 질문하거나 도움을 요청하세요... (Enter: 전송, Shift+Enter: 줄바꿈, Ctrl+Enter: 빠른 전송)"
              className="w-full px-4 py-3 rounded-lg glass-effect border resize-none placeholder-opacity-60"
              style={{
                backgroundColor: 'var(--glass-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
                minHeight: '60px',
                maxHeight: '120px'
              }}
              rows={2}
              disabled={isLoading}
              aria-label="메시지 입력"
            />
            {inputValue.trim() && (
              <div className="absolute bottom-2 right-2 text-xs opacity-60" style={{ color: 'var(--text-secondary)' }}>
                {inputValue.length}/2000
              </div>
            )}
          </div>
          
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            whileHover={!inputValue.trim() || isLoading ? {} : { scale: 1.05 }}
            whileTap={!inputValue.trim() || isLoading ? {} : { scale: 0.95 }}
            className={`
              px-4 py-3 rounded-lg transition-all duration-150 flex items-center justify-center min-w-[60px]
              ${!inputValue.trim() || isLoading
                ? 'opacity-50 cursor-not-allowed bg-gray-500/20'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
              }
            `}
            aria-label="메시지 전송"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </motion.button>
        </div>
        
        {/* 키보드 단축키 힌트 */}
        <div className="flex items-center justify-between mt-2 text-xs opacity-60" style={{ color: 'var(--text-secondary)' }}>
          <span>Enter: 전송 | Shift+Enter: 줄바꿈</span>
          <span>ESC: 닫기 | Ctrl+Enter: 빠른 전송</span>
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar; 