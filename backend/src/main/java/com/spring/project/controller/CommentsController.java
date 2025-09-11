package com.spring.project.controller;

import com.spring.project.dto.post.CommentReplyDTO;
import com.spring.project.dto.post.CommentsDTO;
import com.spring.project.dto.user.UserDTO;
import com.spring.project.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommentsController {

    @Autowired
    private CommentService commentService;

    /* 댓글 + 대댓글 불러오기 */
    @GetMapping("/comment")
    public Map<String, Object> getCommentsAndReplies(@RequestParam("post_id") int post_id, HttpSession session) {
        Map<String, Object> map = new HashMap<>();

        List<CommentsDTO> comments = commentService.findcommentall(post_id);
        List<CommentReplyDTO> replies = commentService.findRepliesByPostId(post_id);
        List<UserDTO> users = commentService.findUsersForPost(post_id);


        Map<Integer, String> nickByUserId = new HashMap<>();
        for (UserDTO u : users) {
            nickByUserId.put(u.getUser_id(), u.getNickname());
        }

        // 현재 로그인 유저 id
        UserDTO userSession = (UserDTO) session.getAttribute("userSession");
        Integer currentUserId = (userSession != null) ? userSession.getUser_id() : null;

        map.put("comments", comments);
        map.put("replies", replies);
        map.put("nickByUserId", nickByUserId);
        map.put("currentUserId", currentUserId);

        return map;
    }

    /* 댓글 개수 */
    @GetMapping("/comment/count")
    public Map<String, Object> getCommentCount(@RequestParam("post_id") int postId) {
        Map<String, Object> map = new HashMap<>();
        int count = commentService.countComments(postId);
        map.put("success", true);
        map.put("count", count);
        return map;
    }

    /* 댓글 등록 */
    @PostMapping("/comment/insert")
    public Map<String, Object> insertComment(@RequestBody CommentsDTO commentsDTO, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserDTO userSession = (UserDTO) session.getAttribute("userSession");

        if (userSession == null) {
            map.put("status", "fail");
            map.put("message", "로그인 필요");
            return map;
        }

        commentsDTO.setUser_id(userSession.getUser_id());
        int insertComment = commentService.insertComment(commentsDTO);

        if (insertComment > 0) {
            map.put("status", "success");
        } else {
            map.put("status", "fail");
            map.put("message", "댓글 등록 실패");
        }
        return map;
    }

    /* 댓글 삭제 */
    @DeleteMapping("/{comment_id}")
    public Map<String, Object> deleteComment(@PathVariable int comment_id, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserDTO userSession = (UserDTO) session.getAttribute("userSession");

        if (userSession == null) {
            map.put("status", "fail");
            map.put("message", "로그인 필요");
            return map;
        }

        CommentsDTO comment = commentService.findCommentById(comment_id);
        if (comment == null || comment.getUser_id() != userSession.getUser_id()) {
            map.put("status", "fail");
            map.put("message", "삭제 권한이 없습니다.");
            return map;
        }

        int deleteComment = commentService.deleteComment(comment_id);
        map.put("status", deleteComment > 0 ? "success" : "fail");
        if (deleteComment <= 0) {
            map.put("message", "댓글 삭제 실패");
        }
        return map;
    }

    /* 대댓글 등록 */
    @PostMapping("/comment/insertReply")
    public Map<String, Object> insertReply(@RequestBody CommentReplyDTO replyDTO, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserDTO userSession = (UserDTO) session.getAttribute("userSession");

        if (userSession == null) {
            map.put("status", "fail");
            map.put("message", "로그인 필요");
            return map;
        }

        replyDTO.setUser_id(userSession.getUser_id());
        int insertReply = commentService.insertReply(replyDTO);

        if (insertReply > 0) {
            map.put("status", "success");
        } else {
            map.put("status", "fail");
            map.put("message", "대댓글 등록 실패");
        }
        return map;
    }

    /* 대댓글 삭제 */
    @DeleteMapping("/reply/{reply_id}")
    public Map<String, Object> deleteReply(@PathVariable int reply_id,
                                           HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        UserDTO userSession = (UserDTO) session.getAttribute("userSession");

        if (userSession == null) {
            map.put("status", "fail");
            map.put("message", "로그인 필요");
            return map;
        }

        CommentReplyDTO reply = commentService.findReplyById(reply_id);
        if (reply == null || reply.getUser_id() != userSession.getUser_id()) {
            map.put("status", "fail");
            map.put("message", "삭제 권한이 없습니다.");
            return map;
        }

        int deleteReply = commentService.deleteReply(reply_id);
        map.put("status", deleteReply > 0 ? "success" : "fail");
        if (deleteReply <= 0) {
            map.put("message", "대댓글 삭제 실패");
        }
        return map;
    }
}
