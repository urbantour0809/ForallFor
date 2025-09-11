/**
 * Navigation 컴포넌트
 *
 * 웹사이트의 메인 네비게이션 바를 담당하는 컴포넌트입니다.
 * 다크/라이트 테마 토글, 반응형 모바일 메뉴, 로그인/회원가입 기능을 제공합니다.
 *
 * 주요 기능:
 * - 반응형 네비게이션 (데스크톱/모바일)
 * - 다크/라이트 테마 토글 및 localStorage 저장
 * - 현재 페이지 활성 상태 표시
 * - Framer Motion을 이용한 부드러운 애니메이션
 * - 로그인/회원가입 버튼 (데스크톱/모바일 모두 지원)

 * - 키보드 접근성 및 ARIA 지원
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/style.css';
import axios from 'axios';

function Navigation() {
  // 테마 상태 관리 (기본값: 다크모드)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 모바일 메뉴 열림/닫힘 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Challenges 드롭다운 상태 추가
  const [isChallengesDropdownOpen, setIsChallengesDropdownOpen] = useState(false);

  // 현재 페이지 경로를 추적하여 활성 메뉴 표시
  const location = useLocation();

  const mobileMenuButtonRef = useRef(null);
  const firstMobileMenuItemRef = useRef(null);

  // user,admin,company 페이지 추가 !
  const [nickname, setNickname] = useState(null);
  const [userType, setUserType] = useState(null);

  /**
   * 컴포넌트 마운트 시 테마 초기화
   * localStorage에 저장된 테마 설정을 불러오거나,
   * 시스템 기본 설정(prefers-color-scheme)을 따릅니다.
   */

  // 세션 체크 useEffect 추가 !
  useEffect(() => {
    axios.get("http://localhost:8080/FAF/api/session-check", { withCredentials: true })
        .then((res) => {
          if (res.data.success) {
            setNickname(res.data.nickname);
            setUserType(res.data.userType); // ADMIN, USER, COMPANY
          }
        })
        .catch(() => {
          setNickname(null);
          setUserType(null);
        });
  }, []);
