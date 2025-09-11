package com.spring.project.dto.test;

public class TestLevelDTO {

	 private int level_id;
	 private String name;
	 private String color;
	 
	public int getLevel_id() {
		return level_id;
	}
	public void setLevel_id(int level_id) {
		this.level_id = level_id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	
	@Override
    public String toString() {
        return "TestLevelDTO{" +
                "level_id=" + level_id +
                ", name='" + name + '\'' +
                ", color='" + color + '\'' +
                '}';
    }
	
}
