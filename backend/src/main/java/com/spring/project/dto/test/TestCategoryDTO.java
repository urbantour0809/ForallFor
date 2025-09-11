package com.spring.project.dto.test;

public class TestCategoryDTO {

	 private int category_id;
	 private String name;

	    
	    
	 public int getCategory_id() {
		return category_id;
	 }



	 public void setCategory_id(int category_id) {
		this.category_id = category_id;
	 }



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



		@Override
	    public String toString() {
	        return "TestCategoryDTO{" +
	                "category_id=" + category_id +
	                ", name='" + name + '\'' +
	                '}';
	    }
	
}
