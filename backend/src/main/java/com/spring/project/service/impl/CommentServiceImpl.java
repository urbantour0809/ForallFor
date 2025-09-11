package com.spring.project.service.impl;

import com.spring.project.dto.post.CommentReplyDTO;
import com.spring.project.dto.post.CommentsDTO;
import com.spring.project.dto.post.PostsDTO;
import com.spring.project.dto.user.UserDTO;
import com.spring.project.repository.CommentRepository;
import com.spring.project.repository.PostRepository;
import com.spring.project.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;


@Service("CommentService")
public class CommentServiceImpl implements CommentService {

    @Autowired
    CommentRepository commentRepository;

    @Override
    public List<CommentsDTO> findcommentall(int post_id){
        return commentRepository.findcommentall(post_id);
    };

    @Override
    public int countComments (int post_id){
        return commentRepository.countComments(post_id);
    };

    @Override
    public int insertComment(CommentsDTO commentsDTO){
        return commentRepository.insertComment(commentsDTO);
    }

    @Override
    public CommentsDTO findCommentById (int comment_id) { // boolean
        return commentRepository.findCommentById(comment_id);
    }

    @Override
    public int deleteComment(int comment_id) {
        return commentRepository.deleteComment(comment_id);
    }

    @Override
    public List<CommentReplyDTO> findRepliesByCommentId(int comment_id){
        return commentRepository.findRepliesByCommentId(comment_id);
    };

    @Override
    public int insertReply(CommentReplyDTO commentReplyDTO){
        return commentRepository.insertReply(commentReplyDTO);
    }

    @Override
    public CommentReplyDTO  findReplyById(int reply_id) {
        return commentRepository.findReplyById(reply_id);
    }

    @Override
    public int deleteReply(int reply_id) {
        return commentRepository.deleteReply(reply_id);
    }

    @Override
    public List<CommentReplyDTO> findRepliesByPostId(int post_id) {
        return commentRepository.findRepliesByPostId(post_id);
    };

    @Override
    public List<UserDTO> findUsersForPost(int post_id) {
        return commentRepository.findUsersForPost(post_id);
    };

}