//로그아웃
  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:8080/FAF/api/logout', {}, {
        withCredentials: true
      });

      if (response.data.success) {
        window.location.href = '/'; // 또는 navigate('/login')
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 저장된 테마가 있으면 그것을 사용, 없으면 시스템 설정 따름
    const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkMode(initialTheme);

    // HTML 요소에 테마 속성 설정 (CSS 변수와 연동)
    document.documentElement.setAttribute('data-theme', initialTheme ? 'dark' : 'light');
  }, []);

  /**
   * 다크/라이트 테마 토글 함수
   * 상태를 변경하고 localStorage에 저장하여 새로고침 시에도 유지됩니다.
   */
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    const themeValue = newTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeValue);
    localStorage.setItem('theme', themeValue);
  };

  /**
   * 모바일 메뉴 열기/닫기 토글 함수
   * 햄버거 메뉴 클릭 시 호출됩니다.
   */
  const toggleMobileMenu = () => {

    setIsMobileMenuOpen(prev => {
      const newState = !prev;

      // 메뉴가 열릴 때 첫 번째 항목에 포커스
      if (newState) {
        setTimeout(() => {
          firstMobileMenuItemRef.current?.focus();
        }, 100);
      }

      return newState;
    });
  };

  // 모바일 메뉴 아이템 클릭 시 메뉴 닫기
  const handleMobileMenuItemClick = () => {
    setIsMobileMenuOpen(false);
    // 포커스를 햄버거 버튼으로 되돌림
    setTimeout(() => {
      mobileMenuButtonRef.current?.focus();
    }, 100);
  };

  // ESC 키로 모바일 메뉴 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // 모바일 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Challenges 드롭다운 ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isChallengesDropdownOpen) {
        setIsChallengesDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isChallengesDropdownOpen]);

  // Challenges 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isChallengesDropdownOpen && !e.target.closest('.challenges-dropdown-container')) {
        setIsChallengesDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isChallengesDropdownOpen]);

  /**
   * 네비게이션 메뉴 항목 배열 - Problems 제거
   * 각 항목은 이름과 경로를 포함합니다.
   */
  const navItems = [
    { name: 'Home', path: '/', ariaLabel: '홈페이지로 이동' },
    { name: 'Languages', path: '/languages', ariaLabel: '프로그래밍 언어 페이지로 이동' },
    { name: 'Community', path: '/community', ariaLabel: '커뮤니티 페이지로 이동' },
    { name: 'Market', path: '/market', ariaLabel: '마켓 페이지로 이동' }
  ];

  /**
   * Challenges 드롭다운 메뉴 항목들
   */
  const challengesItems = [
    { name: 'Challenge', path: '/challenges', ariaLabel: '퀴즈 챌린지로 이동' },
    { name: 'Test', path: '/test', ariaLabel: '시험 챌린지로 이동' }
  ];

  return (
      <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed top-0 w-full z-50 glass-effect"

          role="navigation"
          aria-label="메인 네비게이션"

      >
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 py-4">
          <div className="grid grid-cols-3 items-center md:grid-cols-3 md:flex md:justify-between md:items-center">
            {/* 왼쪽 영역: 로고 */}
            <div className="flex justify-start">
              <Link to="/" aria-label="forallfor 홈페이지로 이동">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -m-2"
                    tabIndex={-1}
                >
                  <img
                      src="/logo192.png"
                      alt="forallfor 로고"
                      className="h-8 w-8"
                      style={{ transform: 'translateY(-1px)' }}
                  />
                  <div className="text-lg lg:text-xl font-bold gradient-text">
                    forallfor<span style={{ color: 'var(--text-secondary)' }}></span>
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* 중앙 영역: 네비게이션 메뉴 */}
            <div className="hidden md:flex justify-center flex-1">
              <nav className="flex space-x-4 lg:space-x-6 xl:space-x-8 2xl:space-x-10 justify-center" role="menubar">
                {navItems.map((item, index) => (
                    <Link key={item.name} to={item.path}>
                      <motion.span
                          whileHover={{ scale: 1.1, color: '#667eea' }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                          className={`nav-link transition-colors duration-200 ${
                              location.pathname === item.path ? 'active' : ''
                          }`}
                          style={{
                            color: location.pathname === item.path ? '#667eea' : 'var(--text-secondary)'
                          }}
                          role="menuitem"
                          aria-label={item.ariaLabel}
                          tabIndex={0}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                ))}

                {/* Challenges 메뉴 - 호버 드롭다운 추가 (클릭 비활성화) */}
                <div className="relative challenges-dropdown-container">
                  <motion.span
                      whileHover={{ scale: 1.1, color: '#667eea' }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: navItems.length * 0.1 + 0.5, duration: 0.3 }}
                      className={`nav-link transition-colors duration-200 cursor-pointer ${
                          (location.pathname === '/challenges' || location.pathname.startsWith('/challenges/')) ? 'active' : ''
                      }`}
                      style={{
                        color: (location.pathname === '/challenges' || location.pathname.startsWith('/challenges/')) ? '#667eea' : 'var(--text-secondary)'
                      }}
                      role="button"
                      aria-label="챌린지 메뉴 (하위 메뉴 선택)"
                      aria-haspopup="true"
                      aria-expanded={isChallengesDropdownOpen}
                      tabIndex={0}
                      onMouseEnter={() => setIsChallengesDropdownOpen(true)}
                      onMouseLeave={() => setIsChallengesDropdownOpen(false)}
                      onClick={(e) => {
                        e.preventDefault();
                        // 드롭다운이 있는 메뉴는 클릭해도 페이지 이동하지 않음
                        setIsChallengesDropdownOpen(!isChallengesDropdownOpen);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsChallengesDropdownOpen(!isChallengesDropdownOpen);
                        }
                      }}
                  >
                    Challenges
                  </motion.span>

                  {/* 호버 드롭다운 메뉴 - 최적화된 호버 효과 */}
                  <motion.div
                      initial={false}
                      animate={{
                        opacity: isChallengesDropdownOpen ? 1 : 0,
                        y: isChallengesDropdownOpen ? 0 : -8,
                        visibility: isChallengesDropdownOpen ? 'visible' : 'hidden'
                      }}
                      transition={{
                        duration: 0.15,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="absolute top-full left-0 mt-2 w-48 glass-effect rounded-lg shadow-lg z-50 challenges-dropdown-menu"
                      style={{
                        transformOrigin: 'top center'
                      }}
                      role="menu"
                      onMouseEnter={() => setIsChallengesDropdownOpen(true)}
                      onMouseLeave={() => setIsChallengesDropdownOpen(false)}
                  >
                    {challengesItems.map((item, index) => (
                        <Link
                            key={item.name}
                            to={item.path}
                        >
                          <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{
                                opacity: isChallengesDropdownOpen ? 1 : 0,
                                y: isChallengesDropdownOpen ? 0 : -4
                              }}
                              transition={{
                                delay: index * 0.02,
                                duration: 0.15,
                                ease: [0.4, 0, 0.2, 1]
                              }}
                              whileHover={{
                                scale: 1.02
                              }}
                              className="px-4 py-3 text-sm transition-all duration-200 first:rounded-t-lg last:rounded-b-lg cursor-pointer relative overflow-hidden mx-1 my-0.5 rounded-lg challenges-dropdown-item"
                              style={{
                                willChange: 'background-color, box-shadow'
                              }}
                              role="menuitem"
                              aria-label={item.ariaLabel}
                          >
                            {item.name}
                          </motion.div>
                        </Link>
                    ))}
                  </motion.div>
                </div>
              </nav>
            </div>

            {/* 오른쪽 영역: 로그인/회원가입 + 테마 토글 */}
            <div className="hidden md:flex justify-end">
              <div className="flex items-center space-x-2 lg:space-x-3 pr-2 sm:pr-4 lg:pr-6 xl:pr-8 2xl:pr-10">
                {/* 로그인/회원가입 버튼 - 가로 배치 확정 */}
                {nickname ? (
                    <div className="flex items-center space-x-3">
                      <Link
                          to={
                            userType?.toLowerCase() === 'admin'
                                ? '/mainpage'
                                : userType?.toLowerCase() === 'company'
                                    ? '/companypage'
                                    : '/userpage'
                          }
                          aria-label="마이페이지로 이동"
                      >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                            style={{
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--glass-border)',
                              background: 'var(--glass-bg)'
                            }}
                            aria-label="마이페이지로 이동"
                        >
                          {nickname}님
                        </motion.button>
                      </Link>
                      <motion.button
                          onClick={logout}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7, duration: 0.3 }}
                          className="px-4 py-2 text-sm font-medium rounded-lg btn-primary focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                          aria-label="로그아웃"
                      >
                        로그아웃
                      </motion.button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                      <Link to="/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                            style={{
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--glass-border)',
                              background: 'var(--glass-bg)'
                            }}
                            aria-label="로그인 페이지로 이동"
                        >
                          로그인
                        </motion.button>
                      </Link>

                      <Link to="/signup">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                            className="px-4 py-2 text-sm font-medium rounded-lg btn-primary focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                            aria-label="회원가입 페이지로 이동"
                        >
                          회원가입
                        </motion.button>
                      </Link>
                    </div>
                )}

                {/* 테마 토글 버튼 */}
                <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.8, duration: 0.3 }}

                    className="w-10 h-10 flex items-center justify-center glass-effect rounded-full theme-toggle hover:bg-white/10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`테마를 ${isDarkMode ? '라이트' : '다크'} 모드로 변경`}
                    title={`${isDarkMode ? '라이트' : '다크'} 모드로 변경`}
                >
                  {isDarkMode ? (
                      <FaSun className="text-yellow-400 text-lg" />
                  ) : (
                      <FaMoon className="text-blue-400 text-lg" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* 모바일 메뉴 버튼 */}

            <div className="md:hidden flex items-center space-x-3 mobile-menu-container ml-auto">
              {/* 모바일 테마 토글 */}
              <motion.button
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}

                  className="w-9 h-9 flex items-center justify-center glass-effect rounded-full theme-toggle focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`테마를 ${isDarkMode ? '라이트' : '다크'} 모드로 변경`}
                  title={`${isDarkMode ? '라이트' : '다크'} 모드로 변경`}
              >
                {isDarkMode ? (
                    <FaSun className="text-yellow-400 text-sm" />
                ) : (
                    <FaMoon className="text-blue-400 text-sm" />
                )}
              </motion.button>

              {/* 햄버거 메뉴 */}
              <motion.button

                  ref={mobileMenuButtonRef}
                  onClick={toggleMobileMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 flex items-center justify-center glass-effect rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`모바일 메뉴 ${isMobileMenuOpen ? '닫기' : '열기'}`}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"

              >
                {isMobileMenuOpen ? (
                    <FaTimes className="text-lg" style={{ color: 'var(--text-primary)' }} />
                ) : (
                    <FaBars className="text-lg" style={{ color: 'var(--text-primary)' }} />
                )}
              </motion.button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          <motion.div
              initial={false}
              animate={{
                height: isMobileMenuOpen ? 'auto' : 0,
                opacity: isMobileMenuOpen ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden mobile-menu-container"
              id="mobile-menu"
              role="menu"
              aria-labelledby="mobile-menu-button"

          >
            {isMobileMenuOpen && (
                <div className="pt-4 pb-2 space-y-2">
                  {/* 네비게이션 메뉴 */}
                  {navItems.map((item, index) => (
                      <Link
                          key={item.name}
                          to={item.path}

                          onClick={handleMobileMenuItemClick}
                          ref={index === 0 ? firstMobileMenuItemRef : null}
                      >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}

                            className={`block px-4 py-3 rounded-lg nav-link focus:outline-none focus:ring-2 focus:ring-blue-500 ${

                                location.pathname === item.path ? 'active' : ''
                            }`}
                            style={{
                              color: location.pathname === item.path ? '#667eea' : 'var(--text-secondary)'
                            }}

                            role="menuitem"
                            aria-label={item.ariaLabel}
                            tabIndex={0}

                        >
                          {item.name}
                        </motion.div>
                      </Link>
                  ))}

                  {/* Challenges 메뉴 (모바일) */}
                  <Link
                      to="/challenges"
                      onClick={handleMobileMenuItemClick}
                  >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navItems.length * 0.1 }}
                        className={`block px-4 py-3 rounded-lg nav-link focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            (location.pathname === '/challenges' || location.pathname.startsWith('/challenges/')) ? 'active' : ''
                        }`}
                        style={{
                          color: (location.pathname === '/challenges' || location.pathname.startsWith('/challenges/')) ? '#667eea' : 'var(--text-secondary)'
                        }}
                        role="menuitem"
                        aria-label="챌린지 페이지로 이동"
                        tabIndex={0}
                    >
                      Challenges
                    </motion.div>
                  </Link>

                  {/* Challenges 서브메뉴 (모바일) */}
                  {challengesItems.map((item, index) => (
                      <Link
                          key={item.name}
                          to={item.path}
                          onClick={handleMobileMenuItemClick}
                      >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (navItems.length + 1 + index) * 0.1 }}
                            className={`block px-8 py-2 rounded-lg nav-link focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                location.pathname === item.path ? 'active' : ''
                            }`}
                            style={{
                              color: location.pathname === item.path ? '#667eea' : 'var(--text-secondary)',
                              opacity: 0.8
                            }}
                            role="menuitem"
                            aria-label={item.ariaLabel}
                            tabIndex={0}
                        >
                          ↳ {item.name}
                        </motion.div>
                      </Link>
                  ))}

                  {/* 구분선 */}
                  <div className="border-t mx-4 my-3" style={{ borderColor: 'var(--border-color)' }} />

                  {/* 모바일 로그인/회원가입 버튼 */}
                  {nickname ? (
                      <div className="px-4 space-y-3">
                        <Link
                            to={
                              userType?.toLowerCase() === 'admin'
                                  ? '/mainpage'
                                  : userType?.toLowerCase() === 'company'
                                      ? '/companypage'
                                      : '/userpage'
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <motion.button
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: navItems.length * 0.1 + 0.1 }}
                              className="w-full text-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--glass-bg)'
                              }}
                              role="menuitem"
                              aria-label="마이페이지로 이동"
                          >
                            {nickname}님
                          </motion.button>
                        </Link>

                        <motion.button
                            onClick={() => {
                              logout();
                              setIsMobileMenuOpen(false);
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: navItems.length * 0.1 + 0.2 }}
                            className="w-full text-center px-4 py-3 rounded-lg btn-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                            role="menuitem"
                            aria-label="로그아웃"
                        >
                          로그아웃
                        </motion.button>
                      </div>
                  ) : (
                      <div className="px-4 space-y-3">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <motion.button
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: navItems.length * 0.1 + 0.1 }}
                              className="w-full text-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--glass-bg)'
                              }}
                              role="menuitem"
                              aria-label="로그인 페이지로 이동"
                          >
                            로그인
                          </motion.button>
                        </Link>

                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <motion.button
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: navItems.length * 0.1 + 0.2 }}
                              className="w-full text-center px-4 py-3 rounded-lg btn-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                              role="menuitem"
                              aria-label="회원가입 페이지로 이동"
                          >
                            회원가입
                          </motion.button>
                        </Link>
                      </div>
                  )}
                </div>
            )}
          </motion.div>
        </div>
      </motion.nav>
  );
}

export default Navigation; 