/**
 * Signup 컴포넌트
 *
 * 회원가입을 처리하는 페이지 컴포넌트입니다.
 * 로그인 페이지와 동일한 디자인 시스템을 사용하여
 * 일관된 사용자 경험을 제공합니다.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaUserTag, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import '../styles/style.css';
import axios from 'axios';

// Google 로고 컴포넌트
const GoogleLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
);

function Signup() {
  // 기업/회원 선택 상태
  const [userType, setUserType] = useState('USER'); // 'USER' 또는 'COMPANY'

  // 아이디 및 닉네임 중복 확인
  const [duplicateStatus, setDuplicateStatus] = useState({
    idDuplicate: false,
    nicknameDuplicate: false,
    message: ''
  });

  const [formData, setFormData] = useState({
    id: '', // 로그인용 아이디
    nickname: '', // 표시될 닉네임
    companyName: '', // 기업명 (기업일 때만)
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // 비밀번호 보기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);

  const [emailVerification, setEmailVerification] = useState({
    isRequested: false,
    isVerified: false,
    timer: 180, // 3분
    isTimerRunning: false
  });

  // 아이디 및 닉네임 중복확인
  const checkIdOrNickname = async () => {
    try {
      const response = await axios.post(
          'http://localhost:8080/FAF/api/check-id-or-nickname',
          {
            id: formData.id,
            nickname: userType === 'COMPANY' ? formData.companyName : formData.nickname
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      const data = response.data;
      setDuplicateStatus({
        idDuplicate: data.checkid,
        nicknameDuplicate: data.checknickname,
        message: data.message
      });
    } catch (error) {
      console.error('중복 확인 오류:', error);
    }
  };


  // 타이머 포맷팅 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 이메일 인증번호 요청 처리
  const handleVerificationRequest = async () => {
    try {
      console.log('이메일 인증번호 요청:', { email: formData.email });

      const response = await axios.post(
          'http://localhost:8080/FAF/api/email-verification',
          {
            email: formData.email
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      const data = response.data;
      console.log('이메일 인증번호 요청 응답:', data);

      if (data && data.success) {
        setEmailVerification(prev => ({
          ...prev,
          isRequested: true,
          isTimerRunning: true,
          timer: 180
        }));

        // 타이머 시작
        const interval = setInterval(() => {
          setEmailVerification(prev => {
            if (prev.timer <= 1) {
              clearInterval(interval);
              return {
                ...prev,
                timer: 0,
                isTimerRunning: false,
                isRequested: false
              };
            }
            return {
              ...prev,
              timer: prev.timer - 1
            };
          });
        }, 1000);

        alert('인증번호가 이메일로 전송되었습니다.');
      } else {
        alert(data?.message || '인증번호 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증번호 요청 오류:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('인증번호 요청 중 오류가 발생했습니다.');
      }
    }
  };

  // 인증번호 확인
  const handleVerificationSubmit = async () => {
    try {
      console.log('인증번호 확인:', {
        email: formData.email,
        verificationCode: formData.verificationCode
      });

      const response = await axios.post(
          'http://localhost:8080/FAF/api/email-verification/verify',
          {
            email: formData.email,
            verificationCode: formData.verificationCode
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      const data = response.data;
      console.log('인증번호 확인 응답:', data);

      if (data && data.success) {
        setEmailVerification(prev => ({
          ...prev,
          isVerified: true,
          isTimerRunning: false
        }));
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert(data?.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증번호 확인 오류:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('인증번호 확인 중 오류가 발생했습니다.');
      }
    }
  };

  // 아이디, 닉네임 중복확인
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    setFormData(updatedFormData);

    // 중복 체크 자동 호출
    if (name === 'id' || name === 'nickname' || name === 'companyName') {
      const checkPayload = {
        id: name === 'id' ? value : updatedFormData.id,
        nickname: userType === 'COMPANY'
            ? name === 'companyName' ? value : updatedFormData.companyName
            : name === 'nickname' ? value : updatedFormData.nickname
      };
      checkIdOrNicknameWithData(checkPayload);
    }
  };

// helper 함수
  const checkIdOrNicknameWithData = async (data) => {
    try {
      const response = await axios.post(
          'http://localhost:8080/FAF/api/check-id-or-nickname',
          data,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );
      setDuplicateStatus({
        idDuplicate: response.data.checkid,
        nicknameDuplicate: response.data.checknickname,
        message: response.data.message
      });
    } catch (error) {
      console.error('중복 확인 오류:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 이메일 인증 확인
    if (!emailVerification.isVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    // 이용약관 동의 확인
    if (!formData.agreeToTerms) {
      alert('이용약관에 동의해주세요.');
      return;
    }

    try {
      console.log('회원가입 시도:', {
        id: formData.id,
        nickname: userType === 'COMPANY' ? formData.companyName : formData.nickname,
        email: formData.email,
        password: formData.password,
        user_type: userType
      });

      const signupData = {
        id: formData.id,
        nickname: userType === 'COMPANY' ? formData.companyName : formData.nickname,
        email: formData.email,
        password: formData.password,
        user_type: userType, // 'USER' 또는 'COMPANY'
        experience_points: 0, // 초기값
        grade_id: 1 // 초기값
      };

      const response = await axios.post(
          'http://localhost:8080/FAF/api/signup',
          signupData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      const data = response.data;
      console.log('회원가입 응답:', data);

      if (data && data.success) {
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        window.location.href = '/login';
      } else {
        console.error('회원가입 실패:', data?.message || '알 수 없는 오류');
        alert(data?.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('회원가입 요청 중 오류가 발생했습니다.');
      }
    }
  };

  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
      <div className="min-h-screen pt-28 pb-12 flex items-center justify-center relative overflow-hidden"
           style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* 배경 효과 */}
        <div className="fixed inset-0" style={{ zIndex: -1 }}>
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
               style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
               style={{ background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1), rgba(102, 126, 234, 0.1))' }} />
        </div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mx-4"
        >
          {/* 회원가입 카드 */}
          <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">
                {userType === 'COMPANY' ? '기업 회원가입' : '개인 회원가입'}
              </h2>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                {userType === 'COMPANY'
                    ? '기업 계정을 만들고 팀 학습을 시작하세요'
                    : '새로운 계정을 만들고 학습을 시작하세요'
                }
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기업/회원 선택 */}
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  회원 유형
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                      type="button"
                      onClick={() => setUserType('USER')}
                      className="py-3 px-4 rounded-xl font-medium transition-all duration-200 relative overflow-hidden"
                      style={{
                        backgroundColor: 'transparent',
                        color: userType === 'USER' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        border: 'none'
                      }}
                  >
                    {/* 선택된 버튼일 때만 밑줄 표시 */}
                    {userType === 'USER' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <FaUser className="text-lg" />
                      <span>개인 회원</span>
                    </div>
                  </button>

                  <button
                      type="button"
                      onClick={() => setUserType('COMPANY')}
                      className="py-3 px-4 rounded-xl font-medium transition-all duration-200 relative overflow-hidden"
                      style={{
                        backgroundColor: 'transparent',
                        color: userType === 'COMPANY' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        border: 'none'
                      }}
                  >
                    {/* 선택된 버튼일 때만 밑줄 표시 */}
                    {userType === 'COMPANY' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <FaUserTag className="text-lg" />
                      <span>기업 회원</span>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* 아이디(username) 입력 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {userType === 'COMPANY' ? '기업 아이디' : '아이디'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                      style={{
                        backgroundColor: formData.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--glass-border)'
                      }}
                      placeholder={userType === 'COMPANY' ? '기업 로그인에 사용할 아이디' : '로그인에 사용할 아이디'}
                      maxLength={50}
                      required
                  />
                </div>

                {duplicateStatus.idDuplicate && (
                    <p className="text-sm text-red-500 mt-1">이미 존재하는 아이디입니다.</p>
                )}

              </motion.div>

              {/* 비밀번호 입력 - 보기/숨기기 기능 추가 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                      style={{
                        backgroundColor: formData.password ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--glass-border)'
                      }}
                      placeholder="••••••••"
                      required
                  />
                  {/* 비밀번호 보기/숨기기 버튼 */}
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      style={{ color: 'var(--text-secondary)' }}
                  >
                    {showPassword ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  * 영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요
                </p>
              </motion.div>

              {/* 비밀번호 확인 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                      style={{
                        backgroundColor: formData.confirmPassword ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--glass-border)'
                      }}
                      placeholder="••••••••"
                      required
                  />
                </div>
              </motion.div>

              {/* 닉네임(nickname) 입력 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {userType === 'COMPANY' ? '기업명' : '닉네임'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTag className="text-gray-400" />
                  </div>
                  <input
                      type="text"
                      name={userType === 'COMPANY' ? 'companyName' : 'nickname'}
                      value={userType === 'COMPANY' ? formData.companyName : formData.nickname}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                      style={{
                        backgroundColor: (userType === 'COMPANY' ? formData.companyName : formData.nickname) ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--glass-border)'
                      }}
                      placeholder={userType === 'COMPANY' ? '기업명을 입력하세요' : '커뮤니티에서 표시될 닉네임'}
                      maxLength={30}
                      required
                  />
                </div>

                {duplicateStatus.nicknameDuplicate && (
                    <p className="text-sm text-red-500 mt-1">이미 존재하는 닉네임입니다.</p>
                )}

              </motion.div>

              {/* 이메일 입력 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                      style={{
                        backgroundColor: formData.email ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--glass-border)'
                      }}
                      placeholder="your@email.com"
                      required
                      disabled={emailVerification.isVerified}
                  />
                </div>

                {/* 인증번호 요청 버튼 */}
                {!emailVerification.isVerified && (
                    <motion.button
                        type="button"
                        onClick={handleVerificationRequest}
                        disabled={!formData.email || emailVerification.isTimerRunning}
                        className="w-full mt-2 py-2 rounded-xl font-medium transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--glass-bg)',
                          color: emailVerification.isTimerRunning ? 'var(--text-secondary)' : 'var(--text-primary)',
                          border: '1px solid var(--glass-border)'
                        }}
                    >
                      {emailVerification.isTimerRunning
                          ? `인증번호 재요청 (${formatTime(emailVerification.timer)})`
                          : '인증번호 요청'}
                    </motion.button>
                )}

                {/* 인증번호 입력 필드 */}
                {emailVerification.isRequested && !emailVerification.isVerified && (
                    <div className="mt-4 space-y-2">
                      <div className="relative flex items-center gap-2">
                        <div className="flex-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaKey className="text-gray-400" />
                          </div>
                          <input
                              type="text"
                              name="verificationCode"
                              value={formData.verificationCode}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2 rounded-xl glass-dark focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              style={{
                                backgroundColor: 'var(--glass-bg)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--glass-border)'
                              }}
                              placeholder="인증번호 6자리"
                              maxLength={6}
                          />
                        </div>
                        <button
                            type="button"
                            onClick={handleVerificationSubmit}
                            className="shrink-0 px-6 py-2 rounded-xl text-sm font-medium btn-primary"
                        >
                          확인
                        </button>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        * 인증번호는 3분간 유효합니다
                      </p>
                    </div>
                )}

                {/* 인증 완료 메시지 */}
                {emailVerification.isVerified && (
                    <p className="text-sm" style={{ color: '#10B981' }}>
                      ✓ 이메일 인증이 완료되었습니다
                    </p>
                )}
              </motion.div>

              {/* 이용약관 동의 */}
              <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
                    required
                />
                <label htmlFor="agreeToTerms" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>이용약관과 개인정보 처리방침에 동의합니다</span>
                </label>
              </motion.div>

              {/* 회원가입 버튼 */}
              <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-primary py-3 rounded-xl font-semibold text-white"
              >
                {userType === 'COMPANY' ? '기업 회원가입' : '개인 회원가입'}
              </motion.button>
            </form>

            {/* 로그인 링크 */}
            <motion.p
                variants={itemVariants}
                className="mt-8 text-center text-sm"
                style={{ color: 'var(--text-secondary)' }}
            >
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="font-semibold gradient-text">
                로그인
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
  );
}

export default Signup; 