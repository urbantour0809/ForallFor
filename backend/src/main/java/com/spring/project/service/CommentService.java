package com.spring.project.service;

import com.spring.project.dto.post.CommentReplyDTO;
import com.spring.project.dto.post.CommentsDTO;
import com.spring.project.dto.user.UserDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

public interface CommentService {

    public List<CommentsDTO> findcommentall(int post_id);

    public int countComments(int post_id);

    public int insertComment(CommentsDTO commentsDTO);

    public CommentsDTO  findCommentById(int comment_id);

    public int deleteComment(int comment_id);

    public List<CommentReplyDTO> findRepliesByCommentId(int comment_id);

    public int insertReply(CommentReplyDTO commentReplyDTO);

    public CommentReplyDTO findReplyById(int reply_id);

    public int deleteReply(int reply_id);

    //대댓글  찾기
    public List<CommentReplyDTO> findRepliesByPostId(int post_id);

    // 닉네임
    public List<UserDTO> findUsersForPost(int post_id);

}
