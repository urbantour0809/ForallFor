package com.spring.project.service.impl;

import com.spring.project.dto.user.EmailDTO;
import com.spring.project.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // 메모리 임시 저장소 (이메일별 인증정보)
    private final Map<String, EmailDTO> verificationMap = new ConcurrentHashMap<>();

    // 인증번호 생성 및 이메일 발송
    @Override
    public void sendVerificationCode(String email) {
        String code = generateCode();
        EmailDTO dto = new EmailDTO(email, code, LocalDateTime.now());
        verificationMap.put(email, dto);

        // 이메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("kjm02251@gmail.com"); // 발신자 설정 추가
        message.setTo(email);
        message.setSubject("FAF 회원가입 이메일 인증번호 안내");
        message.setText("인증번호: " + code + "\n3분 이내에 입력해주세요.");
        mailSender.send(message);
    }

    // 인증번호 검증
    @Override
    public boolean verifyCode(String email, String code) {
        EmailDTO dto = verificationMap.get(email);
        if (dto == null) return false;
        // 유효시간 3분 체크
        if (dto.getCreatedAt().plusMinutes(3).isBefore(LocalDateTime.now())) {
            verificationMap.remove(email);
            return false;
        }
        // 인증번호 일치 체크
        if (dto.getVerificationCode().equals(code)) {
            verificationMap.remove(email); // 1회성 사용
            return true;
        }
       return false;
    }

    // 6자리 인증번호 생성
    private String generateCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}