package com.spring.project.dto.user;

import java.time.LocalDateTime;

public class EmailDTO {
    private String email;              // 인증할 이메일 주소
    private String verificationCode;   // 발송된 인증번호
    private LocalDateTime createdAt;   // 인증번호 생성 시각

    public EmailDTO() {}

    public EmailDTO(String email, String verificationCode, LocalDateTime createdAt) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.createdAt = createdAt;
    }

    // Getter/Setter
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getVerificationCode() {
        return verificationCode;
    }
    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

} 