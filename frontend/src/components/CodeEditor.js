/**
 * CodeEditor 컴포넌트
 * 
 * Monaco Editor를 기반으로 한 코드 에디터 컴포넌트입니다.
 * VSCode와 Cursor AI의 디자인을 참고하여 제작했습니다.
 * 
 * 주요 기능:
 * - Monaco Editor 통합 (VSCode와 동일한 에디터)
 * - 다크/라이트 테마 지원
 * - 자동완성 및 인텔리센스
 * - 실시간 문법 검사
 * - 코드 폴딩, 미니맵 등 고급 기능
 * - 키보드 단축키 지원
 * - 접근성 및 UX 개선
 */

import React, { useRef, useEffect, useLayoutEffect, useState, useImperativeHandle } from 'react';
import { Editor } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { 
  FaPlay, 
  FaCog, 
  FaExpand, 
  FaCompress,
  FaCopy,
  FaUndo,
  FaRedo,
  FaSpinner,
  FaExclamationTriangle,
  FaPaperPlane,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import LanguageSelector from './LanguageSelector';
import '../styles/style.css';

const CodeEditor = React.forwardRef(({
  value = '',
  onChange,
  language = 'javascript',
  theme = 'vs-dark',
  height = '500px',
  className = '',
  readOnly = false,
  showToolbar = true,
  onRun,
  isRunning = false,
  onSubmit,
  isSubmitting = false,
  submissionResult = null,
  options = {},
  selectedLanguage = 'javascript',
  onLanguageChange = null,
  showLanguageSelector = false,
  onRunComplete = null
}, ref) => {
  const editorRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // 검색 위젯은 Monaco 내장 단축키로 열도록 처리
  const [runResult, setRunResult] = useState(null); // { logs: string[], error: string|null, runtimeMs: number }
  const [resultPanelHeight, setResultPanelHeight] = useState(0); // 드래그 가능한 결과 패널 높이(px)
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const [internalRunning, setInternalRunning] = useState(false);
  const panelRef = useRef(null);
  const dragStartRef = useRef({ startY: 0, startHeight: 0 });
  const pyWorkerRef = useRef(null);
  const pyReadyRef = useRef(false);

  // 부모 컴포넌트에서 에디터 레이아웃을 제어할 수 있도록 메서드 노출
  useImperativeHandle(ref, () => ({
    updateLayout: () => {
      if (editorRef.current && typeof editorRef.current.layout === 'function') {
        // debounce를 적용한 레이아웃 업데이트
        setTimeout(() => {
          if (editorRef.current && typeof editorRef.current.layout === 'function') {
            editorRef.current.layout();
          }
        }, 350); // 상태 변경 후 안정화 대기
      }
    },
    getEditor: () => editorRef.current,
    getValue: () => editorRef.current?.getValue() || '',
    setValue: (newValue) => editorRef.current?.setValue(newValue || ''),
    focus: () => editorRef.current?.focus(),
    formatDocument: () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.formatDocument')?.run();
      }
    },
    toggleSearch: () => {
      if (editorRef.current) {
        editorRef.current.getAction('actions.find')?.run();
      }
    }
  }), []);

  // 기본 에디터 옵션 (확장됨)
  const defaultOptions = {
    fontSize: 14,
    fontFamily: 'Fira Code, Consolas, Monaco, "Courier New", monospace',
    fontLigatures: true,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: false, // ResizeObserver 충돌 방지를 위해 수동 관리
    minimap: { enabled: true },
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    wordBasedSuggestions: true,
    parameterHints: { enabled: true },
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    autoIndent: 'advanced',
    formatOnPaste: true,
    formatOnType: true,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: true,
    trimAutoWhitespace: true,
    acceptSuggestionOnEnter: 'on',
    acceptSuggestionOnCommitCharacter: true,
    snippetSuggestions: 'top',
    wordWrap: 'on',
    lineHeight: 1.5,
    letterSpacing: 0.5,
    cursorStyle: 'line',
    cursorBlinking: 'blink',
    renderWhitespace: 'selection',
    renderControlCharacters: false,
    smoothScrolling: true,
    mouseWheelZoom: true,
    contextmenu: true,
    links: true,
    colorDecorators: true,
    dragAndDrop: true,
    accessibilitySupport: 'auto',
    ...options
  };

  // 에디터 테마 설정
  useEffect(() => {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    setEditorTheme(isDarkMode ? 'vs-dark' : 'vs');
  }, []);

  // 결과 패널 드래그 리사이즈
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizingPanel) return;
      const delta = dragStartRef.current.startY - e.clientY; // 위로 드래그 시 높이 증가
      const newHeight = Math.max(80, Math.min(500, dragStartRef.current.startHeight + delta));
      setResultPanelHeight(newHeight);
    };
    const onMouseUp = () => setIsResizingPanel(false);
    if (isResizingPanel) {
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
  }, [isResizingPanel]);

  // 테마 변경 감지
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
          setEditorTheme(isDarkMode ? 'vs-dark' : 'vs');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // 변경사항 추적
  useEffect(() => {
    setHasUnsavedChanges(value !== '' && value !== getLanguageTemplate(selectedLanguage));
  }, [value, selectedLanguage]);

  // 언어 템플릿 가져오기 (간단한 구현)
  const getLanguageTemplate = (lang) => {
    const templates = {
      javascript: '// 코드를 여기에 작성하세요\n\nfunction solution() {\n    \n}\n\n// 실행\nsolution();',
      python: '# 코드를 여기에 작성하세요\n\ndef solution():\n    pass\n\nif __name__ == "__main__":\n    solution()',
      java: 'public class Solution {\n    public static void main(String[] args) {\n        // 코드를 여기에 작성하세요\n        \n    }\n}',
      c: '#include <stdio.h>\n\nint main() {\n    // 코드를 여기에 작성하세요\n    \n    return 0;\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // 코드를 여기에 작성하세요\n    \n    return 0;\n}',
      rust: 'fn main() {\n    // 코드를 여기에 작성하세요\n    \n}',
      go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // 코드를 여기에 작성하세요\n    \n}'
    };
    return templates[lang] || templates.javascript;
  };

  // 수동 레이아웃 관리 (ResizeObserver 대신)
  useLayoutEffect(() => {
    const resizeEditor = () => {
      if (editorRef.current && typeof editorRef.current.layout === 'function') {
        // debounce를 적용한 레이아웃 업데이트
        setTimeout(() => {
          if (editorRef.current && typeof editorRef.current.layout === 'function') {
            editorRef.current.layout();
          }
        }, 150);
      }
    };

    // 크기나 속성 변경 시 레이아웃 업데이트
    resizeEditor();
  }, [height, isFullscreen, className]);

  // 윈도우 리사이즈 이벤트 핸들링 (throttled)
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (editorRef.current && typeof editorRef.current.layout === 'function') {
          editorRef.current.layout();
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // 에디터 인스턴스 저장 및 설정
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    setIsLoading(false);
    setError(null);

    // 에디터 마운트 후 안정화 처리
    const stabilizeEditor = () => {
      if (editor && typeof editor.layout === 'function') {
        // 초기 레이아웃 설정
        editor.layout();
        
        // 추가 안정화를 위한 지연 레이아웃
        setTimeout(() => {
          if (editor && typeof editor.layout === 'function') {
            editor.layout();
          }
        }, 300);
      }
    };

    // DOM이 완전히 렌더링된 후 실행
    requestAnimationFrame(() => {
      requestAnimationFrame(stabilizeEditor);
    });

    // 키보드 단축키 설정
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Ctrl+S: 저장
      console.log('Save shortcut triggered');
      setHasUnsavedChanges(false);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Ctrl+Enter: 실행
      if (onRun && !isRunning) {
        onRun();
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      // Ctrl+F: Monaco 내장 검색 위젯 열기
      try {
        editor.trigger('keyboard', 'actions.find', null);
      } catch (_) {}
    });

    editor.addCommand(monaco.KeyCode.F11, () => {
      // F11: 전체화면
      toggleFullscreen();
    });

    // 자동완성 개선
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) => {
        const suggestions = [];
        
        // 언어별 기본 자동완성 추가
        if (language === 'javascript') {
          suggestions.push(
            {
              label: 'console.log',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'console.log(' + '${1:}' + ');',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Log output to console'
            },
            {
              label: 'function',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'function ' + '${1:name}' + '(' + '${2:params}' + ') {\n\t' + '${3:}' + '\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Create a function'
            },
            {
              label: 'arrow function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '(' + '${1:params}' + ') => {\n\t' + '${2:}' + '\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Create an arrow function'
            }
          );
        } else if (language === 'python') {
          suggestions.push(
            {
              label: 'print',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'print(' + '${1:}' + ')',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Print to console'
            },
            {
              label: 'def',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'def ' + '${1:function_name}' + '(' + '${2:params}' + '):\n\t' + '${3:pass}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Define a function'
            },
            {
              label: 'class',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'class ' + '${1:ClassName}' + ':\n\tdef __init__(self' + '${2:, params}' + '):\n\t\t' + '${3:pass}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Define a class'
            }
          );
        } else if (language === 'java') {
          suggestions.push(
            {
              label: 'System.out.println',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'System.out.println(' + '${1:}' + ');',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Print to console'
            },
            {
              label: 'public static void main',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'public static void main(String[] args) {\n\t' + '${1:}' + '\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Main method'
            },
            {
              label: 'for',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'for (' + '${1:int i = 0}' + '; ' + '${2:i < length}' + '; ' + '${3:i++}' + ') {\n\t' + '${4:}' + '\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'For loop'
            }
          );
        }

        return { suggestions };
      }
    });

    // 에러 및 경고 마커 설정
    monaco.editor.onDidChangeMarkers(([resource]) => {
      const markers = monaco.editor.getModelMarkers({ resource });
      const hasErrors = markers.some(marker => marker.severity === monaco.MarkerSeverity.Error);
      if (hasErrors) {
        setError('코드에 구문 오류가 있습니다.');
      } else {
        setError(null);
      }
    });

    // 변경사항 추적
    editor.onDidChangeModelContent(() => {
      setHasUnsavedChanges(true);
    });
  }

  // 에디터 로딩 실패 처리
  const handleEditorLoadError = (error) => {
    console.error('Monaco Editor failed to load:', error);
    setIsLoading(false);
    setError('코드 에디터를 로드하는데 실패했습니다. 페이지를 새로고침해주세요.');
  };

  // API 훅 사용 (현재 미사용)

  // 코드 실행 핸들러
  const runJavaScriptInWorker = (code, timeoutMs = 3000) => {
    return new Promise((resolve) => {
      const logs = [];
      let finished = false;

      const wrapper = `
        self.console.log = (...args) => {
          try { self.postMessage({ type: 'log', message: args.map(a=> String(a)).join(' ') }); } catch(e) {}
        };
        self.console.error = (...args) => {
          try { self.postMessage({ type: 'log', message: args.map(a=> String(a)).join(' ') }); } catch(e) {}
        };
        self.onerror = (e) => { try { self.postMessage({ type: 'error', message: e.message || String(e) }); } catch(_) {} };
        try {
          const start = Date.now();
          (function(){\n${code}\n})();
          const rt = Date.now() - start;
          self.postMessage({ type: 'done', runtimeMs: rt });
        } catch (e) {
          try { self.postMessage({ type: 'error', message: e && (e.stack || e.message) ? (e.stack || e.message) : String(e) }); } catch(_) {}
        }
      `;

      const blob = new Blob([wrapper], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      URL.revokeObjectURL(url);

      const timer = setTimeout(() => {
        if (!finished) {
          finished = true;
          try { worker.terminate(); } catch (_) {}
          resolve({ logs, error: '실행 시간이 초과되었습니다(타임아웃).', runtimeMs: timeoutMs });
        }
      }, timeoutMs);

      worker.onmessage = (event) => {
        const data = event.data || {};
        if (data.type === 'log') {
          logs.push(data.message);
        } else if (data.type === 'error') {
          if (!finished) {
            finished = true;
            clearTimeout(timer);
            try { worker.terminate(); } catch (_) {}
            resolve({ logs, error: data.message || '알 수 없는 오류', runtimeMs: 0 });
          }
        } else if (data.type === 'done') {
          if (!finished) {
            finished = true;
            clearTimeout(timer);
            try { worker.terminate(); } catch (_) {}
            resolve({ logs, error: null, runtimeMs: data.runtimeMs || 0 });
          }
        }
      };

      worker.onerror = (e) => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          try { worker.terminate(); } catch (_) {}
          resolve({ logs, error: e.message || '실행 오류', runtimeMs: 0 });
        }
      };
    });
  };

  // ---------------------
  // Python (Pyodide) 실행 (Web Worker)
  // ---------------------
  const ensurePyodideWorker = () => {
    if (pyWorkerRef.current && pyReadyRef.current) return Promise.resolve(pyWorkerRef.current);
    if (!pyWorkerRef.current) {
      const workerCode = `
        let pyodide = null;
        async function init() {
          if (pyodide) { self.postMessage({ type: 'status', message: 'ready' }); return; }
          self.postMessage({ type: 'status', message: 'loading' });
          importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
          pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
          self.postMessage({ type: 'status', message: 'ready' });
        }
        self.onmessage = async (e) => {
          const data = e.data || {};
          if (data.type === 'init') {
            try { await init(); } catch (err) { self.postMessage({ type: 'error', message: String(err) }); }
            return;
          }
          if (data.type === 'run') {
            try {
              await init();
              const start = Date.now();
              await pyodide.runPythonAsync("import sys, io; _stdout = io.StringIO(); _stderr = io.StringIO(); _sys_stdout, _sys_stderr = sys.stdout, sys.stderr; sys.stdout, sys.stderr = _stdout, _stderr");
              try {
                await pyodide.runPythonAsync(data.code || '');
              } catch (exc) {
                await pyodide.runPythonAsync('import traceback; traceback.print_exc(file=_stderr)');
              }
              const jsonTuple = await pyodide.runPythonAsync("import json; _out = _stdout.getvalue(); _err = _stderr.getvalue(); sys.stdout, sys.stderr = _sys_stdout, _sys_stderr; json.dumps((_out, _err))");
              const [stdout, stderr] = JSON.parse(jsonTuple);
              const rt = Date.now() - start;
              self.postMessage({ type: 'done', stdout, stderr, runtimeMs: rt });
            } catch (err) {
              self.postMessage({ type: 'error', message: (err && (err.stack || err.message)) ? (err.stack || err.message) : String(err) });
            }
          }
        };
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      pyWorkerRef.current = new Worker(url);
      URL.revokeObjectURL(url);
    }
    return new Promise((resolve, reject) => {
      const worker = pyWorkerRef.current;
      const onMessage = (ev) => {
        const { type, message } = ev.data || {};
        if (type === 'status' && message === 'ready') {
          pyReadyRef.current = true;
          worker.removeEventListener('message', onMessage);
          resolve(worker);
        } else if (type === 'status' && message === 'loading') {
          // ignore
        } else if (type === 'error') {
          worker.removeEventListener('message', onMessage);
          reject(new Error(message || 'Pyodide 초기화 실패'));
        }
      };
      worker.addEventListener('message', onMessage);
      try { worker.postMessage({ type: 'init' }); } catch (e) { reject(e); }
    });
  };

  const runPythonInWorker = async (code, timeoutMs = 5000) => {
    try {
      const worker = await ensurePyodideWorker();
      return await new Promise((resolve) => {
        let finished = false;
        const timer = setTimeout(() => {
          if (!finished) {
            finished = true;
            try { worker.terminate(); } catch (_) {}
            pyWorkerRef.current = null;
            pyReadyRef.current = false;
            resolve({ logs: [], error: '실행 시간이 초과되었습니다(타임아웃).', runtimeMs: timeoutMs });
          }
        }, timeoutMs);
        const onMessage = (ev) => {
          const data = ev.data || {};
          if (data.type === 'done') {
            if (!finished) {
              finished = true;
              clearTimeout(timer);
              worker.removeEventListener('message', onMessage);
              const logs = [];
              if (data.stdout) logs.push(data.stdout);
              if (data.stderr) logs.push(data.stderr);
              resolve({ logs, error: data.stderr ? null : null, runtimeMs: data.runtimeMs || 0 });
            }
          } else if (data.type === 'error') {
            if (!finished) {
              finished = true;
              clearTimeout(timer);
              worker.removeEventListener('message', onMessage);
              resolve({ logs: [], error: data.message || '실행 오류', runtimeMs: 0 });
            }
          }
        };
        worker.addEventListener('message', onMessage);
        worker.postMessage({ type: 'run', code });
      });
    } catch (err) {
      return { logs: [], error: (err && err.message) ? err.message : 'Pyodide 실행 오류', runtimeMs: 0 };
    }
  };

  const handleRun = async () => {
    if (!value.trim()) return;
    setInternalRunning(true);

    try {
      // JavaScript는 브라우저에서 직접 실행 지원
      if (selectedLanguage === 'javascript') {
        setError(null);
        setRunResult(null);
        const result = await runJavaScriptInWorker(value, 3000);
        setRunResult(result);
        setResultPanelHeight(h => (h && h > 0) ? h : 160);
        try {
          if (typeof onRunComplete === 'function') {
            onRunComplete({ success: !result.error, runtimeMs: result.runtimeMs || 0, error: result.error || null, logs: result.logs || [] });
          }
        } catch (_) {}
        return;
      }

      // Python은 Pyodide로 브라우저 내 실행 지원
      if (selectedLanguage === 'python') {
        setError(null);
        setRunResult(null);
        const result = await runPythonInWorker(value, 5000);
        setRunResult(result);
        setResultPanelHeight(h => (h && h > 0) ? h : 160);
        try {
          if (typeof onRunComplete === 'function') {
            onRunComplete({ success: !result.error, runtimeMs: result.runtimeMs || 0, error: result.error || null, logs: result.logs || [] });
          }
        } catch (_) {}
        return;
      }

      // 기타 언어는 현재 로컬 실행 미지원 → 안내 후 기존 onRun 콜백 호출 유지
      const fallback = { logs: [], error: '현재 언어는 브라우저 로컬 실행을 지원하지 않습니다.', runtimeMs: 0 };
      setRunResult(fallback);
      setResultPanelHeight(h => (h && h > 0) ? h : 120);
      if (onRun && !isRunning) {
        onRun();
      }
      try {
        if (typeof onRunComplete === 'function') {
          onRunComplete({ success: false, runtimeMs: 0, error: fallback.error, logs: [] });
        }
      } catch (_) {}
    } catch (error) {
      console.error('Code run error:', error);
      setError('코드 실행 중 오류가 발생했습니다.');
    } finally {
      setInternalRunning(false);
    }
  };

  // 코드 제출 핸들러
  const handleSubmit = async () => {
    if (!value.trim() || isSubmitting) return;

    try {
      // onSubmit 콜백 호출
      if (onSubmit && !isSubmitting) {
        onSubmit();
      }
    } catch (error) {
      console.error('Code submission error:', error);
      setError('코드 제출 중 오류가 발생했습니다.');
    }
  };

  // 전체화면 토글
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 에디터 설정
  const handleSettings = () => {
    console.log('Editor settings');
    // 실제 구현에서는 설정 모달을 열거나 설정 패널을 표시
  };

  // 코드 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      console.log('Code copied to clipboard');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // 실행 취소/다시 실행
  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.getModel()?.undo();
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.getModel()?.redo();
    }
  };

  // 코드 포맷팅
  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        relative rounded-lg overflow-hidden glass-effect border
        ${isFullscreen ? 'fixed inset-4 z-50' : className}
      `}
      style={{
        backgroundColor: 'var(--glass-bg)',
        borderColor: 'var(--border-color)',
        height: isFullscreen ? 'calc(100vh - 32px)' : height
      }}
    >
      {/* 에러 알림 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 z-20 p-3 bg-red-500/90 text-white text-sm flex items-center space-x-2"
        >
          <FaExclamationTriangle />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto hover:bg-white/20 p-1 rounded"
            aria-label="에러 메시지 닫기"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* 툴바 */}
      {showToolbar && (
        <div 
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ 
            backgroundColor: 'var(--glass-bg)', 
            borderColor: 'var(--border-color)' 
          }}
        >
          <div className="flex items-center space-x-4">
            {/* 에디터 상태 표시 */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span 
              className="text-sm font-medium flex items-center space-x-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>Editor</span>
              {hasUnsavedChanges && (
                <span className="w-2 h-2 rounded-full bg-orange-400" title="저장되지 않은 변경사항"></span>
              )}
            </span>
            
            {/* 언어 선택기 */}
            {showLanguageSelector && onLanguageChange && (
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
                className=""
              />
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* 편집 도구 */}
            <div className="flex items-center space-x-1 mr-2">
              <motion.button
                onClick={handleUndo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded text-xs hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="실행 취소 (Ctrl+Z)"
                aria-label="실행 취소"
              >
                <FaUndo />
              </motion.button>

              <motion.button
                onClick={handleRedo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded text-xs hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="다시 실행 (Ctrl+Y)"
                aria-label="다시 실행"
              >
                <FaRedo />
              </motion.button>

              <motion.button
                onClick={handleFormat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded text-xs hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="코드 포맷팅 (Shift+Alt+F)"
                aria-label="코드 포맷팅"
              >
                <FaCog />
              </motion.button>

              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded text-xs hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="코드 복사 (Ctrl+A, Ctrl+C)"
                aria-label="코드 복사"
              >
                <FaCopy />
              </motion.button>
            </div>

            {/* 실행 버튼 */}
            {onRun && (
              <motion.button
                onClick={handleRun}
                disabled={(isRunning || internalRunning) || !value.trim()}
                whileHover={!(isRunning || internalRunning) && value.trim() ? { scale: 1.05 } : {}}
                whileTap={!(isRunning || internalRunning) && value.trim() ? { scale: 0.95 } : {}}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium
                  transition-all duration-150
                  ${isRunning || !value.trim()
                    ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }
                `}
                title="코드 실행 (Ctrl+Enter)"
                aria-label="코드 실행"
              >
                {(isRunning || internalRunning) ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>실행 중...</span>
                  </>
                ) : (
                  <>
                    <FaPlay />
                    <span>실행</span>
                  </>
                )}
              </motion.button>
            )}

            {/* 제출 버튼 */}
            {onSubmit && (
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting || !value.trim()}
                whileHover={!isSubmitting && value.trim() ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting && value.trim() ? { scale: 0.95 } : {}}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium
                  transition-all duration-150
                  ${isSubmitting || !value.trim()
                    ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed' 
                    : submissionResult?.passed
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : submissionResult && !submissionResult.passed
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }
                `}
                title="코드 제출 및 LLM 검증"
                aria-label="코드 제출"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>제출 중...</span>
                  </>
                ) : submissionResult?.passed ? (
                  <>
                    <FaCheck />
                    <span>통과</span>
                  </>
                ) : submissionResult && !submissionResult.passed ? (
                  <>
                    <FaTimes />
                    <span>재제출</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>제출</span>
                  </>
                )}
              </motion.button>
            )}

            {/* 전체화면 버튼 */}
            <motion.button
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              title={`${isFullscreen ? '전체화면 해제' : '전체화면'} (F11)`}
              aria-label={`${isFullscreen ? '전체화면 해제' : '전체화면'}`}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </motion.button>
          </div>
        </div>
      )}

      {/* Monaco Editor */}
      <div 
        className="relative"
        style={{ 
          height: showToolbar 
            ? isFullscreen 
              ? 'calc(100% - 48px)' 
              : `calc(${height} - 48px)`
            : height 
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="flex items-center space-x-3 text-white">
              <FaSpinner className="animate-spin text-xl" />
              <span>에디터 로딩 중...</span>
            </div>
          </div>
        )}

        <Editor
          value={value}
          onChange={onChange}
          language={language}
          theme={editorTheme}
          options={defaultOptions}
          onMount={handleEditorDidMount}
          onError={handleEditorLoadError}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          }
        />
      </div>

      {/* 실행/검증 결과 패널 (드래그로 높이 조절) */}
      {(runResult || submissionResult) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          ref={panelRef}
          className="border-t glass-effect select-none"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--glass-bg)', height: resultPanelHeight || 'auto' }}
        >
          {/* 드래그 핸들 */}
          <div
            onMouseDown={(e) => {
              dragStartRef.current.startY = e.clientY;
              dragStartRef.current.startHeight = resultPanelHeight || (panelRef.current?.getBoundingClientRect().height || 160);
              setIsResizingPanel(true);
            }}
            className="w-full h-2 cursor-row-resize hover:bg-blue-500/30"
            aria-label="결과 패널 크기 조정"
            title="위/아래로 드래그하여 크기 조절"
          />
          <div className="p-3">
            {runResult && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>실행 결과</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{runResult.runtimeMs}ms</span>
                </div>
                {runResult.error ? (
                  <div className="text-sm text-red-400">{runResult.error}</div>
                ) : (
                  <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {(runResult.logs && runResult.logs.length > 0) ? (
                      runResult.logs.map((l, i) => (
                        <div key={i} className="whitespace-pre-wrap">{l}</div>
                      ))
                    ) : (
                      <div>출력 없음</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {submissionResult && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>검증 결과</span>
                  <span className={`text-xs ${submissionResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {submissionResult.passed ? '통과' : '불통과'}
                  </span>
                </div>
                <div className={`p-2 rounded border ${submissionResult.passed ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {submissionResult.feedback || '피드백 없음'}
                  </div>
                </div>
                {submissionResult.suggestions && submissionResult.suggestions.length > 0 && (
                  <ul className="mt-2 text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                    {submissionResult.suggestions.slice(0, 4).map((s, i) => (
                      <li key={i} className="flex items-start space-x-2"><span className="text-blue-400 mt-0.5">•</span><span>{s}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 전체화면 모드일 때 배경 오버레이 */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={toggleFullscreen}
        />
      )}

      {/* 키보드 단축키 힌트 (전체화면일 때만 표시) */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg backdrop-blur-sm"
        >
          <div className="space-y-1">
            <div>F11: 전체화면 해제</div>
            <div>Ctrl+R: 실행</div>
            <div>Ctrl+S: 저장</div>
            <div>Ctrl+F: 검색</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor; 