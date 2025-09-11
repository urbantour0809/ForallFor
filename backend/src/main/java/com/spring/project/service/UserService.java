package com.spring.project.service;
import java.util.Map;


import com.spring.project.dto.user.UserDTO;


/**
 * 사용자 관련 비즈니스 로직을 처리하는 서비스 인터페이스
 */
public interface UserService {

    //로그인
    public UserDTO login(UserDTO user);
    //회원가입
    public int signup(UserDTO user);
    //아이디 또는 닉네임 중복 확인
    public Map<String, Boolean> checkIdOrNickname(UserDTO user);

}
