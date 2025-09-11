package com.spring.project.repository;


import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.spring.project.dto.test.TestCategoryDTO;
import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.test.TestLevelDTO;
import com.spring.project.dto.test.TestProblemDTO;
import com.spring.project.dto.user.UserDTO;



@Repository
public class TestRepository {

   @Autowired
   SqlSessionTemplate mybatis;
   
   
   public List<TestDTO> getTestList(){
	   return mybatis.selectList("testRepository.getTestList");
   }
   
   public List<TestCategoryDTO> getTestCatList(){
	   return mybatis.selectList("testRepository.getTestCatList");
   }
   
   public List<TestLevelDTO> getTestLevelList(){
	   return mybatis.selectList("testRepository.getTestLevelList");
   }
   
   public List<UserDTO> getTestWriterList(){
	   return mybatis.selectList("testRepository.getTestWriterList");
   }
   
   public TestDTO insertTest(TestDTO vo) {
	   mybatis.insert("testRepository.insertTest", vo);
	   return vo;
   }
   
   public int insertTestProblem(TestProblemDTO vo) {
	   return mybatis.insert("testRepository.insertTestProblem", vo);
   }
   
   public void deleteTest(int test_id) {
	   mybatis.delete("testRepository.deleteTest", test_id);
   }
 
   
}
