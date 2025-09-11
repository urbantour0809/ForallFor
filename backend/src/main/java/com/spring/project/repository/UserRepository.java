package com.spring.project.repository;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.spring.project.dto.user.UserDTO;

@Repository
public class UserRepository {


    @Autowired
    SqlSessionTemplate mybatis;

    public UserDTO login(UserDTO user) { return mybatis.selectOne("userRepository.login", user);}

    public int checkId(UserDTO user) {
        return mybatis.selectOne("userRepository.checkId", user);
    }

    public int checkNickname(UserDTO user) {
        return mybatis.selectOne("userRepository.checkNickname", user);
    }

    public int signup(UserDTO user) {
        return mybatis.insert("userRepository.singup", user);
    }

    public UserDTO findByUsername(String username) { return mybatis.selectOne("userRepository.findByUsername", username);}


    public UserDTO findByEmail(String email) {
        return mybatis.selectOne("userRepository.findByEmail", email);
    }


    public void insertUser(UserDTO user) {
        mybatis.insert("userRepository.insertUser", user);
    }

    /* 소셜 로그인 */
    public UserDTO findByLoginId(String naverId){ return mybatis.selectOne("userRepository.findByLoginId", naverId); }

}


