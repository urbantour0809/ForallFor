package com.spring.project.repository;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.spring.project.dto.user.UserDTO;
import com.spring.project.dto.user.UserGradeDTO;
import com.spring.project.dto.challenge.ChallengeDTO;
import com.spring.project.dto.challenge.ChallengeLevelDTO;
import com.spring.project.dto.challenge.ChallengeSubDTO;
import com.spring.project.dto.post.PostCategoryDTO;
import com.spring.project.dto.post.PostsDTO;
import com.spring.project.dto.challenge.ChallengeCategoryDTO;
import com.spring.project.dto.product.ProductDTO;
import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.post.PostsDTO;
import com.spring.project.dto.post.PostCategoryDTO;
import com.spring.project.dto.test.TestAnswerDetailDTO;
import com.spring.project.dto.test.TestCategoryDTO;
import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.test.TestLevelDTO;
import com.spring.project.dto.test.TestProblemDTO;
import com.spring.project.dto.test.TestSubDTO;

@Repository
public class MyPageRepository {

   @Autowired
   SqlSessionTemplate mybatis;
   
   /**
    * 관리자용 회원 목록을 조회합니다.
    * USERS와 USER_GRADES 테이블을 JOIN하여 상세 정보를 가져옵니다.
    */
   public Map<String, Object> findAllUsersForAdmin() {
       
       Map<String, Object> userInfoMap = new HashMap<>();

       List<UserDTO> userList = mybatis.selectList("myPageRepository.findAllUsersForAdmin");
       List<UserGradeDTO> userGradesList = mybatis.selectList("myPageRepository.findAllUserGrades");

       userInfoMap.put("userList", userList);
       userInfoMap.put("userGradesList", userGradesList);

       return userInfoMap;
   }
   
   /**
    * 관리자용 문제 목록을 조회합니다.
    * Challenges, ChallengeLevels, ChallengeCategories 테이블을 JOIN하여 상세 정보를 가져옵니다.
    */
   public Map<String, Object> findAllProblemsForAdmin() {
       
       Map<String, Object> problemInfoMap = new HashMap<>();

       List<ChallengeDTO> problemList = mybatis.selectList("myPageRepository.findAllProblemsForAdmin");
       List<ChallengeLevelDTO> problemLevelsList = mybatis.selectList("myPageRepository.findAllProblemLevels");
       List<ChallengeCategoryDTO> problemCategoriesList = mybatis.selectList("myPageRepository.findAllProblemCategories");

       problemInfoMap.put("problemList", problemList);
       problemInfoMap.put("problemLevelsList", problemLevelsList);
       problemInfoMap.put("problemCategoriesList", problemCategoriesList);

       return problemInfoMap;
   }
   
   /**
    * 전체 회원 수를 조회합니다.
    */
   public int getTotalUserCount() {
       return mybatis.selectOne("myPageRepository.getTotalUserCount");
   }
   
   /**
    * 관리자용 통계 데이터를 조회합니다.
    * 전체 회원수, 게시글수, 시험수, 문제수를 포함한 통계 정보를 반환합니다.
    */
   public Map<String, Object> getAdminStats() {
       Map<String, Object> statsMap = new HashMap<>();
       
       // 각 통계 데이터 조회
       int totalUsers = mybatis.selectOne("myPageRepository.getTotalUserCount");
       int totalPosts = mybatis.selectOne("myPageRepository.getTotalPostCount");
       int totalTests = mybatis.selectOne("myPageRepository.getTotalTestCount");
       int totalProblems = mybatis.selectOne("myPageRepository.getTotalProblemCount");
       int totalProducts = mybatis.selectOne("myPageRepository.getTotalProductCount");
       
       statsMap.put("totalUsers", totalUsers);
       statsMap.put("totalPosts", totalPosts);
       statsMap.put("totalTests", totalTests);
       statsMap.put("totalProblems", totalProblems);
       statsMap.put("totalProducts", totalProducts);
       
       return statsMap;
   }
   
   /**
    * 관리자용 상품 목록을 조회합니다.
    * Products 테이블에서 상품 정보를 가져옵니다.
    */
   public Map<String, Object> findAllProductsForAdmin() {
       
       Map<String, Object> productInfoMap = new HashMap<>();

       List<ProductDTO> productList = mybatis.selectList("myPageRepository.findAllProductsForAdmin");

       productInfoMap.put("productList", productList);

       return productInfoMap;
   }
   
