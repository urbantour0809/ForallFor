/**
 * PurchaseComplete 컴포넌트 (결제 완료 페이지)
 *
 * 결제가 완료된 후 표시되는 완료 페이지입니다.
 * URL 파라미터로 총 결제금액을 받아서 표시하고, 백엔드에 결제 결과를 전송합니다.
 *
 * 주요 기능:
 * - 결제 완료 메시지 표시
 * - 총 결제금액 표시
 * - 결제 상세 정보 표시
 * - 백엔드에 결제 결과 전송
 * - 마이페이지/홈으로 이동 버튼
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaHome,
  FaUser,
  FaCreditCard,
  FaGift,
  FaShieldAlt,
  FaArrowRight,
  FaReceipt,
  FaStar,
  FaWallet,
  FaCalculator
} from 'react-icons/fa';
import '../styles/style.css';
import axios from 'axios';

function PurchaseComplete() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 결제 완료 데이터 상태
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseResult, setPurchaseResult] = useState(null);

  // 컴포넌트 마운트 시 결제 완료 데이터 처리
  useEffect(() => {
    const processPurchaseComplete = async () => {
      const totalAmount = searchParams.get('totalAmount');
      const purchaseType = searchParams.get('purchaseType');
      const purchaseId = searchParams.get('purchaseId');

      if (!totalAmount) {
        setError('결제 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 결제 완료 데이터 설정
        setPurchaseData({
          totalAmount: parseInt(totalAmount),
          purchaseType: purchaseType || 'unknown',
          purchaseId: purchaseId || 'unknown',
          purchaseDate: new Date().toLocaleString('ko-KR'),
          orderNumber: generateOrderNumber()
        });

        // 백엔드에 결제 결과 전송
        await sendPurchaseResult({
          totalAmount: parseInt(totalAmount),
          purchaseType: purchaseType || 'unknown',
          purchaseId: purchaseId || 'unknown',
          orderNumber: generateOrderNumber()
        });

      } catch (error) {
        console.error('결제 완료 처리 오류:', error);
        setError('결제 완료 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    processPurchaseComplete();
  }, [searchParams]);

  /**
   * 주문번호 생성 함수
   */
  const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORDER-${year}${month}${day}-${random}`;
  };

  /**
   * 백엔드에 결제 결과 전송 (포인트 차감은 백엔드에서 처리)
   */
  const sendPurchaseResult = async (purchaseData) => {
    try {
      const response = await axios.get('http://localhost:8080/FAF/api/purchase/result', {
        params: {
          totalAmount: purchaseData.totalAmount,
          purchaseType: purchaseData.purchaseType,
          purchaseId: purchaseData.purchaseId
        },
        withCredentials: true
      });

      const data = response.data;
      console.log('결제 결과 전송 응답:', data);

      if (data && data.success) {
        setPurchaseResult({
          success: true,
          message: data.message || '결제가 성공적으로 완료되었습니다.',
          orderNumber: purchaseData.orderNumber,
          userPoint: data.userPoint || 0
        });
      } else {
        setPurchaseResult({
          success: false,
          message: data.message || '결제 처리 중 오류가 발생했습니다.'
        });
      }
    } catch (error) {
      console.error('결제 결과 전송 오류:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setPurchaseResult({
          success: false,
          message: error.response.data.message
        });
      } else {
        setPurchaseResult({
          success: false,
          message: '결제 처리 중 오류가 발생했습니다.'
        });
      }
    }
  };

  /**
   * 홈으로 이동 함수
   */
  const goHome = () => {
    navigate('/');
  };

  /**
   * 마이페이지로 이동 함수
   */
  const goToMyPage = () => {
    navigate('/mypage');
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="page-layout page-layout-relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
              결제 완료 처리 중...
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
              onClick={goHome}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              홈으로 가기
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* 성공 아이콘 및 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-32 h-32 bg-green-500/20 rounded-full mb-8"
          >
            <FaCheckCircle className="text-8xl text-green-400" />
          </motion.div>
          
          <h1 
            className="text-5xl md:text-7xl font-bold mb-8 gradient-text"
            style={{ 
              lineHeight: '1.2',
              paddingTop: '0.2em',
              paddingBottom: '0.2em'
            }}
          >
            결제 완료!
          </h1>
          
          <p 
            className="text-xl md:text-2xl max-w-3xl mx-auto mt-6" 
            style={{ 
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}
          >
            {purchaseResult?.success 
              ? '구매가 성공적으로 완료되었습니다.'
              : purchaseResult?.message || '결제 처리 중 오류가 발생했습니다.'
            }
          </p>
        </motion.div>

        {/* 결제 상세 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            결제 상세 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 주문 정보 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaReceipt className="text-blue-400" />
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  주문번호
                </span>
              </div>
              <p className="text-lg font-mono" style={{ color: 'var(--text-secondary)' }}>
                {purchaseData?.orderNumber}
              </p>
              
              <div className="flex items-center space-x-3">
                <FaCreditCard className="text-green-400" />
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  결제 금액
                </span>
              </div>
              <p className="text-2xl font-bold gradient-text">
                {purchaseData?.totalAmount?.toLocaleString()}포인트
              </p>
            </div>

            {/* 결제 정보 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaGift className="text-purple-400" />
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  결제 유형
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                {purchaseData?.purchaseType === 'cart' ? '장바구니 구매' : '바로구매'}
              </p>
              
                             <div className="flex items-center space-x-3">
                 <FaWallet className="text-green-400" />
                 <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                   잔여 포인트
                 </span>
               </div>
               <p className="text-2xl font-bold gradient-text">
                 {purchaseResult?.userPoint?.toLocaleString() || 0}포인트
               </p>

            </div>
          </div>

          {/* 결제 시간 */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center space-x-3">
              <FaStar className="text-yellow-400" />
              <span style={{ color: 'var(--text-secondary)' }}>
                결제 시간: {purchaseData?.purchaseDate}
              </span>
            </div>
          </div>
        </motion.div>



        {/* 액션 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goHome}
            className="flex-1 btn-secondary py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 text-lg"
          >
            <FaHome />
            <span>홈으로 가기</span>
          </motion.button>
          

        </motion.div>

        {/* 추가 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center"
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            문의사항이 있으시면 고객센터로 연락해주세요.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default PurchaseComplete; 