package com.spring.project.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.project.dto.user.UserDTO;
import com.spring.project.dto.user.UserGradeDTO;
import com.spring.project.dto.challenge.ChallengeDTO;
import com.spring.project.dto.challenge.ChallengeLevelDTO;
import com.spring.project.dto.challenge.ChallengeCategoryDTO;
import com.spring.project.dto.product.ProductDTO;
import com.spring.project.dto.test.TestAnswerDetailDTO;
import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.test.TestProblemDTO;
import com.spring.project.dto.test.TestSubDTO;
import com.spring.project.dto.post.PostsDTO;
import com.spring.project.dto.post.PostCategoryDTO;
import com.spring.project.service.MyPageService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MyPageController {
   
	@Autowired
	MyPageService myPageService;
	
	/**
	 * 관리자용 회원 목록 조회 API
	 * 
	 * @return Map<String, Object> 회원 목록과 성공 여부
	 */
	@GetMapping("/admin/users")
	public Map<String, Object> getAllUsersForAdmin() {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("관리자 회원 목록 조회 요청 받음");
			
			// 서비스에서 회원 목록 조회
			Map<String, Object> userInfoMap = myPageService.getAllUsersForAdmin();
			
			List<UserDTO> userList = (List<UserDTO>) userInfoMap.get("userList");
			List<UserGradeDTO> userGradesList = (List<UserGradeDTO>) userInfoMap.get("userGradesList");

			for(UserDTO user : userList) {
				System.out.println(user.toString());
			}
			for(UserGradeDTO userGrades : userGradesList) {
				System.out.println(userGrades.toString());
			}

			response.put("success", true);
			response.put("data", userList);
			response.put("userGrades", userGradesList);
			response.put("message", "회원 목록 조회 성공");
			response.put("total", userList.size());

			System.out.println("회원 목록 조회 성공: " + userList.size() + "명");
			
			return response;
			
		} catch (Exception e) {
			System.err.println("회원 목록 조회 API 오류: " + e.getMessage());
			e.printStackTrace();
			
			response.put("success", false);
			response.put("message", "회원 목록 조회에 실패했습니다.");
			response.put("error", e.getMessage());
			
			return response;
		}
	}

	/**
	 * 관리자용 문제 목록 조회 API
	 * 
	 * @return Map<String, Object> 문제 목록과 성공 여부
	 */
	@GetMapping("/admin/problems")
	public Map<String, Object> getAllProblemsForAdmin() {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("🎯 관리자 문제 목록 조회 요청 받음");
			
			// 서비스에서 문제 목록 조회
			Map<String, Object> problemInfoMap = myPageService.getAllProblemsForAdmin();
			
			List<ChallengeDTO> problemList = (List<ChallengeDTO>) problemInfoMap.get("problemList");
			List<ChallengeLevelDTO> problemLevelsList = (List<ChallengeLevelDTO>) problemInfoMap.get("problemLevelsList");
			List<ChallengeCategoryDTO> problemCategoriesList = (List<ChallengeCategoryDTO>) problemInfoMap.get("problemCategoriesList");

			// 디버깅용 로그
			System.out.println("📊 문제 데이터 개수: " + problemList.size());
			System.out.println("📊 난이도 데이터 개수: " + problemLevelsList.size());
			System.out.println("📊 카테고리 데이터 개수: " + problemCategoriesList.size());
			
			for(ChallengeDTO problem : problemList) {
				System.out.println("문제 ID: " + problem.getChallenge_id() + 
					", 제목: " + problem.getChallenge_title() + 
					", 난이도ID: " + problem.getLevel_id() + 
					", 카테고리ID: " + problem.getCategory_id());
			}
			for(ChallengeLevelDTO level : problemLevelsList) {
				System.out.println("난이도 ID: " + level.getLevel_id() + ", 이름: " + level.getLevel_name());
			}
			for(ChallengeCategoryDTO category : problemCategoriesList) {
				System.out.println("카테고리 ID: " + category.getCategory_id() + ", 이름: " + category.getCategory_name());
			}

			response.put("success", true);
			response.put("problems", problemList);
			response.put("levels", problemLevelsList);
			response.put("categories", problemCategoriesList);
			response.put("message", "문제 목록 조회 성공");
			response.put("total", problemList.size());

			System.out.println("✅ 문제 목록 조회 성공: " + problemList.size() + "개");
			
			return response;
			
		} catch (Exception e) {
			System.err.println("❌ 문제 목록 조회 API 오류: " + e.getMessage());
			e.printStackTrace();
			
			response.put("success", false);
			response.put("message", "문제 목록 조회에 실패했습니다.");
			response.put("error", e.getMessage());
			
			return response;
		}
	}

	/**
	 * 관리자용 통계 데이터 조회 API
	 * 
	 * @return Map<String, Object> 통계 데이터와 성공 여부
	 */
	@GetMapping("/admin/stats")
	public Map<String, Object> getAdminStats() {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("📊 관리자 통계 데이터 조회 요청 받음");
			
			// 서비스에서 통계 데이터 조회
			Map<String, Object> statsData = myPageService.getAdminStats();
			
			// 디버깅용 로그
			System.out.println("📊 전체 회원수: " + statsData.get("totalUsers"));
			System.out.println("📊 전체 게시글수: " + statsData.get("totalPosts"));
			System.out.println("📊 전체 시험수: " + statsData.get("totalTests"));
			System.out.println("📊 전체 문제수: " + statsData.get("totalProblems"));
			System.out.println("📊 전체 상품수: " + statsData.get("totalProducts"));

			response.put("success", true);
			response.put("stats", statsData);
			response.put("message", "통계 데이터 조회 성공");

			System.out.println("✅ 통계 데이터 조회 성공");
			
			return response;
			
		} catch (Exception e) {
			System.err.println("❌ 통계 데이터 조회 API 오류: " + e.getMessage());
			e.printStackTrace();
			
			response.put("success", false);
			response.put("message", "통계 데이터 조회에 실패했습니다.");
			response.put("error", e.getMessage());
			
			return response;
		}
	}

	/**
	 * 관리자용 상품 목록 조회 API
	 * 
	 * @return Map<String, Object> 상품 목록과 성공 여부
	 */
	@GetMapping("/admin/products")
	public Map<String, Object> getAllProductsForAdmin() {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("🛍️ 관리자 상품 목록 조회 요청 받음");
			
			// 서비스에서 상품 목록 조회
			Map<String, Object> productInfoMap = myPageService.getAllProductsForAdmin();
			
			List<ProductDTO> productList = (List<ProductDTO>) productInfoMap.get("productList");

			// 디버깅용 로그
			System.out.println("📊 상품 데이터 개수: " + productList.size());
			
			for(ProductDTO product : productList) {
				System.out.println("상품 ID: " + product.getProduct_id() + 
					", 제목: " + product.getProduct_title() + 
					", 저자: " + product.getWriter() + 
					", 가격: " + product.getPrice() + 
					", 재고: " + product.getStock());
			}

			response.put("success", true);
			response.put("products", productList);
			response.put("message", "상품 목록 조회 성공");
			response.put("total", productList.size());

			System.out.println("✅ 상품 목록 조회 성공: " + productList.size() + "개");
			
			return response;
			
		} catch (Exception e) {
			System.err.println("❌ 상품 목록 조회 API 오류: " + e.getMessage());
			e.printStackTrace();
			
			response.put("success", false);
			response.put("message", "상품 목록 조회에 실패했습니다.");
			response.put("error", e.getMessage());
			
			return response;
		}
	}
	
	@GetMapping("/user/mypage")
	public Map<String, Object> userpage(HttpSession session){
		System.out.println("유저 마이 페이지 진입");
		
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> userChallengeSubMap = new HashMap<String, Object>();
		Map<String, Object> userPostInfoMap = new HashMap<String, Object>();
		
		UserDTO userSession = (UserDTO) session.getAttribute("userSession");
		
		// challengesDTO, challengeSubDTO, challengeLevelDTO, challengeCategoryDTO 
		userChallengeSubMap = myPageService.getUserChallengeSub(userSession.getUser_id());
		
		userPostInfoMap = myPageService.getUserPostInfo(userSession.getUser_id());
		
		//myPageService.getUserChallengeAnswerSub(userSession.getUser_id());
		map.put("userInfo", userSession);
		map.put("userGradeInfo", myPageService.getUserGrade(userSession.getUser_id()));
		map.put("userChallengeSubTitleList", userChallengeSubMap.get("userChallengeSubTitleList"));
		map.put("userChallengeSubPassList", userChallengeSubMap.get("userChallengeSubPassList"));
		map.put("userChallengeSubLevelList", userChallengeSubMap.get("userChallengeSubLevelList"));
		map.put("userChallengeSubCategoryList", userChallengeSubMap.get("userChallengeSubCategoryList"));
		map.put("userPostList", userPostInfoMap.get("userPostList"));
		map.put("userPostCategoryList", userPostInfoMap.get("userPostCategoryList"));
		

		
		
		return map;
	}
	
	@PostMapping("user/nickname/update")
	public Map<String, Object> nicknameupdate(@RequestBody UserDTO vo, HttpSession session){
		
		Map<String, Object> map = new HashMap<String, Object>();
		UserDTO userSession = new UserDTO();
		Boolean success = false;
		
		
		userSession = (UserDTO) session.getAttribute("userSession");
		vo.setUser_id(userSession.getUser_id());
		
		int successInt = myPageService.updateNickname(vo);
		
		if(successInt > 0) {
			success = true;
		}
		
		map.put("success", success);
		
		
		return map;
	}
	
	
	@PostMapping("user/password/update")
	public Map<String, Object> passwordupdate(@RequestBody UserDTO vo, HttpSession session) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		Boolean success = false;
		String sessionPassword = "";
		int successInt = 0;
		
		UserDTO userSession = (UserDTO) session.getAttribute("userSession");
		vo.setUser_id(userSession.getUser_id());
		
		sessionPassword = myPageService.getUserPass(userSession.getUser_id());
		
		if(vo.getCurrentPassword().equals(sessionPassword)) {
			successInt = myPageService.updatePassword(vo);
			if(successInt > 0) {
				success = true;
			}
			
		}
		
		map.put("success", success);
		
		
		return map;
	}
	


	/**
	 * 관리자용 시험 목록 조회 API
	 * 
	 * @return Map<String, Object> 시험 목록과 성공 여부
	 */
	@GetMapping("/admin/tests")
	public Map<String, Object> getAllTestsForAdmin() {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("📝 관리자 시험 목록 조회 요청 받음");
			
			// 서비스에서 시험 목록 조회
			Map<String, Object> testInfoMap = myPageService.getAllTestsForAdmin();
			
			List<TestDTO> testList = (List<TestDTO>) testInfoMap.get("testList");
			List<UserDTO> userList = (List<UserDTO>) testInfoMap.get("userList");

			// 디버깅용 로그
			System.out.println("📊 시험 데이터 개수: " + testList.size());
			System.out.println("📊 사용자 데이터 개수: " + userList.size());
			
			for(TestDTO test : testList) {
				// user_id에 해당하는 UserDTO 찾기
				UserDTO user = userList.stream()
					.filter(u -> u.getUser_id() == test.getUser_id())
					.findFirst()
					.orElse(null);
				
				String companyName = user != null ? user.getNickname() : "회사 " + test.getUser_id();
				
				System.out.println("시험 ID: " + test.getTest_id() + 
					", 제목: " + test.getTitle() + 
					", 회사명: " + companyName + 
					", 난이도(난이도 ID): " + test.getLevel_id());
			}

			response.put("success", true);
			response.put("tests", testList);
			response.put("users", userList);
			response.put("message", "시험 목록 조회 성공");
			response.put("total", testList.size());

			System.out.println("✅ 시험 목록 조회 성공: " + testList.size() + "개");
			
			return response;
			
		} catch (Exception e) {
			System.err.println("❌ 시험 목록 조회 API 오류: " + e.getMessage());
			e.printStackTrace();
			
			response.put("success", false);
			response.put("message", "시험 목록 조회에 실패했습니다.");
			response.put("error", e.getMessage());
			
			return response;
		}
	}

	/**
	 * 관리자용 시험 삭제 API
	 * 
	 * @param testId 삭제할 시험 ID
	 * @return Map<String, Object> 삭제 결과
	 */
	@DeleteMapping("/admin/tests/{testId}")
	public Map<String, Object> deleteTest(@PathVariable Integer testId) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("🗑️ 관리자 시험 삭제 요청 받음 - 시험 ID: " + testId);
			
			// 서비스에서 시험 삭제
			boolean deleteResult = myPageService.deleteTestForAdmin(testId);
			
			if (deleteResult) {
				response.put("success", true);
				response.put("message", "시험이 성공적으로 삭제되었습니다.");
				System.out.println("✅ 시험 삭제 성공 - 시험 ID: " + testId);
			} else {
				response.put("success", false);
				response.put("message", "시험을 찾을 수 없습니다.");
				System.out.println("❌ 시험 삭제 실패 - 시험을 찾을 수 없음: " + testId);
			}
			
			return response;
			
		} catch (Exception e) {
			System.err.println("❌ 시험 삭제 API 오류: " + e.getMessage());
			e.printStackTrace();
			
			response.put("success", false);
			response.put("message", "시험 삭제에 실패했습니다.");
			response.put("error", e.getMessage());
			
			return response;
		}
	}

	/**
	 * 관리자용 게시글 목록 조회 API
	 * 
	 * @return Map<String, Object> 게시글 목록과 성공 여부
	 */
	@GetMapping("/admin/posts")
	public Map<String, Object> getAllPostsForAdmin() {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("📝 관리자 게시글 목록 조회 요청 받음");
			
			// 서비스에서 게시글 목록 조회
			Map<String, Object> postInfoMap = myPageService.getAllPostsForAdmin();
			
			List<PostsDTO> postList = (List<PostsDTO>) postInfoMap.get("postList");
			List<PostCategoryDTO> postCategoriesList = (List<PostCategoryDTO>) postInfoMap.get("postCategoriesList");
			List<UserDTO> userList = (List<UserDTO>) postInfoMap.get("userList");

			// 디버깅용 로그
			System.out.println("📊 게시글 데이터 개수: " + postList.size());
			System.out.println("📊 게시글 카테고리 데이터 개수: " + postCategoriesList.size());
			System.out.println("📊 사용자 데이터 개수: " + userList.size());
			
			for(PostsDTO post : postList) {
				// user_id에 해당하는 UserDTO 찾기
				UserDTO user = userList.stream()
					.filter(u -> u.getUser_id() == post.getUser_id())
					.findFirst()
					.orElse(null);
				
				// category_id에 해당하는 PostCategoryDTO 찾기
				PostCategoryDTO category = postCategoriesList.stream()
					.filter(c -> c.getCategory_id() == post.getCategory_id())
					.findFirst()
					.orElse(null);
				
				String authorName = user != null ? user.getNickname() : "작성자 " + post.getUser_id();
				String categoryName = category != null ? category.getName() : "카테고리 " + post.getCategory_id();
				
				System.out.println("게시글 ID: " + post.getPost_id() + 
					", 제목: " + post.getTitle() + 
					", 작성자: " + authorName + 
					", 카테고리: " + categoryName + 
					", 조회수: " + post.getViews() + 
					", 작성일: " + post.getCreated_at());
			}

			response.put("success", true);
			response.put("posts", postList);
			response.put("categories", postCategoriesList);
			response.put("users", userList);
			response.put("message", "게시글 목록 조회 성공");
			response.put("total", postList.size());

			System.out.println("✅ 게시글 목록 조회 성공: " + postList.size() + "개");
			
			return response;
			
		} catch (Exception e) {
			System.err.println("❌ 게시글 목록 조회 API 오류: " + e.getMessage());
			e.printStackTrace();
			
			response.put("success", false);
			response.put("message", "게시글 목록 조회에 실패했습니다.");
			response.put("error", e.getMessage());
			
			return response;
		}
	}

	/**
	 * 관리자용 게시글 삭제 API
	 * 
	 * @param postId 삭제할 게시글 ID
	 * @return Map<String, Object> 삭제 결과
	 */
	@DeleteMapping("/admin/posts/{postId}")
	public Map<String, Object> deletePost(@PathVariable Integer postId) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("🗑️ 관리자 게시글 삭제 요청 받음 - 게시글 ID: " + postId);
			
			// 서비스에서 게시글 삭제
			boolean deleteResult = myPageService.deletePostForAdmin(postId);
			
			if (deleteResult) {
				response.put("success", true);
				response.put("message", "게시글이 성공적으로 삭제되었습니다.");
				System.out.println("✅ 게시글 삭제 성공 - 게시글 ID: " + postId);
			} else {
				response.put("success", false);
				response.put("message", "게시글 삭제에 실패했습니다.");
				System.err.println("❌ 게시글 삭제 실패 - 게시글 ID: " + postId);
			}
			
			return response;
			
		} catch (Exception e) {
			System.err.println("❌ 게시글 삭제 API 오류: " + e.getMessage());
			e.printStackTrace();
			
			response.put("success", false);
			response.put("message", "게시글 삭제 중 오류가 발생했습니다.");
			response.put("error", e.getMessage());
			
			return response;
		}
	}
	
	@GetMapping("/company/mypage")
	public Map<String, Object> companymypage(HttpSession session) {
		
		System.out.println("기업 페이지 컨트롤러 진입");
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> testInfoMap = new HashMap<String, Object>();
		Map<String, Object> testSubInfoMap = new HashMap<String, Object>();
		UserDTO userSession = new UserDTO();
		
		userSession = (UserDTO) session.getAttribute("userSession");
		
		testInfoMap = myPageService.getTestInfo(userSession.getUser_id());
		
		testSubInfoMap = myPageService.getTestSubInfo(userSession.getUser_id());
		
		map.put("companyName", userSession.getNickname());
		map.put("testList", testInfoMap.get("testList"));
		map.put("testCategoryList", testInfoMap.get("testCategoryList"));
		map.put("testLevelList", testInfoMap.get("testLevelList"));
		map.put("testSubUserList", testSubInfoMap.get("testSubUserList"));
		map.put("testIdTitleList", testSubInfoMap.get("testIdTitleList"));
		map.put("testSubList", testSubInfoMap.get("testSubList"));
		
		
		
		
		return map;
	}
	
	@GetMapping("/user/test/result")
	public Map<String, Object> usertestresult(@RequestParam int user_id, @RequestParam int test_id) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, Object> testSubDetailMap = new HashMap<String, Object>();
		
		TestDTO vo = new TestDTO();
		
		vo.setUser_id(user_id);
		vo.setTest_id(test_id);
		
		testSubDetailMap = myPageService.getTestSubDetail(vo);
		
		map.put("testSubDetailDTO", testSubDetailMap.get("testSubDetailDTO"));
		map.put("testSubAnswerDetailList", testSubDetailMap.get("testSubAnswerDetailList"));
		map.put("testProblemList", testSubDetailMap.get("testProblemList"));
		

		
		return map;
		
	}
	
	
} 