   /**
    * 전체 상품 수를 조회합니다.
    */
   public int getTotalProductCount() {
       return mybatis.selectOne("myPageRepository.getTotalProductCount");
   }
   
   /**
    * 관리자용 시험 목록을 조회합니다.
    * Tests 테이블에서 시험 정보를 가져옵니다.
    */
   public Map<String, Object> findAllTestsForAdmin() {
       
       Map<String, Object> testInfoMap = new HashMap<>();

       List<TestDTO> testList = mybatis.selectList("myPageRepository.findAllTestsForAdmin");

       testInfoMap.put("testList", testList);

       return testInfoMap;
   }
   
   /**
    * 관리자용 시험을 삭제합니다.
    * Tests 테이블에서 지정된 시험을 삭제합니다.
    */
   public boolean deleteTest(Integer testId) {
       int result = mybatis.delete("myPageRepository.deleteTest", testId);
       return result > 0;
   }
   
   /**
    * DB 연결 테스트용 메서드
    */
   public int testConnection() {
       return mybatis.selectOne("myPageRepository.testConnection");
   }
   
   public Map<String, Object> getUserChallengeSub(int user_id) {
	// challengesDTO, challengeSubDTO, challengeLevelDTO, challengeCategoryDTO
	   Map<String, Object> userChallengeSubInfoMap = new HashMap<String, Object>();
	   List<ChallengeDTO> userChallengeSubTitleList = new ArrayList<ChallengeDTO>();
	   List<ChallengeSubDTO> userChallengeSubPassList = new ArrayList<ChallengeSubDTO>();
	   List<ChallengeLevelDTO> userChallengeSubLevelList = new ArrayList<ChallengeLevelDTO>();
	   List<ChallengeCategoryDTO> userChallengeSubCategoryList = new ArrayList<ChallengeCategoryDTO>();
	   //challengesDTO
	   userChallengeSubTitleList = mybatis.selectList("myPageRepository.getUserChallengeTitleList", user_id);
	   
	   //challengeSubDTO
	   userChallengeSubPassList = mybatis.selectList("myPageRepository.getUserChallengePassList", user_id);
	   
	   //challengeLevelDTO
	   userChallengeSubLevelList = mybatis.selectList("myPageRepository.getUserChallengeLevelList", user_id);
	   
	   //challengeCategoryDTO
	   userChallengeSubCategoryList = mybatis.selectList("myPageRepository.getUserChallengeCategoryList", user_id);
	   
	   userChallengeSubInfoMap.put("userChallengeSubTitleList", userChallengeSubTitleList);
	   userChallengeSubInfoMap.put("userChallengeSubPassList", userChallengeSubPassList);
	   userChallengeSubInfoMap.put("userChallengeSubLevelList", userChallengeSubLevelList);
	   userChallengeSubInfoMap.put("userChallengeSubCategoryList", userChallengeSubCategoryList);
	   
	   return userChallengeSubInfoMap;
   }
   
   public Map<String, Object> getUserPostInfo(int user_id){
	   
	   Map<String, Object> userPostInfoMap = new HashMap<String, Object>();
	   List<PostsDTO> userPostList = new ArrayList<PostsDTO>();
	   List<PostCategoryDTO> userPostCategoryList = new ArrayList<PostCategoryDTO>();
	   
	   userPostList = mybatis.selectList("myPageRepository.getUserPostList", user_id);
	   userPostCategoryList = mybatis.selectList("myPageRepository.getUserPostCategoryList", user_id);
	   
	   userPostInfoMap.put("userPostList", userPostList);
	   userPostInfoMap.put("userPostCategoryList", userPostCategoryList);
	   
	   return userPostInfoMap;
   }
   
   public UserGradeDTO getUserGrade(int user_id) {
	   return mybatis.selectOne("myPageRepository.getUserGrade", user_id);
   }
   
   public int updateNickname(UserDTO vo) {

	   return mybatis.update("myPageRepository.updateNickname", vo);
   }
   
   public String getUserPass(int user_id) {
	   UserDTO userDTO = new UserDTO();
	   
	   userDTO = mybatis.selectOne("myPageRepository.getUserPass", user_id); 
	   
	   return userDTO.getPassword();
   }
   
   public int updatePassword(UserDTO vo) {
	   return mybatis.update("myPageRepository.updatePassword", vo);
   }
   


