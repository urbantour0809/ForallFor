/**
 * LanguageSelector 컴포넌트
 * 
 * 코드 에디터에서 사용할 프로그래밍 언어를 선택하는 드롭다운 컴포넌트입니다.
 * LeetCode 스타일의 UI를 참고하여 디자인했습니다.
 * 
 * 주요 기능:
 * - 7개 주요 언어 지원 (Java, Python, JavaScript, C, C++, Rust, Go)
 * - Monaco Editor와 연동 가능한 언어 코드 제공
 * - 현재 선택된 언어 표시
 * - 반응형 디자인 및 접근성 지원
 * - 키보드 네비게이션 및 검색 기능
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaCode, FaSearch, FaCheck } from 'react-icons/fa';
import '../styles/style.css';

// Monaco Editor에서 지원하는 언어 코드와 매핑
const SUPPORTED_LANGUAGES = [
  {
    id: 'java',
    name: 'Java',
    monacoId: 'java',
    extension: '.java',
    color: '#f89820',
    popularity: 1,
    template: `public class Solution {
    public static void main(String[] args) {
        // 코드를 여기에 작성하세요
        
    }
}`
  },
  {
    id: 'python',
    name: 'Python',
    monacoId: 'python',
    extension: '.py',
    color: '#3776ab',
    popularity: 2,
    template: `# 코드를 여기에 작성하세요

def solution():
    pass

if __name__ == "__main__":
    solution()`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    monacoId: 'javascript',
    extension: '.js',
    color: '#f7df1e',
    popularity: 3,
    template: `// 코드를 여기에 작성하세요

function solution() {
    
}

// 실행
solution();`
  },
  {
    id: 'c',
    name: 'C',
    monacoId: 'c',
    extension: '.c',
    color: '#a8b9cc',
    popularity: 4,
    template: `#include <stdio.h>

int main() {
    // 코드를 여기에 작성하세요
    
    return 0;
}`
  },
  {
    id: 'cpp',
    name: 'C++',
    monacoId: 'cpp',
    extension: '.cpp',
    color: '#00599c',
    popularity: 5,
    template: `#include <iostream>
using namespace std;

int main() {
    // 코드를 여기에 작성하세요
    
    return 0;
}`
  },
  {
    id: 'rust',
    name: 'Rust',
    monacoId: 'rust',
    extension: '.rs',
    color: '#ce422b',
    popularity: 6,
    template: `fn main() {
    // 코드를 여기에 작성하세요
    
}`
  },
  {
    id: 'go',
    name: 'Go',
    monacoId: 'go',
    extension: '.go',
    color: '#00add8',
    popularity: 7,
    template: `package main

import "fmt"

func main() {
    // 코드를 여기에 작성하세요
    
}`
  }
];

function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange, 
  className = '',
  disabled = false,
  showSearch = false,
  maxHeight = '300px'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const buttonRef = useRef(null);

  // 현재 선택된 언어 정보
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  // 검색 필터링된 언어 목록
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.extension.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 드롭다운이 열릴 때 검색 입력 필드에 포커스
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, showSearch]);

  // 언어 선택 핸들러
  const handleLanguageSelect = async (language) => {
    if (disabled) return;

    setIsLoading(true);
    
    // 약간의 지연을 추가하여 UX 개선
    setTimeout(() => {
      onLanguageChange(language);
      setIsOpen(false);
      setSearchTerm('');
      setHighlightedIndex(-1);
      setIsLoading(false);
      
      // 포커스를 트리거 버튼으로 되돌림
      buttonRef.current?.focus();
    }, 150);
  };

  // 키보드 접근성
  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0) {
          handleLanguageSelect(filteredLanguages[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredLanguages.length - 1 ? prev + 1 : 0
          );
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredLanguages.length - 1
          );
        }
        break;
        
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
        }
        break;
        
      default:
        // 문자 입력 시 검색 모드로 전환
        if (isOpen && !showSearch && /^[a-zA-Z]$/.test(event.key)) {
          setSearchTerm(event.key);
          const firstMatch = SUPPORTED_LANGUAGES.findIndex(lang =>
            lang.name.toLowerCase().startsWith(event.key.toLowerCase())
          );
          if (firstMatch >= 0) {
            setHighlightedIndex(firstMatch);
          }
        }
        break;
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setHighlightedIndex(0); // 첫 번째 결과를 하이라이트
  };

  // 검색 입력 키보드 핸들러
  const handleSearchKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredLanguages.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredLanguages.length - 1
        );
        break;
        
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && filteredLanguages[highlightedIndex]) {
          handleLanguageSelect(filteredLanguages[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
    >
      {/* 드롭다운 트리거 버튼 */}
      <motion.button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg 
          glass-effect border transition-all duration-150
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-blue-500/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
          ${isLoading ? 'pointer-events-none' : ''}
        `}
        style={{
          backgroundColor: 'var(--glass-bg)',
          borderColor: isOpen ? '#3b82f6' : 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`현재 선택된 언어: ${currentLanguage.name}. 언어 선택 메뉴 ${isOpen ? '닫기' : '열기'}`}
        role="combobox"
        id="language-selector-button"
      >
        <div 
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: currentLanguage.color }}
          aria-hidden="true"
        />
        <FaCode className="text-blue-400 text-sm" aria-hidden="true" />
        <span className="text-sm font-medium">{currentLanguage.name}</span>
        <span className="text-xs opacity-60">{currentLanguage.extension}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={isLoading ? 'animate-spin' : ''}
        >
          <FaChevronDown className="text-xs" style={{ color: 'var(--text-secondary)' }} aria-hidden="true" />
        </motion.div>
      </motion.button>

      {/* 드롭다운 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 glass-effect rounded-lg border shadow-2xl z-50"
            style={{
              backgroundColor: 'var(--glass-bg)',
              borderColor: 'var(--border-color)',
              backdropFilter: 'blur(20px)',
              maxHeight
            }}
            role="listbox"
            aria-labelledby="language-selector-button"
          >
            {/* 검색 입력 */}
            {showSearch && (
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="relative">
                  <FaSearch 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm" 
                    style={{ color: 'var(--text-secondary)' }}
                    aria-hidden="true"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="언어 검색..."
                    className="w-full pl-10 pr-3 py-2 rounded-lg glass-effect border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--glass-bg)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    aria-label="언어 검색"
                  />
                </div>
              </div>
            )}

            {/* 언어 목록 */}
            <div className="py-2 overflow-y-auto" style={{ maxHeight: showSearch ? '240px' : maxHeight }}>
              {filteredLanguages.length === 0 ? (
                <div className="px-4 py-3 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                  검색 결과가 없습니다
                </div>
              ) : (
                filteredLanguages.map((language, index) => (
                  <motion.button
                    key={language.id}
                    onClick={() => handleLanguageSelect(language)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    className={`
                      w-full px-4 py-3 text-left flex items-center space-x-3
                      transition-all duration-150 
                      ${currentLanguage.id === language.id 
                        ? 'bg-blue-500/20 border-r-2 border-blue-500' 
                        : highlightedIndex === index
                        ? 'bg-white/5'
                        : 'hover:bg-white/5'
                      }
                    `}
                    style={{ color: 'var(--text-primary)' }}
                    role="option"
                    aria-selected={currentLanguage.id === language.id}
                    aria-label={`${language.name} ${language.extension} 선택`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: language.color }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{language.name}</span>
                        {currentLanguage.id === language.id && (
                          <FaCheck className="text-green-400 text-sm" aria-hidden="true" />
                        )}
                      </div>
                      <div 
                        className="text-xs flex items-center space-x-2" 
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span>{language.extension}</span>
                        <span>•</span>
                        <span>인기도 #{language.popularity}</span>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* 키보드 단축키 힌트 */}
            <div 
              className="px-4 py-2 border-t text-xs"
              style={{ 
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)' 
              }}
            >
              <div className="flex justify-between">
                <span>↑↓ 탐색</span>
                <span>Enter 선택</span>
                <span>Esc 닫기</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 언어 템플릿 가져오기 유틸리티 함수
export const getLanguageTemplate = (languageId) => {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
  return language ? language.template : SUPPORTED_LANGUAGES[0].template;
};

// Monaco Editor 언어 ID 가져오기
export const getMonacoLanguageId = (languageId) => {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
  return language ? language.monacoId : SUPPORTED_LANGUAGES[0].monacoId;
};

// 지원하는 언어 목록 export
export { SUPPORTED_LANGUAGES };

export default LanguageSelector; 