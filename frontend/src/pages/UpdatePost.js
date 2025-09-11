import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/style.css';
import axios from 'axios';

function UpdatePost() {
  const navigate = useNavigate();
  const { post_id } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); // 'frontend' | 'backend' | ...
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [nickname, setNickname] = useState(null);
  const [authorNickname, setAuthorNickname] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'study', name: 'Study' },
    { id: 'interview', name: 'Interview' }
  ];

  const categoryIdMap = {
    'frontend': 1,
    'backend': 2,
    'data-science': 3,
    'study': 4,
    'interview': 5
  };
  const categoryKeyById = {
    1: 'frontend',
    2: 'backend',
    3: 'data-science',
    4: 'study',
    5: 'interview'
  };

  useEffect(() => {
    let ignore = false;
    async function bootstrap() {
      try {
        // 세션 확인
        const sessionRes = await axios.get('http://localhost:8080/FAF/api/session-check', { withCredentials: true });
        if (!sessionRes?.data?.success) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
        }
        if (!ignore) setNickname(sessionRes.data.nickname || null);

        // 기존 게시글 로드
        const postRes = await axios.get(`http://localhost:8080/FAF/api/posts/${post_id}`, { withCredentials: true });
        const post = postRes?.data?.post;
        const author = postRes?.data?.nickname;
        if (!post) {
          alert('게시글을 불러오지 못했습니다.');
          navigate('/community');
          return;
        }
        // 작성자 체크
        if ((sessionRes?.data?.nickname || '') !== (author || '')) {
          alert('수정 권한이 없습니다.');
          navigate(`/post-detail/${post_id}`);
          return;
        }
        if (!ignore) {
          setAuthorNickname(author || null);
          setTitle(post.title || '');
          setContent(post.content || '');
          setCategory(categoryKeyById[post.category_id] || '');
        }
      } catch (e) {
        console.error('수정 페이지 초기화 실패:', e);
        alert('수정 페이지를 불러오는 중 오류가 발생했습니다.');
        navigate('/community');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    bootstrap();
    return () => { ignore = true; };
  }, [post_id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category_id = categoryIdMap[category] ?? null;
    if (!category_id) {
      alert('카테고리를 선택하세요.');
      return;
    }
    try {
      const payload = {
        post_id: Number(post_id),
        category_id,
        title: title.trim(),
        content: content.trim()
      };
      const res = await axios.post('http://localhost:8080/FAF/api/post/update', payload, { withCredentials: true });
      const isSuccess = res?.data?.success === true || res?.data?.success === 'true';
      if (!isSuccess) {
        alert('게시글 수정에 실패했습니다.');
        return;
      }
      navigate(`/post-detail/${post_id}`);
    } catch (err) {
      console.error('게시글 수정 오류:', err);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="page-layout">
        <div className="max-w-4xl mx-auto px-4 py-16" style={{ color: 'var(--text-secondary)' }}>
          수정 페이지를 불러오는 중...
        </div>
      </div>
    );
  }

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
            <h1 className="gradient-text text-3xl font-bold mb-8 text-center">글 수정</h1>

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

              {/* 버튼 그룹 */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/post-detail/${post_id}`)}
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
                  수정완료
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default UpdatePost;

