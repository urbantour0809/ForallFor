package com.spring.project.dto.test;

import java.util.Date;

public class TestDTO {

	
	 private int test_id;
	 private String title;
	 private String content;
	 private int level_id;
	 private int category_id;
	 private int user_id;
	

	 private Date created_at;

	 
	public int getTest_id() {
		return test_id;
	}
	public void setTest_id(int test_id) {
		this.test_id = test_id;
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
	public int getLevel_id() {
		return level_id;
	}
	public void setLevel_id(int level_id) {
		this.level_id = level_id;
	}
	public int getCategory_id() {
		return category_id;
	}
	public void setCategory_id(int category_id) {
		this.category_id = category_id;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	
	public Date getCreated_at() {
		return created_at;
	}
	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
	@Override
    public String toString() {
        return "TestDTO{" +
                "test_id=" + test_id +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", level_id=" + level_id +
                ", category_id=" + category_id +
                ", user_id=" + user_id +
                ",create_at" + created_at +
                '}';
    }
	 
	 
}
