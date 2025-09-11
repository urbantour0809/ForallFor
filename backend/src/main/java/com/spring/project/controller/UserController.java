package com.spring.project.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.project.dto.user.UserDTO;
import com.spring.project.service.UserService;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // React 앱과 CORS 설정
public class UserController {

	@Autowired
	UserService userService;

	// 로그인 기능

	@PostMapping("/login")
	public Map<String, Object> login(@RequestBody UserDTO userDTO, HttpSession session){

		Map<String, Object> map = new HashMap<>();


		UserDTO loginUser = userService.login(userDTO);

		if (loginUser != null) {
			session.setAttribute("userSession", loginUser);
			map.put("message", "로그인 성공!");
			map.put("success", true);
		} else {
			map.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
			map.put("success", false);
		}
		return map;

	}

	//로그아웃 기능
	@PostMapping("/logout")
	public Map<String, Object> logout(HttpSession session){
		Map<String, Object> map = new HashMap<String, Object>();

		session.invalidate();

		map.put("success", true);
		map.put("message", "로그아웃 성공!");
		return map;
	}

	//회원가입 기능
	@PostMapping("/signup")
	public Map<String, Object> singup(@RequestBody UserDTO userDTO){

		Map<String, Object> map = new HashMap<String, Object>();

		int user = userService.signup(userDTO);

		if(user > 0) {
			map.put("success", true);
			map.put("message","회원가입 성공");
		}else {
			map.put("success", false);
			map.put("message", "회원가입 실패");
		}
		return map;

	}

	
	@GetMapping("/session-check")
	public Map<String, Object> sessionCheck(HttpSession session) {
		Map<String, Object> map = new HashMap<>();
		UserDTO loginUser = (UserDTO) session.getAttribute("userSession");

		if (loginUser != null) {
			map.put("nickname", loginUser.getNickname());
			map.put("userType", loginUser.getUser_type());
			map.put("point", loginUser.getPoint());
			map.put("success", true);
		} else {
			map.put("success", false);
			map.put("message", "세션 없음");
		}
		

		return map;
	}

	@PostMapping("/check-id-or-nickname")
	public Map<String, Object> checkIdOrNickname(@RequestBody UserDTO userDTO) {
		Map<String, Boolean> result = userService.checkIdOrNickname(userDTO);
		boolean checkid = result.get("id");
		boolean checknickname = result.get("nickname");

		Map<String, Object> map = new HashMap<>();
		map.put("success", true);
		map.put("checkid", checkid);
		map.put("checknickname", checknickname);

		if (checkid && checknickname) {
			map.put("message", "이미 존재하는 닉네임, 아이디입니다.");
		} else if (checkid) {
			map.put("message", "존재하는 아이디입니다.");
		} else if (checknickname) {
			map.put("message", "존재하는 닉네임입니다.");
		} else {
			map.put("message", "사용 가능한 아이디와 닉네임입니다.");
		}

		return map;
	}



}
