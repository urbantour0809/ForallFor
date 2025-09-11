package com.spring.project.service;

import java.util.Map;

import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.test.TestProblemDTO;

public interface TestService {
    
	public Map<String, Object> getAllTestInfo();
	
	public TestDTO insertTest(TestDTO vo);
	
	public int insertTestProblem(TestProblemDTO vo);
	
	public void deleteTest(int test_id);
	
}

