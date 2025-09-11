/**
 * Community 컴포넌트 (커뮤니티 페이지)
 *
 * 사용자들이 서로 소통하고 정보를 공유할 수 있는 커뮤니티 페이지입니다.
 * 게시글 작성, 조회, 댓글, 좋아요 등의 기능을 제공합니다.
 *
 * 주요 기능:
 * - 게시글 목록 표시 및 필터링
 * - 카테고리별 분류 (Frontend, Backend, Data Science, Study, Interview)
 * - 게시글 상호작용 (좋아요, 댓글, 조회수)
 * - 게시글 작성 모달
 * - 반응형 그리드 레이아웃
 * - 검색 및 정렬 기능
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUsers, FaComments, FaThumbsUp, FaEye, FaCalendar, FaTag, FaEdit, FaSearch } from 'react-icons/fa';
import '../styles/style.css';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ko as koDateFns } from "date-fns/locale";
registerLocale('ko', koDateFns);

function Community() {
  const navigate = useNavigate();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / size);
  const [commentCounts, setCommentCounts] = useState({});
  const [selectedDate, setSelectedDate] = useState(null); // 캘린더에서 고른 날짜
  const [postsOnDate, setPostsOnDate] = useState([]);     // 해당 날짜의 게시글 목록

  /**
   * 커뮤니티 게시글 데이터 배열
   * 실제 서비스에서는 API를 통해 동적으로 가져올 데이터
   */
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);


  const fetchPostsByDate = async (dateObj) => {
    if (!dateObj) return;
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const ymd = `${y}-${m}-${d}`;
    try {
      const { data } = await axios.get(
          'http://localhost:8080/FAF/api/post/by-date',
          { params: { date: ymd }, withCredentials: true }
      );


      const merged = Array.isArray(data?.posts)
          ? data.posts.map((p, i) => ({
            post: p,
            nickname: data?.nicknames?.[i] ?? ''
          }))
          : [];

      setPostsOnDate(merged);

    } catch (e) {
      console.error('날짜별 게시글 불러오기 실패:', e);
      setPostsOnDate([]);
    }
  };

  const displayPosts = selectedDate ? postsOnDate : posts;

  const filteredPosts = displayPosts.filter(({ post }) => {
    const categoryMatch =
        selectedCategory === 'all' ||
        post.category_id === Number(selectedCategory);

    const searchMatch =
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags || []).some(tag =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return categoryMatch && searchMatch;
  });

  useEffect(() => {
    if (!Array.isArray(displayPosts) || displayPosts.length === 0) return;

    const fetchCommentCounts = async () => {
      const counts = {};
      await Promise.all(
          displayPosts.map(async ({ post }) => {
            try {
              const res = await axios.get(
                  'http://localhost:8080/FAF/api/comment/count',
                  { params: { post_id: post.post_id }, withCredentials: true }
              );
              counts[post.post_id] = res.data.count;
            } catch (err) {
              console.error(`댓글 수 로드 실패 post_id=${post.post_id}:`, err);
              counts[post.post_id] = 0;
            }
          })
      );
      setCommentCounts(counts);
    };

    fetchCommentCounts();
  }, [displayPosts]);



  /* categoryColor 조건부 매핑 */
  const categoryColorMap = {
    1: 'bg-blue-500',
    2: 'bg-green-500',
    3: 'bg-purple-500',
    4: 'bg-yellow-500',
    5: 'bg-red-500',
  };
  // Community.js 상단에 함수 추가
  const getAvatarByCategory = (category_id) => {
    switch (category_id) {
      case 1:
        return '🎨'; // Frontend
      case 2:
        return '🧠'; // Backend
      case 3:
        return '🌐'; // Data Science
      case 4:
        return '✏️'; // Study
      case 5:
        return '🗣️'; // Interview
      default:
        return '🙂'; // Default avatar
    }
  };

  const getCategoryNameById = (category_id) => {
    switch (category_id) {
      case 1:
        return 'Frontend';
      case 2:
        return 'Backend';
      case 3:
        return 'Data Science';
      case 4:
        return 'Study';
      case 5:
        return 'Interview';
      default:
        return 'Unknown';
    }
  };



  const getCategoryStyle = (categoryId) => {
    return categoryColorMap[categoryId] || 'bg-gray-500';
  };


  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handlePostClick = (post_id) => {
    // 게시글 상세 페이지로 이동
    console.log('넘어오는 post_id:', post_id);
    navigate(`/post-detail/${post_id}`);
  };


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  useEffect(() => {
    axios.get(`http://localhost:8080/FAF/api/posts`, {
      params: {
        page,
        size,
        category: selectedCategory === 'all' ? null : selectedCategory,
        keyword: searchTerm || null
      },
      withCredentials: true
    })
        .then(response => {
          console.log('서버 응답:', response.data);

          if (response.data && Array.isArray(response.data.data)) {
            setPosts(response.data.data);
            setTotalCount(response.data.totalCount);
          } else {
            console.warn('응답 형식 이상함. data 필드 없음:', response.data);
            setPosts([]); // fallback 처리
            setTotalCount(0);
          }
        })

        .catch(error => {
          console.error('게시글 불러오기 오류:', error);
        });
  }, [page, size, selectedCategory, searchTerm]); // ✅ 의존성 배열

  /* 카테고리 불러오기 */
  useEffect(() => {
    axios.get('http://localhost:8080/FAF/api/post-categories', {
      withCredentials: true
    })
        .then(response => {
          console.log('카테고리 응답:', response.data);
          setCategories(response.data); // ✅ 여기!
        })
        .catch(error => {
          console.error('카테고리 불러오기 오류:', error);
        });
  }, []);




  console.log('posts:', posts);
  console.log('filteredPosts:', filteredPosts);
  if (filteredPosts.length > 0) {
    filteredPosts.forEach(({ post, nickname }, idx) => {
      console.log(`index: ${idx}, post_id: ${post.post_id}, title: ${post.title}`);
    });
  }
  return (
      <div className="page-layout page-layout-relative">
        {/* 배경 효과 */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">



          {/* 헤더 섹션 */}
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">
              Community
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              개발자들과 함께 성장하고 지식을 공유해보세요.
            </p>
          </motion.div>

          {/* 검색 및 필터 섹션 */}
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-12"
          >

            <div className="flex items-center justify-end mb-4 gap-2">
              <FaCalendar className="text-gray-400 text-sm" />
              <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      fetchPostsByDate(date);
                    } else {
                      setPostsOnDate([]);
                    }
                  }}
                  locale="ko"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  isClearable
                  placeholderText="날짜"
                  className="px-1 py-0.5 rounded-md glass-effect w-24 text-xs"
                  wrapperClassName="w-24"
                  popperClassName="z-50"
              />

            </div>


            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* 검색바 */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="게시글 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg glass-effect border border-transparent focus:border-blue-500 focus:outline-none"
                    style={{ color: 'var(--text-primary)' }}
                />
              </div>

              {/* 카테고리 필터 */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                    onClick={() => handleCategorySelect('all')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                        selectedCategory === 'all'
                            ? 'glass-effect border-2 border-blue-500'
                            : 'glass-effect border border-transparent'
                    }`}
                    style={{ color: 'var(--text-primary)' }}
                >
                  전체
                </motion.button>

                {Array.isArray(categories) && categories.map(category => (
                    <motion.button
                        key={category.category_id}
                        onClick={() => handleCategorySelect(category.category_id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                            selectedCategory === category.category_id
                                ? 'glass-effect border-2 border-blue-500'
                                : 'glass-effect border border-transparent'
                        }`}
                        style={{ color: 'var(--text-primary)', userSelect: 'none' }}

                    >
                      {category.name}
                    </motion.button>
                ))}


              </div>





              {/* 게시글 작성 버튼 */}
              <motion.button
                  onClick={() => navigate('/write-post')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg btn-primary flex items-center space-x-2"
              >
                <FaEdit />
                <span>글쓰기</span>
              </motion.button>
            </div>
          </motion.div>

          {/* 게시글 목록 */}
          <div className="grid gap-6">
            {filteredPosts.map(({ post, nickname }, index) => (
                <motion.div
                    key={post.post_id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{
                      y: -5,
                      scale: 1.01,
                      transition: { duration: 0.15 }
                    }}
                    onClick={() => handlePostClick(post.post_id)}
                    className="glass-effect rounded-3xl p-6 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getCategoryStyle(post.category_id)}`}
                          style={{ minWidth: '100px', textAlign: 'center' }}>
                      {getCategoryNameById(post.category_id)}
                    </span>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                    </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm mb-4"
                         style={{
                           color: 'var(--text-secondary)',
                           display: '-webkit-box',
                           WebkitBoxOrient: 'vertical',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           WebkitLineClamp: 1, // 1줄에서 자름
                           maxHeight: '3em', // 폰트크기에 맞춰서 세팅
                         }}
                      >
                        {post.content}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-2xl">{getAvatarByCategory(post.category_id)}</span>
                    </div>

                  </div>

                  {/* 태그들 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(post.tags) &&
                        post.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 text-xs font-semibold rounded-full text-white bg-indigo-500"
                            >
                          {tag}
                        </span>
                        ))}
                  </div>

                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FaEye />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaComments />
                        <span>{commentCounts[post.post_id] ?? 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{nickname}</span>
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>

          {/* 페이징 UI */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              이전
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${
                        page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  {i + 1}
                </button>
            ))}

            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
      </div>
  );
}

export default Community; 