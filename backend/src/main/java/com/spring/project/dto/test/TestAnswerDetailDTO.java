package com.spring.project.dto.test;

public class TestAnswerDetailDTO {

	  private int answer_detail_id;
	  private int test_problem_id;
	  private int test_sub_id;
	  private String sub_code;
	  private boolean pass;
	  
	  
	public int getAnswer_detail_id() {
		return answer_detail_id;
	}
	public void setAnswer_detail_id(int answer_detail_id) {
		this.answer_detail_id = answer_detail_id;
	}
	public int getTest_problem_id() {
		return test_problem_id;
	}
	public void setTest_problem_id(int test_problem_id) {
		this.test_problem_id = test_problem_id;
	}
	public int getTest_sub_id() {
		return test_sub_id;
	}
	public void setTest_sub_id(int test_sub_id) {
		this.test_sub_id = test_sub_id;
	}
	public String getSub_code() {
		return sub_code;
	}
	public void setSub_code(String sub_code) {
		this.sub_code = sub_code;
	}
	public boolean isPass() {
		return pass;
	}
	public void setPass(boolean pass) {
		this.pass = pass;
	}
	 
	
    @Override
    public String toString() {
        return "TestAnswerDetailDTO{" +
                "answer_detail_id=" + answer_detail_id +
                ", test_problem_id=" + test_problem_id +
                ", test_sub_id=" + test_sub_id +
                ", sub_code='" + sub_code + '\'' +
                ", pass=" + pass +
                '}';
    }
	  
	
}
