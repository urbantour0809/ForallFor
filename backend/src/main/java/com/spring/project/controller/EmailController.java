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
		System.out.println("==== EmailController ������ ====");
	}
	
	// �̸��� ������ȣ ��û
	@PostMapping("/email-verification")
	public Map<String, Object> requestEmailVerification(@RequestBody Map<String, String> request) {
		System.out.println("============================");
		System.out.println("[EmailController] /api/email-verification ����! : " + LocalDateTime.now());
		System.out.println("���޹��� email: " + request.get("email"));
		System.out.println("============================");
		
		Map<String, Object> response = new HashMap<>();
		
		try {
			String email = request.get("email");
			
			if (email == null || email.trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "�̸��� �ּҸ� �Է����ּ���.");
				return response;
			}
			
			// �̸��� ������ȣ �߼�
			emailService.sendVerificationCode(email);
			
			response.put("success", true);
			response.put("message", "������ȣ�� �̸��Ϸ� ���۵Ǿ����ϴ�.");
			
		} catch (Exception e) {
			System.out.println("�̸��� ������ȣ ��û ����: " + e.getMessage());
			response.put("success", false);
			response.put("message", "������ȣ ���� �� ������ �߻��߽��ϴ�.");
		}
		
		return response;
	}
	
	// �̸��� ������ȣ Ȯ��
	@PostMapping("/email-verification/verify")
	public Map<String, Object> verifyEmailCode(@RequestBody Map<String, String> request) {
		System.out.println("============================");
		System.out.println("[EmailController] /api/email-verification/verify ����! : " + LocalDateTime.now());
		System.out.println("���޹��� email: " + request.get("email"));
		System.out.println("���޹��� verificationCode: " + request.get("verificationCode"));
		System.out.println("============================");
		
		Map<String, Object> response = new HashMap<>();
		
		try {
			String email = request.get("email");
			String verificationCode = request.get("verificationCode");
			
			if (email == null || email.trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "�̸��� �ּҸ� �Է����ּ���.");
				return response;
			}
			
			if (verificationCode == null || verificationCode.trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "������ȣ�� �Է����ּ���.");
				return response;
			}
			
			// ������ȣ ����
			boolean isValid = emailService.verifyCode(email, verificationCode);
			
			if (isValid) {
				response.put("success", true);
				response.put("message", "�̸��� ������ �Ϸ�Ǿ����ϴ�.");
			} else {
				response.put("success", false);
				response.put("message", "������ȣ�� �ùٸ��� �ʰų� ����Ǿ����ϴ�.");
			}
			
		} catch (Exception e) {
			System.out.println("�̸��� ������ȣ Ȯ�� ����: " + e.getMessage());
			response.put("success", false);
			response.put("message", "������ȣ Ȯ�� �� ������ �߻��߽��ϴ�.");
		}
		
		return response;
	}
} 