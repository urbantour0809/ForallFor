package com.spring.project.dto.test;

public class TestProblemDTO {

	  private int test_problem_id;
	  private int test_id;
	  private String title;
	  private String content;
	  private String hint;
	  private String correct;
	  
	  
	public int getTest_problem_id() {
		return test_problem_id;
	}
	public void setTest_problem_id(int test_problem_id) {
		this.test_problem_id = test_problem_id;
	}
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
	public String getHint() {
		return hint;
	}
	public void setHint(String hint) {
		this.hint = hint;
	}
	public String getCorrect() {
		return correct;
	}
	public void setCorrect(String correct) {
		this.correct = correct;
	}
	
	 @Override
	    public String toString() {
	        return "TestProblemDTO{" +
	                "test_problem_id=" + test_problem_id +
	                ", test_id=" + test_id +
	                ", title='" + title + '\'' +
	                ", content='" + content + '\'' +
	                ", hint='" + hint + '\'' +
	                ", correct='" + correct + '\'' +
	                '}';
	    }
	
}
