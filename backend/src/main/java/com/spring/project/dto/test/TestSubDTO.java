package com.spring.project.dto.test;

import java.util.Date;

public class TestSubDTO {

	private int test_sub_id;
	private int user_id;
	private int test_id;
	private int correct_count;
	private int wrong_count;
	private boolean pass;
	private Date created_at;
	
	
	public int getTest_sub_id() {
		return test_sub_id;
	}
	public void setTest_sub_id(int test_sub_id) {
		this.test_sub_id = test_sub_id;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public int getTest_id() {
		return test_id;
	}
	public void setTest_id(int test_id) {
		this.test_id = test_id;
	}
	public int getCorrect_count() {
		return correct_count;
	}
	public void setCorrect_count(int correct_count) {
		this.correct_count = correct_count;
	}
	public int getWrong_count() {
		return wrong_count;
	}
	public void setWrong_count(int wrong_count) {
		this.wrong_count = wrong_count;
	}
	public boolean isPass() {
		return pass;
	}
	public void setPass(boolean pass) {
		this.pass = pass;
	}
	
	
	public Date getCreated_at() {
		return created_at;
	}
	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
	@Override
	    public String toString() {
	        return "TestSubDTO{" +
	                "test_sub_id=" + test_sub_id +
	                ", user_id=" + user_id +
	                ", test_id=" + test_id +
	                ", correct_count=" + correct_count +
	                ", wrong_count=" + wrong_count +
	                ", pass=" + pass +
	                ", created_at=" + created_at +
	                '}';
	    }

	
}
