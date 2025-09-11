/**
 * ProductDetail 컴포넌트 (상품 상세보기 페이지)
 *
 * 선택된 상품의 상세 정보를 보여주는 페이지입니다.
 * URL 파라미터로 전달받은 상품 ID를 통해 해당 상품의 정보를 표시합니다.
 *
 * 주요 기능:
 * - 상품 상세 정보 표시 (제목, 저자, 출판사, 가격 등)
 * - 상품 이미지 표시
 * - 상세 설명 및 목차
 * - 수량 선택 기능
 * - 장바구니 추가 및 즉시 구매
 * - 뒤로가기 기능
 * - 관련 상품 추천
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaCreditCard,
  FaBook,
  FaArrowLeft
} from 'react-icons/fa';
import { getBookCoverImage, hasBookCoverImage, getBookCoverFallbackStyle, getBookCoverAltText } from '../utils/imageUtils';
import '../styles/style.css';
import axios from 'axios'; // 백엔드 통신 방식

function ProductDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  // 상품 상세 데이터 상태
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 상품 상세 데이터 가져오기
  useEffect(() => {
    const fetchProductDetail = async () => {
      const product_id = searchParams.get('product_id');
      if (!product_id) return;

      try {
        setLoading(true);
        setError(null);

        const requestData = { product_id: parseInt(product_id) };
        console.log('보내는 데이터:', requestData);
        console.log('보내는 데이터 JSON:', JSON.stringify(requestData));
        console.log('product_id 타입:', typeof parseInt(product_id));
        console.log('product_id 값:', parseInt(product_id));

        const response = await axios.post(`http://localhost:8080/FAF/api/productdetail`, {
          product_id : parseInt(product_id)
        }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = response.data;
        console.log('상품 상세 응답:', data);

        // Controller에서 상품 상세 정보를 리턴하므로 data 자체가 상품 정보
        if (data && data.productDetail) {
          setProduct(data.productDetail);
        } else {
          // 서버에서 데이터를 가져오지 못한 경우 기본 데이터 사용
          setProduct(getDefaultProduct());
        }
      } catch (error) {
        console.error('상품 상세 데이터 가져오기 오류:', error);
        setError('상품 정보를 불러오는데 실패했습니다.');
        // 오류 발생 시 기본 데이터 사용
        setProduct(getDefaultProduct());
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [searchParams]);



  /**
   * 기본 상품 데이터 (서버 연결 실패 시 사용)
   */
  const getDefaultProduct = () => ({
    product_id: 1,
    title: "Java 완벽 가이드",
    subtitle: "객체지향 프로그래밍부터 Spring까지",
    author: "김자바",
    publisher: "코딩출판사",
    price: 35000,
    language: "java",
    pages: 680,
    description: "Java의 기초부터 실무 활용까지 체계적으로 학습할 수 있는 완벽한 가이드북",
    detailedDescription: `
      이 책은 Java 프로그래밍 언어를 처음 배우는 초보자부터 실무에서 Java를 활용하고자 하는 개발자까지 
      모든 수준의 독자를 대상으로 합니다. 

      Java의 기본 문법부터 시작하여 객체지향 프로그래밍의 핵심 개념들을 체계적으로 설명하고, 
      실무에서 가장 많이 사용되는 Spring Framework까지 다룹니다.

      각 장마다 실습 예제와 연습문제를 제공하여 이론과 실무를 균형있게 학습할 수 있도록 구성했습니다.
    `,
    tableOfContents: [
      "1장. Java 기초와 개발환경 설정",
      "2장. 변수와 자료형",
      "3장. 제어문과 반복문",
      "4장. 배열과 컬렉션",
      "5장. 객체지향 프로그래밍",
      "6장. 상속과 다형성",
      "7장. 예외처리",
      "8장. 제네릭과 람다",
      "9장. 스트림 API",
      "10장. Spring Framework 입문"
    ],
    tags: ["객체지향", "Spring", "실무"],
    specifications: {
      isbn: "978-89-1234-567-8",
      publishDate: "2024.01.15",
      paperType: "무선제본",
      size: "188 × 257 mm"
    }
  });

  /**
   * 뒤로가기 함수
   */
  const goBack = () => {
    navigate('/market');
  };

  /**
   * 장바구니 추가 함수
   */
  const addToCart = async () => {
    if (!product) return;

    try {
      const response = await axios.post(
          'http://localhost:8080/FAF/api/cart/add',
          {
            product_id: product.product_id,
            quantity: 1
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      const data = response.data;
      console.log('장바구니 추가 응답:', data);

        if (data && data.status === 'success') {
          console.log("✅ 장바구니에 정상적으로 추가됨");
          const goToCart = window.confirm("장바구니에 추가되었습니다.\n장바구니로 이동하시겠습니까?");
          if (goToCart) {
            navigate('/cart'); // 장바구니 페이지로 이동
          }
        } else {
          console.log("❌ success가 false거나 누락됨:", data);
          alert(data.message || '장바구니 추가에 실패했습니다.');
        }
      } catch (error) {
      console.error('장바구니 추가 오류:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('장바구니 추가 중 오류가 발생했습니다.');
      }
    }
  };

  /**
   * 바로구매 함수
   */
  const buyNow = async () => {
    if (!product) return;


      if (product) {
        // 바로구매 시 결제 페이지로 이동
        navigate(`/purchase?product_id=${product.product_id}`);
      } else {
        alert('상품 정보를 불러오는데 실패했습니다.');
      }

  };



  // 로딩 중일 때 표시
  if (loading) {
    return (
        <div className="page-layout page-layout-relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
                상품 정보를 불러오는 중...
              </p>
            </div>
          </div>
        </div>
    );
  }

  // 오류 발생 시 표시
  if (error) {
    return (
        <div className="page-layout page-layout-relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <p className="text-lg text-red-500 mb-4">{error}</p>
              <button
                  onClick={() => window.location.reload()}
                  className="btn-primary px-6 py-2 rounded-lg"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
    );
  }

  // 상품이 없을 때 표시
  if (!product) {
    return (
        <div className="page-layout page-layout-relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                상품을 찾을 수 없습니다.
              </p>
              <button
                  onClick={goBack}
                  className="btn-primary px-6 py-2 rounded-lg mt-4"
              >
                마켓으로 돌아가기
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="page-layout page-layout-relative">
        {/* 배경 효과 */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 뒤로가기 버튼 */}
          <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={goBack}
              className="flex items-center space-x-2 mb-8 px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-all"
              style={{ color: 'var(--text-secondary)' }}
          >
            <FaArrowLeft />
            <span>돌아가기</span>
          </motion.button>

          {/* 상품 정보 섹션 */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* 상품 이미지 */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="glass-effect rounded-3xl p-8"
            >
              <div className="aspect-[3/4] rounded-2xl mb-6 overflow-hidden relative">
                {hasBookCoverImage(product) ? (
                    <img
                        src={getBookCoverImage(product)}
                        alt={getBookCoverAltText(product)}
                        className="w-full h-full object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // 이미지 로드 실패 시 기본 스타일로 대체
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className={`absolute inset-0 bg-gradient-to-br rounded-2xl flex items-center justify-center ${
                        hasBookCoverImage(product) ? 'hidden' : 'flex'
                    }`}
                    style={getBookCoverFallbackStyle(product.languages)}
                >
                  <FaBook className="text-8xl opacity-50" style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>


            </motion.div>

            {/* 상품 상세 정보 */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
            >
              {/* 제목과 부제목 */}
              <div>
                <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {product.product_title}
                </h1>
                <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                  {product.stitle}
                </p>
              </div>

              {/* 저자 및 출판사 정보 */}
              <div className="glass-effect rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>저자</span>
                    <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>{product.writer}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>출판사</span>
                    <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>{product.publisher}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>페이지</span>
                    <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>{product.page}페이지</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>언어</span>
                    <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {product.languages === 'multiple' ? '다중언어' : product.languages.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* 가격 */}
              <div className="glass-effect rounded-2xl p-6">
                <div className="text-4xl font-bold gradient-text mb-2">
                  {product.price ? product.price.toLocaleString() : '0'}포인트
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  무료배송 • 당일발송
                </p>
              </div>



              {/* 구매 버튼들 */}
              <div className="flex space-x-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addToCart}
                    className="flex-1 btn-secondary py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 text-lg"
                >
                  <FaShoppingCart />
                  <span>장바구니</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={buyNow}
                    className="flex-1 btn-primary py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 text-lg"
                >
                  <FaCreditCard />
                  <span>바로구매</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* 상품 상세 정보 탭 */}
          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-effect rounded-3xl p-8"
          >



          </motion.div>
        </div>
      </div>
  );
}

export default ProductDetail; 