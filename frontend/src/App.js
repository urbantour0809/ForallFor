import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import MainPage from './pages/main';
import Languages from './pages/Languages';
import Challenges from './pages/Challenges';
import Test from './pages/Test.js';
import Community from './pages/Community';
import MyPageAdmin from './pages/MyPageAdmin';
import MyPageUser from './pages/MyPageUser';
import MyPageCompany from './pages/MyPageCompany';
import Market from './pages/Market';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProblemSolver from './pages/ProblemSolver';
import WritePost from './pages/WritePost';
import ProductDetail from './pages/ProductDetail.js';
import PostDetail from './pages/PostDetail';
import UpdatePost from './pages/UpdatePost';
import ProductRegister from './pages/ProductRegister';
import ChallengeRegister from './pages/ChallengeRegister';
import Cart from './pages/Cart';
import Purchase from './pages/Purchase';
import PurchaseComplete from './pages/PurchaseComplete';
import TestSolver from './pages/TestSolver';
import './styles/style.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* 네비게이션은 모든 페이지에 공통으로 표시 */}
        <Navigation />
        
        {/* 라우팅 설정 */}
        <Routes>
          {/* 홈 페이지 */}
          <Route path="/" element={<MainPage />} />
          
          {/* 언어 페이지 */}
          <Route path="/languages" element={<Languages />} />
          
          {/* 챌린지 페이지 */}
          <Route path="/challenges" element={<Challenges />} />
          
          {/* 시험 페이지 */}
          <Route path="/test" element={<Test />} />
          
          {/* 커뮤니티 페이지 */}
          <Route path="/community" element={<Community />} />

          {/* 커뮤니티 상세 */}
          <Route path="/post-detail/:post_id" element={<PostDetail />} />
          {/* 게시글 수정 */}
          <Route path="/update-post/:post_id" element={<UpdatePost />} />

          {/* 마켓 페이지 */}
          <Route path="/market" element={<Market />} />
          
          {/* 상품 상세 페이지 */}
          <Route path="/market/:id" element={<ProductDetail />} />
          
          {/* 장바구니 페이지 */}
          <Route path="/cart" element={<Cart />} />
          
          {/* 결제 페이지 */}
          <Route path="/purchase" element={<Purchase />} />
          
          {/* 결제 완료 페이지 */}
          <Route path="/purchase-complete" element={<PurchaseComplete />} />
        
          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />

          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<Signup />} />

          {/* 문제 풀기 페이지 */}

          <Route path="/challenge/:challenge_id" element={<ProblemSolver />} />
          <Route path="/challenge" element={<ProblemSolver />} />

          {/* 시험 풀기 페이지 */}
          <Route path="/tests" element={<TestSolver />} />

          {/* 관리자 페이지 */}
          <Route path="/mainpage" element={<MyPageAdmin/>} />
          <Route path="/mypage-admin" element={<MyPageAdmin/>} />

          {/* 상품 등록 페이지 */}
          <Route path="/product-register" element={<ProductRegister />} />

          {/* 문제 등록 페이지 */}
          <Route path="/challenge-register" element={<ChallengeRegister />} />

          {/* 사용자 페이지 */}
          <Route path="/userpage" element={<MyPageUser/>} />

          {/* 기업 페이지 */}
          <Route path="/companypage" element={<MyPageCompany/>} />

          {/* 게시글 작성 페이지 */}
          <Route path="/write-post" element={<WritePost />} />
          
          {/* 404 페이지 (반드시 마지막에 배치) */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </div>
    </Router>
  );
}

// 404 페이지 컴포넌트
function NotFound() {
  return (
    <div className="page-layout flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
          페이지를 찾을 수 없습니다.
        </p>
        <a 
          href="/" 
          className="btn-primary px-8 py-3 rounded-xl font-semibold inline-block hover:scale-105 transition-transform duration-150"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

export default App;
