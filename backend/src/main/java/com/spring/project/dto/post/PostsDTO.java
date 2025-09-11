package com.spring.project.dto.post;


import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;

public class PostsDTO {
    private int post_id;
    private String title;
    private String content;
    private int user_id;
    private int category_id;
    private int views;

    @JsonProperty("createdAt")
    private Timestamp created_at;

    public int getPost_id() {
        return post_id;
    }

    public void setPost_id(int post_id) {
        this.post_id = post_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public Timestamp  getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp  created_at) {
        this.created_at = created_at;
    }

    
    @Override
    public String toString() {
        return "PostsDTO{" +
                "post_id=" + post_id +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", user_id=" + user_id +
                ", category_id=" + category_id +
                ", views=" + views +
                ", created_at=" + created_at +
                '}';
    }


}
