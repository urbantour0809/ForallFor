package com.spring.project.dto.user;

public class UserDTO {
	
	private int user_id;
    private String id;
    private String password;
    private String nickname;
    private String user_type;
    private int grade_id;
    private int experience_points;
    private String created_at;
    private String email;
    private int point;
    
    private String currentPassword; // 비밀번호 검증

    /** 문제 시도 횟수 (현재는 더미 데이터, 추후 문제 테이블 생성 시 실제 계산) */
    private int attempts;
    
    /** 문제 해결 횟수 (현재는 더미 데이터, 추후 문제 테이블 생성 시 실제 계산) */
    private int solved;
    
    /** 정답률 (계산 필드: solved/attempts * 100) */
    private double accuracy;

    
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getUser_type() {
		return user_type;
	}
	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}
	public int getGrade_id() {
		return grade_id;
	}
	public void setGrade_id(int grade_id) {
		this.grade_id = grade_id;
	}
	public int getExperience_points() {
		return experience_points;
	}
	public void setExperience_points(int experience_points) {
		this.experience_points = experience_points;
	}
	public String getCreated_at() {
		return created_at;
	}
	public void setCreated_at(String created_at) {
		this.created_at = created_at;
	}
	
	
	public int getAttempts() {
		return attempts;
	}
	
	public void setAttempts(int attempts) {
		this.attempts = attempts;
		// attempts가 변경되면 정답률 재계산
		this.accuracy = attempts > 0 ? Math.round((double) solved / attempts * 100.0 * 10.0) / 10.0 : 0.0;
	}
	
	public int getSolved() {
		return solved;
	}
	
	public void setSolved(int solved) {
		this.solved = solved;
		// solved가 변경되면 정답률 재계산
		this.accuracy = attempts > 0 ? Math.round((double) solved / attempts * 100.0 * 10.0) / 10.0 : 0.0;
	}
	
	public double getAccuracy() {
		return accuracy;
	}
	
	public void setAccuracy(double accuracy) {
		this.accuracy = accuracy;
	}
    
	@Override
	public String toString() {
		return "UserDTO{" +
				"user_id=" + user_id +
				", id='" + id + '\'' +
				", password='" + password + '\'' +
				", nickname='" + nickname + '\'' +
				", user_type='" + user_type + '\'' +
				", grade_id=" + grade_id +
				", experience_points=" + experience_points +
				", created_at='" + created_at + '\'' +
				", email='" + email + '\'' +
				", attempts=" + attempts +
				", solved=" + solved +
				", accuracy=" + accuracy +
				'}';
	}
	public int getPoint() {
		return point;
	}
	public void setPoint(int point) {
		this.point = point;
	}
	public String getCurrentPassword() {
		return currentPassword;
	}
	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}
	
    
	
}
