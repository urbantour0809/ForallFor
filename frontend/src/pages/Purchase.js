/**
 * Purchase 컴포넌트 (결제 페이지)
 *
 * 장바구니에서 구매하기 또는 상품 상세에서 바로구매를 통해 이동하는 결제 페이지입니다.
 * URL 파라미터로 cart_id 또는 product_id를 받아서 결제 정보를 표시합니다.
 *
 * 주요 기능:
 * - 장바구니 전체 구매 (cart_id 기반)
 * - 개별 상품 바로구매 (product_id 기반)
 * - 사용자 포인트 잔액 표시
 * - 결제 후 잔액 계산
 * - 결제 확인 및 처리
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FaCreditCard,
  FaShoppingCart,
  FaArrowLeft,
  FaCheck,
  FaUser,
  FaWallet,
  FaShieldAlt
} from 'react-icons/fa';
import { getBookCoverImage, hasBookCoverImage, getBookCoverFallbackStyle, getBookCoverAltText } from '../utils/imageUtils';
import '../styles/style.css';
import axios from 'axios';

function Purchase() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 결제 데이터 상태
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseType, setPurchaseType] = useState(''); // 'cart' 또는 'product'
  const [purchaseId, setPurchaseId] = useState(null); // cart_id 또는 product_id

  // 컴포넌트 마운트 시 결제 데이터 가져오기
  useEffect(() => {
    const fetchPurchaseData = async () => {
      const cartId = searchParams.get('cart_id');
      const productId = searchParams.get('product_id');

      if (!cartId && !productId) {
        setError('결제 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (cartId) {
          // 장바구니 전체 구매
          setPurchaseType('cart');
          setPurchaseId(cartId);
          await fetchCartPurchaseData(cartId);
        } else if (productId) {
          // 개별 상품 바로구매
          setPurchaseType('product');
          setPurchaseId(productId);
          await fetchProductPurchaseData(productId);
        }
      } catch (error) {
        console.error('결제 데이터 가져오기 오류:', error);
        setError('결제 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, [searchParams]);

  /**
   * 장바구니 전체 구매 데이터 가져오기
   */
  const fetchCartPurchaseData = async (cartId) => {
    try {
      // 장바구니 상품 목록 가져오기
      const cartResponse = await axios.get(`http://localhost:8080/FAF/api/cart/productsList`, {
        withCredentials: true
      });

      if (cartResponse.data.status === 'success') {
        const items = cartResponse.data.data || [];
        setPurchaseItems(items);
      }

      // 사용자 정보 가져오기
      await fetchUserInfo();
    } catch (error) {
      console.error('장바구니 구매 데이터 가져오기 오류:', error);
      throw error;
    }
  };

  /**
   * 개별 상품 바로구매 데이터 가져오기
   */
  const fetchProductPurchaseData = async (productId) => {
    try {
      // 상품 상세 정보 가져오기
      const productResponse = await axios.post(`http://localhost:8080/FAF/api/productdetail`, {
        product_id: parseInt(productId)
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (productResponse.data && productResponse.data.productDetail) {
        const product = productResponse.data.productDetail;
        // 개별 상품을 배열로 변환 (수량 1로 설정)
        setPurchaseItems([{
          ...product,
          quantity: 1
        }]);
      }

      // 사용자 정보 가져오기
      await fetchUserInfo();
    } catch (error) {
      console.error('상품 구매 데이터 가져오기 오류:', error);
      throw error;
    }
  };

  /**
   * 사용자 정보 가져오기
   */
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/FAF/api/session-check', {
        withCredentials: true
      });

      if (response.data.success) {
        setUserInfo({
          nickname: response.data.nickname,
          userType: response.data.userType,
          point: response.data.point || 0
        });
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  /**
   * 뒤로가기 함수
   */
  const goBack = () => {
    if (purchaseType === 'cart') {
      navigate('/cart');
    } else {
      navigate('/market');
    }
  };

  /**
   * 총 결제 금액 계산
   */
  const getTotalPrice = () => {
    return purchaseItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  /**
   * 총 상품 수량 계산
   */
  const getTotalQuantity = () => {
    return purchaseItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };



  /**
   * 결제 가능 여부 확인
   */
  const canPurchase = () => {
    const userPoint = userInfo?.point || 0;
    const totalPrice = getTotalPrice();
    return userPoint >= totalPrice;
  };

  /**
   * 결제 처리 함수
   */
  const handlePurchase = async () => {
    // 결제 완료 페이지로 바로 이동 (총 결제금액만 전달)
    navigate(`/purchase-complete?totalAmount=${getTotalPrice()}&purchaseType=${purchaseType}&purchaseId=${purchaseId}`);
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="page-layout page-layout-relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
              결제 정보를 불러오는 중...
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
              onClick={goBack}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              돌아가기
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
        <div className="absolute top-20 right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
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

        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <FaCreditCard className="text-4xl text-green-400 mr-4" />
            <FaShieldAlt className="text-4xl text-blue-400" />
          </div>
          <h1 
            className="text-5xl md:text-7xl font-bold mb-8 gradient-text"
            style={{ 
              lineHeight: '1.2',
              paddingTop: '0.2em',
              paddingBottom: '0.2em'
            }}
          >
            Secure Purchase
          </h1>
          <p 
            className="text-xl md:text-2xl max-w-4xl mx-auto mt-6" 
            style={{ 
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}
          >
            안전하고 빠른 결제로 학습을 시작하세요
          </p>
        </motion.div>

        {/* 결제 정보 섹션 */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 상품 목록 */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                구매 상품 ({purchaseItems.length}개)
              </h2>
              
              <div className="space-y-4">
                {purchaseItems.map((item, index) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 glass-effect rounded-xl"
                  >
                    {/* 상품 이미지 */}
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {hasBookCoverImage(item) ? (
                        <img
                          src={getBookCoverImage(item)}
                          alt={getBookCoverAltText(item)}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 items-center justify-center ${
                          hasBookCoverImage(item) ? 'hidden' : 'flex'
                        }`}
                        style={getBookCoverFallbackStyle(item.languages)}
                      >
                        <FaShoppingCart className="text-xl opacity-50" />
                      </div>
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {item.product_title}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                        {item.stitle}
                      </p>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                        {item.writer} 저 | {item.publisher}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          수량: {item.quantity}개
                        </span>
                        <span className="text-lg font-bold gradient-text">
                          {(item.price * item.quantity).toLocaleString()}포인트
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 결제 요약 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="glass-effect rounded-3xl p-6 sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                결제 요약
              </h2>

              {/* 사용자 정보 */}
              <div className="glass-effect rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <FaUser className="text-blue-400" />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {userInfo?.nickname || '사용자'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaWallet className="text-green-400" />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    보유 포인트: <span className="font-bold text-green-400">{userInfo?.point?.toLocaleString() || 0}포인트</span>
                  </span>
                </div>
              </div>

              {/* 결제 정보 */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>상품 수량</span>
                  <span style={{ color: 'var(--text-primary)' }}>{getTotalQuantity()}개</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>배송비</span>
                  <span style={{ color: 'var(--text-primary)' }}>무료</span>
                </div>
                <div className="border-t pt-4 border-white/10">
                  <div className="flex justify-between text-lg font-bold">
                    <span style={{ color: 'var(--text-primary)' }}>총 결제금액</span>
                    <span className="gradient-text">{getTotalPrice().toLocaleString()}포인트</span>
                  </div>
                </div>
              </div>

              

              {/* 결제 버튼 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePurchase}
                disabled={!canPurchase()}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 text-lg ${
                  canPurchase()
                    ? 'btn-primary'
                    : 'opacity-50 cursor-not-allowed glass-effect'
                }`}
              >
                <FaCreditCard />
                <span>결제하기</span>
              </motion.button>

              {!canPurchase() && (
                <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                  포인트가 부족하여 결제할 수 없습니다
                </p>
              )}

              {/* 보안 정보 */}
              <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <FaShieldAlt className="text-green-400" />
                <span>SSL 보안 결제</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Purchase; 