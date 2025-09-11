package com.spring.project.service.impl;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.project.dto.user.UserDTO;
import com.spring.project.repository.UserRepository;
import com.spring.project.service.UserService;

/**
 * 사용자 서비스 구현체
 * 사용자 관련 비즈니스 로직을 처리합니다.
 */
@Service("userService")
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDTO login(UserDTO user) {
        return userRepository.login(user);
    }

    @Override
    public int signup(UserDTO user) {return userRepository.signup(user);}

    @Override
    public Map<String, Boolean> checkIdOrNickname(UserDTO user) {

        boolean id = userRepository.checkId(user) > 0;
        boolean nickname = userRepository.checkNickname(user) > 0;

        System.out.println("id: " + id + ", nickname: " + nickname);

        Map<String, Boolean> map = new HashMap<>();
        map.put("id", id);
        map.put("nickname", nickname);

        return map;
    }
}
