import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

function ProductRegister() {
  const navigate = useNavigate();
  
  // 상품 정보 상태
  const [productData, setProductData] = useState({
    product_title: '',
    stitle: '',
    writer: '',
    publisher: '',
    content: '',
    page: '',
    price: '',
    languages: '',
    product_image: '' // 사용자가 직접 입력
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 상품 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 데이터 타입 변환
      const submitData = {
        ...productData,
        page: parseInt(productData.page) || 0,
        price: parseInt(productData.price) || 0
      };

      console.log('상품 등록 데이터:', submitData);
      console.log('API 호출 URL:', 'http://localhost:8080/FAF/api/product/register');
      
      const response = await fetch('http://localhost:8080/FAF/api/product/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);
      console.log('응답 URL:', response.url);

      // 응답 텍스트를 먼저 확인
      const responseText = await response.text();
      console.log('응답 텍스트:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('파싱된 응답 데이터:', result);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.error('응답이 JSON이 아닙니다. 응답 내용:', responseText);
        alert('서버에서 잘못된 응답을 받았습니다. 백엔드 서버를 확인해주세요.');
        return;
      }
      
      if (result.success) {
        alert(result.message || '상품이 성공적으로 등록되었습니다!');
        navigate('/mypage-admin');
      } else {
        alert(result.message || '상품 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 등록 실패:', error);
      console.error('에러 상세:', error.message);
      alert('상품 등록 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-layout">
      {/* 배경 효과 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-2xl overflow-hidden"
        >
          <div className="p-8">
            {/* 헤더 */}
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/mypage-admin')}
                className="flex items-center gap-2 text-sm hover:text-purple-300 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <FaArrowLeft />
                <span>관리자 페이지로 돌아가기</span>
              </button>
            </div>

            <h1 className="gradient-text text-3xl font-bold mb-8 text-center">상품 등록</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    상품명 *
                  </label>
                  <input
                    type="text"
                    name="product_title"
                    value={productData.product_title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ color: 'var(--text-primary)' }}
                    placeholder="상품명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    부제목 *
                  </label>
                  <input
                    type="text"
                    name="stitle"
                    value={productData.stitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ color: 'var(--text-primary)' }}
                    placeholder="부제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    저자 *
                  </label>
                  <input
                    type="text"
                    name="writer"
                    value={productData.writer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ color: 'var(--text-primary)' }}
                    placeholder="저자를 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    출판사 *
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={productData.publisher}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ color: 'var(--text-primary)' }}
                    placeholder="출판사를 입력하세요"
                  />
                </div>

                                 <div>
                   <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                     가격 *
                   </label>
                   <input
                     type="number"
                     name="price"
                     value={productData.price}
                     onChange={handleInputChange}
                     required
                     className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                     style={{ color: 'var(--text-primary)' }}
                     placeholder="가격을 입력하세요"
                   />
                 </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    페이지 수 *
                  </label>
                  <input
                    type="number"
                    name="page"
                    value={productData.page}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ color: 'var(--text-primary)' }}
                    placeholder="페이지 수를 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    책 언어 *
                  </label>
                  <select
                    name="languages"
                    value={productData.languages}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="">언어를 선택하세요</option>
                    <option value="KOREAN">KOREAN</option>
                    <option value="ENGLISH">ENGLISH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    상품 이미지 파일명 *
                  </label>
                  <input
                    type="text"
                    name="product_image"
                    value={productData.product_image}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ color: 'var(--text-primary)' }}
                    placeholder="이미지 파일명을 입력하세요"
                  />
                </div>
              </div>

              {/* 상품 내용 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  상품 내용 *
                </label>
                <textarea
                  name="content"
                  value={productData.content}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="상품에 대한 상세한 설명을 입력하세요"
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/mypage-admin')}
                  className="px-6 py-3 rounded-xl glass-effect hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <FaSave />
                  {isSubmitting ? '등록 중...' : '상품 등록'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductRegister; 