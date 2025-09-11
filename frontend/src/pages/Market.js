/**
 * Market 컴포넌트 (마켓 페이지)
 *
 * 프로그래밍 관련 교재 및 책을 판매하는 마켓 페이지입니다.
 * 언어별, 가격대별 필터링 기능과 함께 각 교재의 기본 정보를 제공합니다.
 *
 * 주요 기능:
 * - 언어별 필터링 (Java, Python, JavaScript, 전체 등)
 * - 가격대별 필터링
 * - 교재 카드 형태의 직관적인 UI
 * - 가격, 저자, 출판사 정보 표시
 * - 반응형 그리드 레이아웃
 * - 장바구니 추가 및 즉시 구매 기능
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBook, FaFilter } from 'react-icons/fa';
import { getBookCoverImage, hasBookCoverImage, getBookCoverFallbackStyle, getBookCoverAltText } from '../utils/imageUtils';
import '../styles/style.css';
import axios from 'axios'; // 백엔드 통신 방식

function Market() {
  const navigate = useNavigate();

  // 현재 선택된 언어 필터
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  // 현재 선택된 가격대 필터
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // 상품 데이터 상태
  const [products, setProducts] = useState([]);

  // 컴포넌트 마운트 시 상품 데이터 가져오기
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * 백엔드에서 상품 데이터를 가져오는 함수
   */
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/FAF/api/products', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      console.log('서버 응답:', data);

      // Controller에서 productList 키로 상품 리스트를 리턴하므로 data.productList로 접근
      if (data && data.productList && Array.isArray(data.productList)) {
        setProducts(data.productList);
      } else {
        // 서버에서 데이터를 가져오지 못한 경우 기본 데이터 사용
        setProducts(getDefaultProducts());
      }
    } catch (error) {
      console.error('상품 데이터 가져오기 오류:', error);
      // 오류 발생 시 기본 데이터 사용
      setProducts(getDefaultProducts());
    }
  };

  /**
   * 기본 상품 데이터 (서버 연결 실패 시 사용)
   */
  const getDefaultProducts = () => [
    {
      id: 1,
      title: "Java 완벽 가이드",
      subtitle: "객체지향 프로그래밍부터 Spring까지",
      author: "김자바",
      publisher: "코딩출판사",
      price: 35000,
      language: "java",
      pages: 680,
      description: "Java의 기초부터 실무 활용까지 체계적으로 학습할 수 있는 완벽한 가이드북",
      tags: ["객체지향", "Spring", "실무"]
    },
    {
      id: 2,
      title: "Python 데이터 분석 입문",
      subtitle: "pandas, numpy부터 머신러닝까지",
      author: "이파이썬",
      publisher: "데이터북스",
      price: 28000,
      language: "python",
      pages: 520,
      description: "Python을 활용한 데이터 분석의 모든 것을 담은 입문서",
      tags: ["데이터분석", "pandas", "numpy"]
    },
    {
      id: 3,
      title: "JavaScript 모던 웹 개발",
      subtitle: "ES6+와 React로 배우는 최신 웹 개발",
      author: "박자바스크립트",
      publisher: "웹개발사",
      price: 32000,
      language: "javascript",
      pages: 590,
      description: "최신 JavaScript 문법과 React를 활용한 모던 웹 개발 가이드",
      tags: ["ES6+", "React", "웹개발"]
    },
    {
      id: 4,
      title: "알고리즘 문제 해결 전략",
      subtitle: "코딩테스트 완벽 대비서",
      author: "최알고리즘",
      publisher: "알고리즘출판",
      price: 45000,
      language: "multiple",
      pages: 720,
      description: "코딩테스트 합격을 위한 알고리즘 문제 해결 전략 완벽 가이드",
      tags: ["알고리즘", "코딩테스트", "자료구조"]
    },
    {
      id: 5,
      title: "C++ 게임 프로그래밍",
      subtitle: "언리얼 엔진으로 배우는 게임 개발",
      author: "김게임",
      publisher: "게임개발사",
      price: 38000,
      language: "cpp",
      pages: 650,
      description: "C++과 언리얼 엔진을 활용한 게임 프로그래밍 실무서",
      tags: ["게임개발", "언리얼엔진", "C++"]
    },
    {
      id: 6,
      title: "Rust 시스템 프로그래밍",
      subtitle: "안전하고 빠른 시스템 개발",
      author: "러스트마스터",
      publisher: "시스템북스",
      price: 36000,
      language: "rust",
      pages: 580,
      description: "Rust를 활용한 안전하고 효율적인 시스템 프로그래밍",
      tags: ["시스템프로그래밍", "메모리안전성", "동시성"]
    }
  ];

  // 필터 옵션들
  const languageFilters = [
    { id: 'all', name: '전체 언어', count: products.length },
    { id: 'java', name: 'Java', count: products.filter(p => p.languages === 'java').length },
    { id: 'python', name: 'Python', count: products.filter(p => p.languages === 'python').length },
    { id: 'javascript', name: 'JavaScript', count: products.filter(p => p.languages === 'javascript').length },
    { id: 'cpp', name: 'C++', count: products.filter(p => p.languages === 'cpp').length },
    { id: 'rust', name: 'Rust', count: products.filter(p => p.languages === 'rust').length },
    { id: 'multiple', name: '다중언어', count: products.filter(p => p.languages === 'multiple').length }
  ];

  const priceRanges = [
    { id: 'all', name: '전체 가격' },
    { id: 'under30', name: '3만원 이하' },
    { id: '30to40', name: '3~4만원' },
    { id: 'over40', name: '4만원 이상' }
  ];

  // 필터링된 상품 목록
  const filteredProducts = products.filter(product => {
    const languageMatch = selectedLanguage === 'all' || product.languages === selectedLanguage;

    let priceMatch = true;
    if (selectedPriceRange === 'under30') priceMatch = product.price < 30000;
    else if (selectedPriceRange === '30to40') priceMatch = product.price >= 30000 && product.price < 40000;
    else if (selectedPriceRange === 'over40') priceMatch = product.price >= 40000;

    return languageMatch && priceMatch;
  });

  /**
   * 상품 카드 클릭 시 상세 페이지로 이동
   */
  const handleProductClick = (product_id) => {
    navigate(`/market/detail?product_id=${product_id}`);
  };

  const handleAddToCart = async (product) => {
    const item = {
      product_id: product.product_id || product.id,
      quantity: 1,
    };

    try {
      const res = await axios.post('http://localhost:8080/FAF/api/cart/add', item, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.data.status === 'success') {
        const goToCart = window.confirm("상품이 장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?");
        if (goToCart) navigate('/cart');
      } else if (res.data.status === 'fail' && res.data.message === '로그인이 필요합니다.') {
        alert("로그인이 필요한 기능입니다. 로그인 후 이용해주세요.");
        navigate('/login');
      } else {
        alert("장바구니 추가에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error); // ✅ 콘솔 에러 출력
      alert('장바구니 추가 중 오류가 발생했습니다.');
    }
  };



  return (
        <div className="page-layout page-layout-relative">
      {/* 배경 효과 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1
            className="text-5xl md:text-7xl font-bold mb-8 gradient-text"
            style={{
              lineHeight: '1.2',
              paddingTop: '0.2em',
              paddingBottom: '0.2em'
            }}
          >
            Programming Market
          </h1>
          <p
            className="text-xl md:text-2xl max-w-3xl mx-auto mt-6"
            style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}
          >
            전문가가 엄선한 프로그래밍 교재로 체계적인 학습을 시작하세요.
          </p>
        </motion.div>

        {/* 필터 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-12 space-y-6"
        >
          {/* 언어 필터 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--text-primary)' }}>
              <FaBook className="mr-2" />
              프로그래밍 언어
            </h3>
            <div className="flex flex-wrap gap-3">
              {languageFilters.map(filter => (
                  <motion.button
                      key={filter.id}
                      onClick={() => setSelectedLanguage(filter.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                          selectedLanguage === filter.id
                              ? 'glass-effect border-2 border-blue-500'
                              : 'glass-effect border border-transparent'
                      }`}
                      style={{ color: 'var(--text-primary)' }}
                  >
                    {filter.name} ({filter.count})
                  </motion.button>
              ))}

            </div>
          </div>

          {/* 가격 필터 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--text-primary)' }}>
              <FaFilter className="mr-2" />
              가격대
            </h3>
            <div className="flex flex-wrap gap-3">
              {priceRanges.map(range => (
                <motion.button
                  key={range.id}
                  onClick={() => setSelectedPriceRange(range.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                    selectedPriceRange === range.id 
                      ? 'glass-effect border-2 border-blue-500' 
                      : 'glass-effect border border-transparent'
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {range.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 결과 요약 및 장바구니 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex justify-between items-center"
        >
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            총 <span className="font-bold gradient-text">{filteredProducts.length}</span>개의 상품이 있습니다.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 btn-primary rounded-xl font-semibold flex items-center space-x-2"
            onClick={() => navigate('/cart')}
          >
            <FaShoppingCart />
            <span>장바구니</span>
          </motion.button>
        </motion.div>

        {/* 상품 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
                key={product.product_id || product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.15 }
              }}
              className="glass-effect rounded-3xl overflow-hidden group cursor-pointer gpu-accelerated flex flex-col"
              onClick={() => handleProductClick(product.product_id)}
            >
              {/* 상품 이미지 */}
              <div className="relative h-48 overflow-hidden">
                {/* 언어 태그 - 오른쪽 상단 */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full glass-effect border border-white/20">
                    {product.languages === 'multiple' ? '다중언어' : product.languages.toUpperCase()}
                  </span>
                </div>

                {hasBookCoverImage(product) ? (
                  <img
                    src={getBookCoverImage(product)}
                    alt={getBookCoverAltText(product)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 스타일로 대체
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`absolute inset-0 bg-gradient-to-br flex items-center justify-center ${
                    hasBookCoverImage(product) ? 'hidden' : 'flex'
                  }`}
                  style={getBookCoverFallbackStyle(product.languages)}
                >
                  <FaBook className="text-6xl opacity-50" style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* 상품 정보 */}
              <div className="p-6 flex-1 flex flex-col">
                {/* 제목과 부제목 */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {product.product_title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {product.stitle}
                  </p>
                </div>

                {/* 저자와 출판사 */}
                <div className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>{product.writer} 저 | {product.publisher}</p>
                  <p>{product.page}페이지</p>
                </div>

                {/* 설명 */}
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {product.content}
                </p>



                {/* 가격 - 하단 고정 */}
                <div className="mt-auto pt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold gradient-text">
                      {product.price ? product.price.toLocaleString() : '0'}포인트
                    </span>
                  </div>
                  {/* 🔽 장바구니 버튼 추가 */}
                  <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ 카드 클릭 막기
                        handleAddToCart(product);
                      }}
                      className="mt-4 w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    장바구니 담기
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 통계 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 glass-effect rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-8 gradient-text">마켓 현황</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2 gradient-text">{products.length}+</div>
              <div style={{ color: 'var(--text-secondary)' }}>총 상품 수</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 gradient-text">6</div>
              <div style={{ color: 'var(--text-secondary)' }}>지원 언어</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 gradient-text">100%</div>
              <div style={{ color: 'var(--text-secondary)' }}>정품 보장</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 gradient-text">24시간</div>
              <div style={{ color: 'var(--text-secondary)' }}>빠른 배송</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Market;

