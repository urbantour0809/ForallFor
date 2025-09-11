import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/style.css';
import axios from 'axios';

function WritePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [nickname, setNickname] = useState(null);

  useEffect(() => {
    let ignore = false;
    axios
        .get('http://localhost:8080/FAF/api/session-check', { withCredentials: true })
        .then(res => {
          if (!ignore && res?.data?.success) {
            setNickname(res.data.nickname || null);
          }
        })
        .catch(() => {
          if (!ignore) setNickname(null);
        });
    return () => { ignore = true; };
  }, []);

  const categories = [
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'study', name: 'Study' },
    { id: 'interview', name: 'Interview' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 카테고리 문자열 → category_id 매핑
    const categoryIdMap = {
      'frontend': 1,
      'backend': 2,
      'data-science': 3,
      'study': 4,
      'interview': 5
    };

    const category_id = categoryIdMap[category] ?? null;
    if (!category_id) {
      alert('카테고리를 선택하세요.');
      return;
    }

    try {
      const payload = {
        category_id,
        title: title.trim(),
        content: content.trim()
      };

      const res = await axios.post(
          'http://localhost:8080/FAF/api/post/insert',
          payload,
          { withCredentials: true }
      );

      // 백엔드가 success만 반환하는 형태에 맞춰 처리
      const isSuccess = res?.data?.success === true || res?.data?.success === 'true';
      if (isSuccess) {
        navigate('/community');
      } else {
        alert('게시글 작성에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 작성 오류:', err);
      alert('회원이 아닙니다. 로그인 해주세요');
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
              <h1 className="gradient-text text-3xl font-bold mb-8 text-center">새 글 작성</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 회원 ID 표시 */}
                <div className="flex justify-end mb-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  회원ID : <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{nickname || '익명'}</span>
                </span>
                </div>

                {/* 카테고리 선택 */}
                <div className="relative">
                  <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-3 rounded-xl glass-effect flex items-center justify-between"
                      style={{ color: 'var(--text-primary)' }}
                  >
                    <span>{category ? categories.find(c => c.id === category)?.name : '카테고리 선택'}</span>
                    <motion.span
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown />
                    </motion.span>
                  </button>

                  {isDropdownOpen && (
                      <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-10 shadow-lg"
                          style={{ backgroundColor: 'var(--bg-primary)' }}
                      >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setCategory(cat.id);
                                  setIsDropdownOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-gray-700/20 last:border-0"
                                style={{ color: 'var(--text-primary)' }}
                            >
                              {cat.name}
                            </button>
                        ))}
                      </motion.div>
                  )}
                </div>

                {/* 제목 입력 */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full px-4 py-3 rounded-xl glass-effect"
                    style={{ color: 'var(--text-primary)' }}
                    required
                />

                {/* 내용 입력 */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                    className="w-full h-96 px-4 py-3 rounded-xl glass-effect resize-none"
                    style={{ color: 'var(--text-primary)' }}
                    required
                />

                {/* 댓글 허용 설정 제거 */}

                {/* 버튼 그룹 */}
                <div className="flex justify-end gap-4">
                  <button
                      type="button"
                      onClick={() => navigate('/community')}
                      className="px-6 py-3 rounded-xl glass-effect"
                      style={{ color: 'var(--text-secondary)' }}
                  >
                    취소
                  </button>
                  <button
                      type="submit"
                      className="btn-primary px-6 py-3 rounded-xl"
                      disabled={!category || !title.trim() || !content.trim()}
                  >
                    작성완료
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
  );
}

export default WritePost; 