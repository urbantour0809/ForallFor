package com.spring.project.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.test.TestProblemDTO;
import com.spring.project.repository.TestRepository;
import com.spring.project.service.TestService;

@Service("testService")
public class TestServiceImpl implements TestService {

	@Autowired
	TestRepository testRepository;

	@Override
	public Map<String, Object> getAllTestInfo() {
		
		Map<String, Object> allTestInfoMap = new HashMap<String, Object>();
		
		//testDTO List
		allTestInfoMap.put("testList", testRepository.getTestList());
		//testCategoryDTO List
		allTestInfoMap.put("testCategoryList", testRepository.getTestCatList());
		//testLevelDTO List
		allTestInfoMap.put("testLevelList", testRepository.getTestLevelList());
		//userDTO List
		allTestInfoMap.put("testWriterList", testRepository.getTestWriterList());
		
		
		return allTestInfoMap;
	}

	@Override
	public TestDTO insertTest(TestDTO vo) {
		return testRepository.insertTest(vo);
	}

	@Override
	public int insertTestProblem(TestProblemDTO vo) {
		return testRepository.insertTestProblem(vo);
	}

	@Override
	public void deleteTest(int test_id) {
		
		testRepository.deleteTest(test_id);
		
	}
	
}