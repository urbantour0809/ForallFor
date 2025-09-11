/**
 * PostCard 컴포넌트
 * 
 * 커뮤니티 게시글을 카드 형태로 표시하는 재사용 가능한 컴포넌트입니다.
 * 게시글 제목, 내용, 작성자, 카테고리, 태그, 상호작용 지표 등을 포함합니다.
 * 
 * Props:
 * - post: 게시글 객체 (필수)
 *   - id: 고유 식별자
 *   - title: 게시글 제목
 *   - content: 게시글 내용
 *   - author: 작성자
 *   - category: 카테고리
 *   - likes: 좋아요 수
 *   - comments: 댓글 수
 *   - views: 조회수
 *   - tags: 태그 배열
 *   - createdAt: 작성일시
 *   - avatar: 아바타 이모지
 * - index: 애니메이션 지연을 위한 인덱스 (선택)
 * - onPostClick: 게시글 클릭 핸들러 (선택)
 * - getCategoryStyle: 카테고리 스타일 함수 (선택)
 * 
 * 사용 예시:
 * <PostCard 
 *   post={postData}
 *   index={0}
 *   onPostClick={(post) => console.log(post)}
 *   getCategoryStyle={(category) => 'bg-blue-500/10 text-blue-400'}
 * />
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaComments, FaEye, FaTag } from 'react-icons/fa';

function PostCard({ post, index = 0, onPostClick, getCategoryStyle }) {
  /**
   * 기본 카테고리 스타일 함수
   * @param {string} category - 카테고리 문자열
   * @returns {string} CSS 클래스 문자열
   */
  const defaultGetCategoryStyle = (category) => {
    const styles = {
      'Frontend': 'bg-blue-500/10 text-blue-400',
      'Backend': 'bg-green-500/10 text-green-400',
      'Study': 'bg-purple-500/10 text-purple-400',
      'Data Science': 'bg-orange-500/10 text-orange-400',
      'Interview': 'bg-red-500/10 text-red-400',
      'Project': 'bg-yellow-500/10 text-yellow-400'
    };
    return styles[category] || 'bg-gray-500/10 text-gray-400';
  };

  /**
   * 게시글 카드 클릭 핸들러
   */
  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick(post);
    }
  };

  // 카테고리 스타일 함수 결정 (prop으로 받은 것 또는 기본 함수)
  const categoryStyleFunc = getCategoryStyle || defaultGetCategoryStyle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{
        y: -5,
        scale: 1.01,
        transition: { duration: 0.15 }
      }}
      className="glass-effect rounded-2xl p-6 group cursor-pointer gpu-accelerated"
      onClick={handlePostClick}
    >
      <div className="flex items-start space-x-4">
        {/* 아바타 */}
        <div className="text-3xl flex-shrink-0">{post.avatar}</div>
        
        {/* 메인 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* 헤더 - 제목, 작성자, 시간, 카테고리 */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                {post.title}
              </h3>
              <div className="flex items-center space-x-3 text-sm flex-wrap" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-medium">{post.author}</span>
                <span>•</span>
                <span>{post.createdAt}</span>
                <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${categoryStyleFunc(post.category)}`}>
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          {/* 게시글 내용 미리보기 */}
          <p className="mb-4 text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
            {post.content}
          </p>

          {/* 태그들 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center space-x-1 px-2 py-1 text-xs rounded glass-effect"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <FaTag className="text-xs" />
                  <span>{tag}</span>
                </span>
              ))}
              {post.tags.length > 3 && (
                <span 
                  className="px-2 py-1 text-xs rounded glass-effect"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 하단 상호작용 지표 */}
          <div className="flex items-center space-x-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <motion.div 
              className="flex items-center space-x-1 hover:text-red-400 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                console.log(`좋아요: ${post.title}`);
              }}
            >
              <FaThumbsUp />
              <span>{post.likes}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-1 hover:text-blue-400 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                console.log(`댓글: ${post.title}`);
              }}
            >
              <FaComments />
              <span>{post.comments}</span>
            </motion.div>
            
            <div className="flex items-center space-x-1">
              <FaEye />
              <span>{post.views}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PostCard; 