   /**
    * 관리자용 게시글 목록을 조회합니다.
    * Posts, PostCategories, Users 테이블을 JOIN하여 상세 정보를 가져옵니다.
    */
   public Map<String, Object> findAllPostsForAdmin() {
       
       Map<String, Object> postInfoMap = new HashMap<>();

       List<PostsDTO> postList = mybatis.selectList("myPageRepository.findAllPostsForAdmin");
       List<PostCategoryDTO> postCategoriesList = mybatis.selectList("myPageRepository.findAllPostCategories");
       List<UserDTO> userList = mybatis.selectList("myPageRepository.findAllUsersForAdmin");

       postInfoMap.put("postList", postList);
       postInfoMap.put("postCategoriesList", postCategoriesList);
       postInfoMap.put("userList", userList);

       return postInfoMap;
   }

   /**
    * 관리자용 게시글을 삭제합니다.
    * Posts 테이블에서 지정된 게시글을 삭제합니다.
    */
   public boolean deletePost(int postId) {
       int result = mybatis.delete("myPageRepository.deletePost", postId);
       return result > 0;
   }

   public Map<String, Object> getTestInfo(int user_id){
	   
	   Map<String, Object> testInfoListMap = new HashMap<String, Object>();
	   List<TestDTO> testList = new ArrayList<TestDTO>();
	   List<TestCategoryDTO> testCategoryList = new ArrayList<TestCategoryDTO>();
	   List<TestLevelDTO> testLevelList = new ArrayList<TestLevelDTO>();
	   
 	   
	   //testDTO 
	   testList = mybatis.selectList("myPageRepository.getTestList", user_id);
	   //testCategoryDTO
	   testCategoryList = mybatis.selectList("myPageRepository.getTestCategoryList", user_id);
	   //testLevelDTO
	   testLevelList = mybatis.selectList("myPageRepository.getTestLevelList", user_id);


	   
	   testInfoListMap.put("testList", testList);
	   testInfoListMap.put("testCategoryList", testCategoryList);
	   testInfoListMap.put("testLevelList", testLevelList);
	   
	   return testInfoListMap;
   }
   
   public Map<String, Object> getTestSubInfo(int user_id){
	   
	   Map<String, Object> testSubInfoMap = new HashMap<String, Object>();
	   List<UserDTO> testSubUserList = new ArrayList<UserDTO>();
	   List<TestDTO> testIdTitleList = new ArrayList<TestDTO>();
	   List<TestSubDTO> testSubList = new ArrayList<TestSubDTO>();
	   
	   testSubUserList = mybatis.selectList("myPageRepository.getTestSubUser", user_id);
	   
	   testIdTitleList = mybatis.selectList("myPageRepository.getTestIdTitle", user_id);
	   
	   testSubList = mybatis.selectList("myPageRepository.getTestSub", user_id);
	   
	   
	   
	   testSubInfoMap.put("testSubUserList", testSubUserList);
	   testSubInfoMap.put("testIdTitleList", testIdTitleList);
	   testSubInfoMap.put("testSubList", testSubList);
	   
	   return testSubInfoMap;
	   
	   
   }
   
   public Map<String, Object> getTestSubDetail(TestDTO vo){
	   
	   Map<String, Object> testSubDetailMap = new HashMap<String, Object>();
	   TestSubDTO testSubDetailDTO = new TestSubDTO();
	   List<TestAnswerDetailDTO> testSubAnswerDetailList = new ArrayList<TestAnswerDetailDTO>();
	   List<TestProblemDTO> testProblemList = new ArrayList<TestProblemDTO>();
	   
	    //sub_id추출용
	   testSubDetailDTO = mybatis.selectOne("myPageRepository.testSubDetailList", vo);
		//sub_id -> test answer detail DTO 각 문제별 정답여부 리스트
	   testSubAnswerDetailList = mybatis.selectList("myPageRepository.testSubAnswerDetailList", vo);
		//test_id -> test_problem DTO 각 문제 정보 리스트
	   testProblemList = mybatis.selectList("myPageRepository.testProblemList", vo);
	   
	   testSubDetailMap.put("testSubDetailDTO", testSubDetailDTO);
	   testSubDetailMap.put("testSubAnswerDetailList", testSubAnswerDetailList);
	   testSubDetailMap.put("testProblemList", testProblemList);
	   
	   return testSubDetailMap;
	   
   }

   
   
   
} 