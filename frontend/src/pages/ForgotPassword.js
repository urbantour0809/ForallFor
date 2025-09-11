/**
 * ForgotPassword 컴포넌트
 * 
 * 비밀번호 찾기를 처리하는 페이지 컴포넌트입니다.
 * 글래스모피즘 효과와 Framer Motion 애니메이션을 적용하여
 * 기존 디자인 시스템과 일관성을 유지합니다.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey, FaArrowLeft } from 'react-icons/fa';
import '../styles/style.css';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증번호 입력, 3: 새 비밀번호 설정
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [emailVerification, setEmailVerification] = useState({
    isRequested: false,
    isVerified: false,
    timer: 180, // 3분
    isTimerRunning: false
  });

  // 타이머 포맷팅 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 이메일 인증번호 요청 처리
  const handleVerificationRequest = () => {
    // TODO: 실제 이메일 인증번호 요청 API 호출
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
  };

  // 인증번호 확인
  const handleVerificationSubmit = () => {
    // TODO: 실제 인증번호 확인 API 호출
    if (verificationCode) {
      setEmailVerification(prev => ({
        ...prev,
        isVerified: true,
        isTimerRunning: false
      }));
      setStep(3); // 새 비밀번호 설정 단계로 이동
    }
  };

  // 새 비밀번호 설정
  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // TODO: 실제 비밀번호 재설정 API 호출
    console.log('Password reset:', { email, newPassword });
    alert('비밀번호가 성공적으로 변경되었습니다.');
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
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden"
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
        {/* 비밀번호 찾기 카드 */}
        <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
          {/* 뒤로가기 버튼 */}
          <motion.div variants={itemVariants} className="mb-6">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FaArrowLeft className="text-sm" />
              로그인으로 돌아가기
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">비밀번호 찾기</h2>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              {step === 1 && '가입한 이메일을 입력해주세요'}
              {step === 2 && '이메일로 전송된 인증번호를 입력해주세요'}
              {step === 3 && '새로운 비밀번호를 설정해주세요'}
            </p>
          </motion.div>

          {/* 단계별 진행 표시 */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 단계 1: 이메일 입력 */}
          {step === 1 && (
            <motion.form 
              variants={itemVariants}
              onSubmit={(e) => {
                e.preventDefault();
                if (email) {
                  setStep(2);
                  handleVerificationRequest();
                }
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                    style={{
                      backgroundColor: email ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--glass-border)'
                    }}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary py-3 rounded-xl font-semibold text-white"
              >
                인증번호 받기
              </motion.button>
            </motion.form>
          )}

          {/* 단계 2: 인증번호 입력 */}
          {step === 2 && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  인증번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                    style={{
                      backgroundColor: verificationCode ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--glass-border)'
                    }}
                    placeholder="인증번호 6자리"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  * 인증번호는 3분간 유효합니다
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerificationSubmit}
                  className="flex-1 btn-primary py-3 rounded-xl font-semibold text-white"
                >
                  인증번호 확인
                </motion.button>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerificationRequest}
                  disabled={emailVerification.isTimerRunning}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--glass-bg)',
                    color: emailVerification.isTimerRunning ? 'var(--text-secondary)' : 'var(--text-primary)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  {emailVerification.isTimerRunning 
                    ? `재전송 (${formatTime(emailVerification.timer)})` 
                    : '재전송'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* 단계 3: 새 비밀번호 설정 */}
          {step === 3 && (
            <motion.form 
              variants={itemVariants}
              onSubmit={handlePasswordReset}
              className="space-y-6"
            >
              {/* 새 비밀번호 입력 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  새 비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                    style={{
                      backgroundColor: newPassword ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
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
              </div>

              {/* 새 비밀번호 확인 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                    style={{
                      backgroundColor: confirmPassword ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--glass-border)'
                    }}
                    placeholder="••••••••"
                    required
                  />
                  {/* 비밀번호 확인 보기/숨기기 버튼 */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary py-3 rounded-xl font-semibold text-white"
              >
                비밀번호 변경
              </motion.button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword; 