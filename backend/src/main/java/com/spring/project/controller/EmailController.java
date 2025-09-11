package com.spring.project.controller;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.project.service.EmailService;

@RestController
@RequestMapping("/api")
public class EmailController {
   
	@Autowired
	EmailService emailService;
	
	public EmailController() {
		System.out.println("==== EmailController 생성됨 ====");
	}
	
	// 이메일 인증번호 요청
	@PostMapping("/email-verification")
	public Map<String, Object> requestEmailVerification(@RequestBody Map<String, String> request) {
		System.out.println("============================");
		System.out.println("[EmailController] /api/email-verification 진입! : " + LocalDateTime.now());
		System.out.println("전달받은 email: " + request.get("email"));
		System.out.println("============================");
		
		Map<String, Object> response = new HashMap<>();
		
		try {
			String email = request.get("email");
			
			if (email == null || email.trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "이메일 주소를 입력해주세요.");
				return response;
			}
			
			// 이메일 인증번호 발송
			emailService.sendVerificationCode(email);
			
			response.put("success", true);
			response.put("message", "인증번호가 이메일로 전송되었습니다.");
			
		} catch (Exception e) {
			System.out.println("이메일 인증번호 요청 오류: " + e.getMessage());
			response.put("success", false);
			response.put("message", "인증번호 전송 중 오류가 발생했습니다.");
		}
		
		return response;
	}
	
	// 이메일 인증번호 확인
	@PostMapping("/email-verification/verify")
	public Map<String, Object> verifyEmailCode(@RequestBody Map<String, String> request) {
		System.out.println("============================");
		System.out.println("[EmailController] /api/email-verification/verify 진입! : " + LocalDateTime.now());
		System.out.println("전달받은 email: " + request.get("email"));
		System.out.println("전달받은 verificationCode: " + request.get("verificationCode"));
		System.out.println("============================");
		
		Map<String, Object> response = new HashMap<>();
		
		try {
			String email = request.get("email");
			String verificationCode = request.get("verificationCode");
			
			if (email == null || email.trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "이메일 주소를 입력해주세요.");
				return response;
			}
			
			if (verificationCode == null || verificationCode.trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "인증번호를 입력해주세요.");
				return response;
			}
			
			// 인증번호 검증
			boolean isValid = emailService.verifyCode(email, verificationCode);
			
			if (isValid) {
				response.put("success", true);
				response.put("message", "이메일 인증이 완료되었습니다.");
			} else {
				response.put("success", false);
				response.put("message", "인증번호가 올바르지 않거나 만료되었습니다.");
			}
			
		} catch (Exception e) {
			System.out.println("이메일 인증번호 확인 오류: " + e.getMessage());
			response.put("success", false);
			response.put("message", "인증번호 확인 중 오류가 발생했습니다.");
		}
		
		return response;
	}
} 