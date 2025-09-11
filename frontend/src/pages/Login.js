/**
 * Login 컴포넌트
 * 
 * 사용자 로그인을 처리하는 페이지 컴포넌트입니다.
 * 글래스모피즘 효과와 Framer Motion 애니메이션을 적용하여
 * 기존 디자인 시스템과 일관성을 유지합니다.
 */

import React, { useState } from 'react'; //리액트
import { motion } from 'framer-motion'; //애니메이션 
import { Link } from 'react-router-dom'; // 페이지 이동 
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaUserTag } from 'react-icons/fa'; // 아이콘
import { SiNaver } from 'react-icons/si'; //아이콘
import '../styles/style.css'; //css
import axios from 'axios'; // api통신방식

// Google 로고 컴포넌트
const GoogleLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

function Login() {
  // 실시간 변동 스크립트 미구현시 훅도 필요없음
  const [id, setId] = useState(''); // onChange={(e) => setId(e.target.value)}// 실시간 스크립트 구현할거 아니면 필요 x
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => { //form에 onSubmit={handleSubmit}을 넣어 로그인 버튼 submit시 handleSubmit작동 -> e.preventDefault();처리를 하여 새로고침 방지
    e.preventDefault();               //해당 처리를 안하면 로그인 버튼 클릭 시 페이지가 새로고침됨
    
    try {
      console.log('로그인 시도:', { id: id, password });


      //respontse.data.키값 호출가능  axios.post("경로", "보내는 데이터","요청 추가설정")
      const response = await axios.post( //await쓰는 이유 :axios.post는 서버에 요청을 보내고 응답을 받아야 하는데 요청만 보내지고 아래 로그인 로직이 실행됨
        'http://localhost:8080/FAF/api/login', 
        { //html태그에 input value값을 여기에 쓴다
          id: id,
          password: password //서버에 보내는 데이터 작성 
        }, 
        {
          withCredentials: true, // 세션 쿠키 포함
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      //response.data를 data에 담기
      const data = response.data;
      console.log('서버 응답:', data);
      
      if (data && data.success) {
        console.log('로그인 성공');

        
        localStorage.setItem('userSession', JSON.stringify(data.userSession)); //새로고침시에도 데이터 유지를 위한 로컬 스토리지 처리
        
        window.location.href = '/';
      } else {
        console.error('로그인 실패:');
        alert(data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('로그인 요청 중 오류가 발생했습니다.');
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
        {/* 로그인 카드 */}
        <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back!</h2>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              계정에 로그인하고 학습을 이어가세요
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 입력 */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                아이디
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={id} //얘가 axios.post("경로", "보내는데이터(여기)", 추가사항)에 해당됨
                  onChange={(e) => setId(e.target.value)}// 실시간 스크립트 구현할거 아니면 필요 x
                  className="w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                  style={{
                    backgroundColor: id ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--glass-border)'
                  }}
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:bg-blue-900/30"
                  style={{
                    backgroundColor: password ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
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
            </motion.div>

            {/* 로그인 버튼 */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full btn-primary py-3 rounded-xl font-semibold text-white"
            >
              로그인
            </motion.button>
          </form>

          {/* 소셜 로그인 */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--glass-border)' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-sm" style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  color: 'var(--text-secondary)' 
                }}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                style={{ 
                  backgroundColor: '#03C75A',
                  color: 'white',
                  border: 'none'
                }}
              >
                <SiNaver className="text-xl" />
                <span className="text-sm">Naver으로 로그인</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                style={{ 
                  backgroundColor: '#ffffff',
                  color: '#757575',
                  border: '1px solid #dadce0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}
              >
                <GoogleLogo />
                <span className="text-sm font-medium">Google으로 로그인</span>
              </motion.button>
            </div>
          </motion.div>

          {/* 비밀번호 찾기 링크 */}
          <motion.p 
            variants={itemVariants}
            className="mt-8 text-center text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            비밀번호를 잊으셨나요?{' '}
            <Link to="/forgot-password" className="font-semibold gradient-text">
              비밀번호 찾기
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login; 