package com.spring.project.repository;

import com.spring.project.dto.post.CommentReplyDTO;
import com.spring.project.dto.post.CommentsDTO;
import com.spring.project.dto.post.PostsDTO;
import com.spring.project.dto.user.UserDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CommentRepository {

    @Autowired
    private SqlSessionTemplate mybatis;

    /* 해당 post_id > 모든 댓글 불러오기 */
    public List<CommentsDTO> findcommentall(int post_id){
        return mybatis.selectList("commentRepository.findcommentall",post_id);
    }
    /* 댓글 수 */
    public int countComments(int post_id){
        return mybatis.selectOne("commentRepository.countComments",post_id);
    }

    /* 댓글 등록 */
    public int insertComment(CommentsDTO commentsDTO){
        return mybatis.insert("commentRepository.insertComment", commentsDTO);
    }

    /* 댓글 삭제 권한 체크*/
    public CommentsDTO  findCommentById(int comment_id){
        return mybatis.selectOne("commentRepository.findCommentById", comment_id);
    }

    /* 댓글 삭제 */
    public int deleteComment(int comment_id){
        return mybatis.delete("commentRepository.deleteComment",comment_id);
    }

    /* 해당 comment_id 대댓글 불러오기*/
    public List<CommentReplyDTO> findRepliesByCommentId(int comment_id){
        return mybatis.selectList("commentRepository.findRepliesByCommentId",comment_id);
    }

    /* 대댓글 등록 */
    public int insertReply(CommentReplyDTO commentReplyDTO){
        return mybatis.insert("commentRepository.insertReply",commentReplyDTO);
    }

    /* 대댓글 삭제 권한 체크 */
    public CommentReplyDTO  findReplyById(int reply_id){
        return mybatis.selectOne("commentRepository.findReplyById", reply_id);
    }

    /* 대댓글 삭제 */
    public int deleteReply(int reply_id){
        return mybatis.delete("commentRepository.deleteReply",reply_id);
    }

    public List<CommentReplyDTO> findRepliesByPostId(int post_id){
        return mybatis.selectList("commentRepository.findRepliesByPostId", post_id);
    }

    public List<UserDTO> findUsersForPost(int post_id){
        return mybatis.selectList("commentRepository.findUsersForPost", post_id);
    }
}
