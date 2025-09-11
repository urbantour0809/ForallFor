package com.spring.project.dto.user;

public class UserGradeDTO {
	
	private Integer grade_id;
    private String grade_name;
    private Integer min_experience;
    private Integer max_experience;
    private String grade_color;
    private String grade_icon;
    
	public Integer getGrade_id() {
		return grade_id;
	}
	public void setGrade_id(Integer grade_id) {
		this.grade_id = grade_id;
	}
	public String getGrade_name() {
		return grade_name;
	}
	public void setGrade_name(String grade_name) {
		this.grade_name = grade_name;
	}
	public Integer getMin_experience() {
		return min_experience;
	}
	public void setMin_experience(Integer min_experience) {
		this.min_experience = min_experience;
	}
	public Integer getMax_experience() {
		return max_experience;
	}
	public void setMax_experience(Integer max_experience) {
		this.max_experience = max_experience;
	}
	public String getGrade_color() {
		return grade_color;
	}
	public void setGrade_color(String grade_color) {
		this.grade_color = grade_color;
	}
	public String getGrade_icon() {
		return grade_icon;
	}
	public void setGrade_icon(String grade_icon) {
		this.grade_icon = grade_icon;
	}
    
	@Override
	public String toString() {
		return "UserGradeDTO{" +
				"grade_id=" + grade_id +
				", grade_name='" + grade_name + '\'' +
				", min_experience=" + min_experience +
				", max_experience=" + max_experience +
				", grade_color='" + grade_color + '\'' +
				", grade_icon='" + grade_icon + '\'' +
				'}';
	}
}
