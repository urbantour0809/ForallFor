package com.spring.project.service;



public interface EmailService {
    // 인증번호 생성 및 이메일 발송
    void sendVerificationCode(String email);

    // 인증번호 검증
    boolean verifyCode(String email, String code);

}