/**
 * Cart 컴포넌트 (장바구니 페이지)
 * 
 * 사용자가 선택한 상품들을 관리하는 장바구니 페이지입니다.
 * 상품 목록, 수량 조정, 삭제, 총 가격 계산 등의 기능을 제공합니다.
 * 
 * 주요 기능:
 * - 장바구니 상품 목록 표시
 * - 수량 증가/감소 기능
 * - 개별 상품 삭제 기능
 * - 전체 선택/해제 기능
 * - 총 가격 계산 및 표시
 * - 주문하기 기능
 * - 빈 장바구니 상태 처리
 */
import {
  getBookCoverImage,
  getBookCoverAltText,
  hasBookCoverImage,
  getBookCoverFallbackStyle
} from '../utils/imageUtils';
import { useEffect } from 'react';
import axios from 'axios';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrash, 
  FaArrowLeft,
  FaShoppingCart,
  FaCreditCard,
  FaCheck,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import '../styles/style.css';

function Cart() {
  const navigate = useNavigate();
  
  // 장바구니 상품 데이터 (하드코딩, 나중에 API로 대체)
  const [cartItems, setCartItems] = useState([]);

  // 선택된 상품들 관리
  const [selectedItems, setSelectedItems] = useState(new Set());

  /**
   * 뒤로가기 함수
   */
  const goBack = () => {
    navigate('/market');
  };

  /**
   * 수량 증가 함수
   */
  const increaseQuantity = (productId) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.product_id === productId) {
          const newQuantity = item.quantity + 1;
          updateQuantityOnServer(productId, newQuantity); // ✅ 정확한 수량으로 서버 업데이트
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updated;
    });
  };

  /**
   * 수량 감소 함수
   */
  const decreaseQuantity = (productId) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.product_id === productId) {
          const newQuantity = Math.max(item.quantity - 1, 1); // 1 이하로 안 내려가게
          updateQuantityOnServer(productId, newQuantity); // ✅ 계산된 수량으로 서버 업데이트
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updated;
    });
  };





  /**
   * 상품 삭제 함수
   */
  const removeItem = async (productId) => {
    try {
      // UI 업데이트 먼저
      setCartItems(prev => prev.filter(item => item.product_id !== productId));
      setSelectedItems(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(productId);
        return newSelected;
      });

      // 서버에 삭제 요청
      await axios.post('http://localhost:8080/FAF/api/cart/remove', {
        product_id: productId
      }, {
        withCredentials: true
      });

      console.log("서버에서 상품 삭제 완료");

    } catch (error) {
      console.error("서버 상품 삭제 실패:", error);
    }
  };

  /**
   * 개별 상품 선택/해제 함수
   */
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  /**
   * 전체 선택/해제 함수
   */
  const toggleAllSelection = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.product_id)));
    }
  };

  /**
   * 선택된 상품들의 총 가격 계산
   */
  const getTotalPrice = () => {
    return cartItems
      .filter(item => selectedItems.has(item.product_id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  /**
   * 선택된 상품들의 총 수량 계산
   */
  const getTotalQuantity = () => {
    return cartItems
      .filter(item => selectedItems.has(item.product_id))
      .reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * 주문하기 함수
   */
  const handleOrder = async () => {
    const selectedItemsList = cartItems.filter(item => selectedItems.has(item.product_id));
    console.log('주문할 상품들:', selectedItemsList);
    console.log('총 가격:', getTotalPrice());
    
    // 선택된 상품이 있는 경우에만 결제 페이지로 이동
    if (selectedItemsList.length > 0) {
          // 결제 페이지로 이동
          navigate('/purchase?cart_id=all');
    } else {
      alert('주문할 상품을 선택해주세요.');
    }
  };

  /**
   * 빈 장바구니 컴포넌트
   */
  const EmptyCart = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="text-6xl mb-6 opacity-50" style={{ color: 'var(--text-secondary)' }}>
        <FaShoppingCart />
      </div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        장바구니가 비어있습니다
      </h2>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
        마켓에서 원하는 상품을 선택해보세요
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={goBack}
        className="btn-primary px-8 py-3 rounded-xl font-semibold"
      >
        마켓으로 가기
      </motion.button>
    </motion.div>
  );
/*
 장바구니 가져오기
*/
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/FAF/api/cart/productsList', {
          withCredentials: true
        });

        console.log('장바구니 목록 응답:', response.data);

        const raw = response.data;
        const items = Array.isArray(raw.data) ? raw.data : [];

        // 👉 중복 product_id 통합
        const mergedItemsMap = new Map();

        items.forEach(item => {
          const existing = mergedItemsMap.get(item.product_id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            mergedItemsMap.set(item.product_id, { ...item });
          }
        });

        const mergedItems = Array.from(mergedItemsMap.values());

        setCartItems(mergedItems);
        setSelectedItems(new Set(mergedItems.map(item => item.product_id)));

      } catch (error) {
        console.error('장바구니 항목 조회 실패:', error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);
/* 수량 업데이트 */
  const updateQuantityOnServer = async (productId, quantity) => {
    try {
      await axios.post('http://localhost:8080/FAF/api/cart/update', {
        product_id: productId,
        quantity: quantity
      }, {
        withCredentials: true
      });
      console.log("서버 수량 업데이트 성공");
    } catch (error) {
      console.error("서버 수량 업데이트 실패:", error);
    }
  };





  return (
        <div className="page-layout page-layout-relative">
      {/* 배경 효과 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
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
          <h1 
            className="text-5xl md:text-7xl font-bold mb-8 gradient-text"
            style={{ 
              lineHeight: '1.2',
              paddingTop: '0.2em',
              paddingBottom: '0.2em'
            }}
          >
            Shopping Cart
          </h1>
          <p 
            className="text-xl md:text-2xl max-w-3xl mx-auto mt-6" 
            style={{ 
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}
          >
            선택한 상품들을 확인하고 주문해보세요.
          </p>
        </motion.div>

        {/* 장바구니가 비어있는 경우 */}
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* 전체 선택 및 상품 목록 */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 상품 목록 */}
              <div className="lg:col-span-2 space-y-4">
                {/* 전체 선택 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleAllSelection}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedItems.size === cartItems.length
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-400'
                      }`}
                    >
                      {selectedItems.size === cartItems.length && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </motion.button>
                    <span className="font-semibold">전체 선택</span>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {selectedItems.size} / {cartItems.length} 선택됨
                  </span>
                </motion.div>

                {/* 상품 카드들 */}
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-effect rounded-2xl p-6"
                  >
                    <div className="flex items-start space-x-4">
                      {/* 선택 체크박스 */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleItemSelection(item.product_id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-2 ${
                          selectedItems.has(item.product_id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedItems.has(item.product_id) && (
                          <FaCheck className="text-white text-xs" />
                        )}
                      </motion.button>


                      {/* 상품 이미지 */}
                      <div className="cart-item-image w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 relative">
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
                          <FaShoppingCart className="text-3xl opacity-50" />
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
                        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                          {item.writer} 저 | {item.publisher}
                        </p>

                        {/* 수량 조절 */}
                        <div className="flex items-center space-x-3">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>수량:</span>
                          <div className="flex items-center glass-effect rounded-lg">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => decreaseQuantity(item.product_id)}
                              className="p-2 hover:bg-white/10 rounded-l-lg transition-colors"
                            >
                              <FaMinus className="text-xs" />
                            </motion.button>
                            <span className="px-4 py-2 text-sm font-semibold">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => increaseQuantity(item.product_id)}
                              className="p-2 hover:bg-white/10 rounded-r-lg transition-colors"
                            >
                              <FaPlus className="text-xs" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* 가격 + 삭제 버튼 */}
                      <div className="flex flex-col items-end flex-shrink-0 min-w-[90px]">
                        <div className="text-xl font-bold gradient-text">
                          {(item.price * item.quantity).toLocaleString()}포인트
                        </div>
                        <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {item.price.toLocaleString()}포인트 × {item.quantity}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.product_id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-2"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 주문 요약 */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="glass-effect rounded-3xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    주문 요약
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>선택된 상품</span>
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

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOrder}
                    disabled={selectedItems.size === 0}
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 text-lg ${
                      selectedItems.size === 0
                        ? 'opacity-50 cursor-not-allowed glass-effect'
                        : 'btn-primary'
                    }`}
                  >
                    <FaCreditCard />
                    <span>주문하기</span>
                  </motion.button>

                  {selectedItems.size === 0 && (
                    <p className="text-sm text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
                      주문할 상품을 선택해주세요
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart; 