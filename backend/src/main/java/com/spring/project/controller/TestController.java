package com.spring.project.controller;



import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.spring.project.dto.post.PostsDTO;
import com.spring.project.dto.test.TestCategoryDTO;
import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.test.TestLevelDTO;
import com.spring.project.dto.test.TestProblemDTO;
import com.spring.project.dto.user.UserDTO;
import com.spring.project.service.TestService;

@RestController
@RequestMapping("/api")
public class TestController {

	@Autowired
	TestService testService;
	
	@GetMapping("/tests")
	public Map<String, Object> tests() {
		
		Map<String, Object> allTestInfoMap = new HashMap<String, Object>();
		
		System.out.println("Controller진입");
		
		// 테스트 정보, 테스트 난이도, 카테고리, 기업이름 리스트가 담긴  Map호출
		allTestInfoMap = testService.getAllTestInfo();
		

		
		return allTestInfoMap;
	}
	
	  @PostMapping("test/insert")
	    public Map<String, Object> insertTest(@RequestBody TestDTO vo, HttpSession session) {
		  
			Map<String, Object> map = new HashMap<>();
			boolean success = false;
			UserDTO userSession = new UserDTO();
			
			userSession = (UserDTO) session.getAttribute("userSession");
			vo.setUser_id(userSession.getUser_id());
			
			vo = testService.insertTest(vo);
			
			if(vo.getTest_id() > 0) {
				success = true;
			}

			map.put("success", success);
			map.put("testId", vo.getTest_id());
			return map;
		}

	    @PostMapping("test/problem/insert")
		public Map<String, Object> insertTestProblems(@RequestBody List<TestProblemDTO> voList, HttpSession session) {
	    	
			Map<String, Object> map = new HashMap<>();
			boolean success = false;
			int successInt = 0;
			
			if (voList != null) {
				for (TestProblemDTO vo : voList) {
					if(vo.getTest_id() != 0) {
						successInt = testService.insertTestProblem(vo);	
					}
				}
			}
				
			if(successInt > 0) {
				success = true;
			}
				
			map.put("success", success);
			return map;
		}
	    
	    @PostMapping("test/delete")
		public void deleteTest(@RequestBody TestDTO vo) {
	    	
	    	testService.deleteTest(vo.getTest_id());
			
		}

	
	
}

