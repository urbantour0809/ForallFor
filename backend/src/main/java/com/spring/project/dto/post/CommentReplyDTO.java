package com.spring.project.dto.post;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class CommentReplyDTO {
    private int reply_id;
    private int comment_id;
    private int user_id;
    private String content;
    @JsonProperty("createdAt")
    private Timestamp createdAt;

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {this.user_id = user_id; }

    public int getReply_id() {
        return reply_id;
    }

    public void setReply_id(int reply_id) {
        this.reply_id = reply_id;
    }

    public int getComment_id() {
        return comment_id;
    }

    public void setComment_id(int comment_id) {
        this.comment_id = comment_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

}
