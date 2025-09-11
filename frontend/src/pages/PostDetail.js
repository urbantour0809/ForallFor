import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaComments, FaEye, FaTag, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import '../styles/style.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import dayjs from 'dayjs';


function PostDetail() {
  const { post_id } = useParams();
  const [nickname, setNickname] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // 답글 다는 댓글의 ID
  const [newReply, setNewReply] = useState('');
  const [expandedComments, setExpandedComments] = useState(new Set()); // 펼쳐진 댓글 ID 관리
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const hasIncreasedView = useRef(false);
  const [currentUserId, setCurrentUserId] = useState(null);




  /* 댓글 + 대댓글 */
  const fetchCommentsAndReplies = async () => {
    try {
      const { data } = await axios.get(
          `http://localhost:8080/FAF/api/comment`,
          { params: { post_id }, withCredentials: true }
      );

      const commentsWithReplies = data.comments.map(c => ({
        ...c,
        replies: data.replies
            .filter(r => r.comment_id === c.comment_id)
            .map(r => ({
              ...r,
              nickname: data.nickByUserId[r.user_id]
            })),
        nickname: data.nickByUserId[c.user_id]
      }));
      console.log("⚙️ commentsWithReplies:", commentsWithReplies);
      setComments(commentsWithReplies);
      setCurrentUserId(data.currentUserId);
    } catch (err) {
      console.error("댓글+대댓글 불러오기 실패:", err);
    }
  };
  const handleDeleteComment = async (comment_id) => {
    try {
      const res = await axios.delete(
          `http://localhost:8080/FAF/api/${comment_id}`,
          { withCredentials: true }
      );
      if (res.data.status === "success") {
        await fetchCommentsAndReplies();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("댓글 삭제 오류:", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteReply = async (comment_id, reply_id) => {
    try {
      const res = await axios.delete(
          `http://localhost:8080/FAF/api/reply/${reply_id}`,
          { withCredentials: true }
      );
      if (res.data.status === "success") {
        await fetchCommentsAndReplies();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("대댓글 삭제 오류:", err);
      alert("대댓글 삭제 중 오류가 발생했습니다.");
    }
  };




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



  useEffect(() => {
    const viewedKey = `viewed_post_${String(post_id)}`;
    const viewedAt = sessionStorage.getItem(viewedKey);
    const THREE_MINUTES = 3 * 60 * 1000;
    const now = Date.now();
    fetchCommentsAndReplies();
    const fetchPost = () => {
      axios.get(`http://localhost:8080/FAF/api/posts/${post_id}`, {
        withCredentials: true,
      })
          .then(({ data }) => {
            setPost(data.post);
            setNickname(data.nickname);
          })
          .catch((err) => console.error("게시글 불러오기 오류:", err));
    };

    // 🚫 중복 실행 막기 위한 guard (선택)
    if (hasIncreasedView.current) return;
    hasIncreasedView.current = true;

    if (!viewedAt || now - Number(viewedAt) > THREE_MINUTES) {
      axios.post(`http://localhost:8080/FAF/api/posts/${post_id}/view`)
          .then(() => {
            sessionStorage.setItem(viewedKey, String(now));
            fetchPost(); // 조회수 증가 후 최신 데이터 fetch
          })
          .catch((err) => console.error("조회수 증가 실패:", err));
    } else {
      fetchPost();
    }
  }, [post_id]);



  // 현재 사용자 (백엔드 연동 전 임시)
  if (!post) {
    return (
        <div className="page-layout">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-effect rounded-2xl p-8 space-y-4 animate-pulse"
            >
              <div className="h-6 w-40 rounded bg-gray-200/40" />
              <div className="h-8 w-3/4 rounded bg-gray-200/40" />
              <div className="h-4 w-full rounded bg-gray-200/40" />
              <div className="h-4 w-5/6 rounded bg-gray-200/40" />
            </motion.div>
          </div>
        </div>
    );
  }


  const toggleReplies = (comment_id) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(comment_id)) {
        newSet.delete(comment_id);
      } else {
        newSet.add(comment_id);
      }
      return newSet;
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
          'http://localhost:8080/FAF/api/comment/insert',
          { post_id: Number(post_id), content: newComment }, // ← user_id 제거, 인라인
          { withCredentials: true }
      );
      if (res.data.status === 'success') {
        await fetchCommentsAndReplies();
        setNewComment('');

      } else {
        alert('로그인이 필요합니다.');
      }
    } catch (error) {
      console.error('댓글 등록 에러:', error);
      alert('댓글 등록 중 오류 발생!');
    }
  };


  // 컴포넌트 최상단(useState 아래)에 선언
  const handleReplySubmit = async (comment_id) => {
    if (!newReply.trim()) return;

    try {
      // 1) 백엔드에 대댓글 저장 요청
      const res = await axios.post(
          'http://localhost:8080/FAF/api/comment/insertReply',
          { comment_id, content: newReply },
          { withCredentials: true }
      );
      if (res.data.status !== 'success') {
        alert('회원이 아닙니다. 로그인 해주세요');
        return;
      }

      // 2) 저장 성공 시 전체 댓글+대댓글 다시 불러오기
      await fetchCommentsAndReplies();
    } catch (err) {
      console.error('대댓글 저장 오류:', err);
      alert('대댓글 등록 중 오류가 발생했습니다.');
    } finally {
      // 3) 입력창 닫고 초기화
      setNewReply('');
      setReplyingTo(null);
    }
  };

  function formatDate(millis) {
    if (!millis) return '';
    return dayjs(millis).format('YYYY-MM-DD HH:mm:ss');
  }


  return (
      <div className="page-layout">
        {/* 배경 효과 */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {/* 게시글 카드 */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-effect rounded-2xl overflow-hidden mb-8"
          >
            {/* 게시글 헤더 */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <motion.button
                    onClick={() => navigate('/community')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-2xl hover:text-blue-400 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                >
                  <FaArrowLeft className="hover:-translate-x-1 transition-transform" />
                  <span className="text-lg">뒤로가기</span>
                </motion.button>


              </div>

              <div className="flex items-start gap-4">
                <div className="text-4xl">{post.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getAvatarByCategory(post.category_id)}</span>
                    <h1 className="gradient-text text-2xl font-bold">
                      {post.title}
                    </h1>
                  </div>
                  {/* nickname은 한 줄, 아래 정보들은 한 줄 아래에 */}
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-base">{nickname}</span>
                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                    <FaEye />
                        {post.views}
                    </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                    <FaComments />
                        {comments.length}
                    </span>
                    </div>
                  </div>
                </div>
              </div>


              <div className="flex flex-wrap gap-2 mt-4">
                {(post.tags || []).map((tag, idx) => (
                    <span
                        key={idx}
                        className="glass-effect px-3 py-1 rounded-full text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                  <FaTag className="inline-block mr-1 text-xs" />
                      {tag}
                </span>
                ))}
              </div>
            </div>

            {/* 게시글 본문 */}
            <div className="p-8">
              <div
                  className="whitespace-pre-wrap"
                  style={{ color: 'var(--text-secondary)' }}
              >
                {post.content}
              </div>
            </div>
          </motion.div>

          {/* 댓글 섹션 */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-effect rounded-2xl p-8"
          >
            <h2 className="gradient-text text-xl font-bold mb-6">
              댓글 {comments.length}개
            </h2>

            {/* 댓글 목록 */}
            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                  <div key={comment.comment_id}>
                    <div className="glass-effect rounded-xl p-4 mb-2">
                      <div className="flex items-start gap-3">
                        <div className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {comment.nickname}
                          </span>
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                          </span>
                            </div>
                            {comment.user_id === currentUserId  && (
                                <button
                                    onClick={() => handleDeleteComment(comment.comment_id)}
                                    className="text-sm text-red-400 hover:text-red-500 transition-colors"
                                >
                                  삭제
                                </button>
                            )}
                          </div>
                          <p style={{ color: 'var(--text-secondary)' }} className="mb-3">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <button
                                onClick={() => setReplyingTo(replyingTo === comment.comment_id ? null : comment.comment_id)}
                                className="text-sm hover:text-blue-400 transition-colors"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                              답글 달기
                            </button>
                            {comment.replies?.length > 0 && (
                                <button
                                    onClick={() => toggleReplies(comment.comment_id)}
                                    className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                  <span>답글 {comment.replies.length}개</span>
                                  <motion.span
                                      animate={{ rotate: expandedComments.has(comment.comment_id) ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                  >
                                    ▼
                                  </motion.span>
                                </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 대댓글 입력 폼 */}
                      {replyingTo === comment.comment_id && (
                          <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleReplySubmit(comment.comment_id);
                              }}
                              className="mt-3 ml-8"
                          >
                            <div className="flex gap-4">
                              <input
                                  type="text"
                                  value={newReply}
                                  onChange={(e) => setNewReply(e.target.value)}
                                  placeholder="답글을 입력하세요"
                                  className="flex-1 px-4 py-2 rounded-xl glass-effect text-sm"
                                  style={{ color: 'var(--text-primary)' }}
                              />
                              <button
                                  type="submit"
                                  className="btn-primary px-4 py-2 rounded-xl text-sm font-medium"
                                  disabled={!newReply.trim()}
                              >
                                답글 작성
                              </button>
                            </div>
                          </form>

                      )}
                    </div>

                    {/* 대댓글 목록 */}
                    {comment.replies?.length > 0 && expandedComments.has(comment.comment_id) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-8 space-y-2"
                        >
                          {comment.replies.map((reply) => (

                              <div
                                  key={reply.reply_id}
                                  className="glass-effect rounded-xl p-4 relative"
                                  style={{
                                    borderLeft: '2px solid var(--gradient-start)',
                                    backgroundColor: 'rgba(var(--card-rgb), 0.5)'
                                  }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                                    {reply.avatar}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {reply.nickname}
                                </span>
                                        <span className="text-sm" style={{ color:'var(--text-secondary)' }}>
                                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ko })}
                                </span>
                                      </div>
                                      {reply.user_id === currentUserId && (
                                          <button
                                              onClick={() => handleDeleteReply(comment.comment_id, reply.reply_id)}
                                              className="text-sm text-red-400 hover:text-red-500 transition-colors"
                                          >
                                            삭제
                                          </button>
                                      )}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)' }}>{reply.content}</p>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </motion.div>
                    )}
                  </div>
              ))}
            </div>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleCommentSubmit}>
              <div className="flex gap-4">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="flex-1 px-4 py-3 rounded-xl glass-effect"
                    style={{ color: 'var(--text-primary)' }}
                />
                <button
                    type="submit"
                    className="btn-primary px-6 py-3 rounded-xl font-medium"
                    disabled={!newComment.trim()}
                >
                  댓글 작성
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
  );
}

export default PostDetail;