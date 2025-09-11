package com.spring.project.service;

import java.util.List;
import java.util.Map;

import com.spring.project.dto.challenge.ChallengeDTO;
import com.spring.project.dto.challenge.ChallengeSubDTO;
import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.user.UserDTO;
import com.spring.project.dto.user.UserGradeDTO;

/**
 * 마이페이지 관련 비즈니스 로직을 처리하는 서비스 인터페이스
 */
public interface MyPageService {

    /**
     * 관리자용 회원 목록을 조회합니다.
     *
     * @return 회원 목록
     */
    Map<String, Object> getAllUsersForAdmin();

    /**
     * 전체 회원 수를 조회합니다.
     *
     * @return 전체 회원 수
     */
    int getTotalUserCount();

    /**
     * 관리자용 문제 목록을 조회합니다.
     * Challenges, ChallengeLevels, ChallengeCategories 테이블을 JOIN하여 상세 정보를 가져옵니다.
     *
     * @return 문제 목록 (ChallengeDTO, ChallengeLevelDTO, ChallengeCategoryDTO 조합)
     */
    Map<String, Object> getAllProblemsForAdmin();

    /**
     * 관리자용 통계 데이터를 조회합니다.
     * 전체 회원수, 게시글수, 시험수, 문제수를 포함한 통계 정보를 반환합니다.
     *
     * @return 통계 데이터 (Map<String, Object>)
     */
    Map<String, Object> getAdminStats();

    /**
     * 관리자용 상품 목록을 조회합니다.
     * Products 테이블에서 상품 정보를 가져옵니다.
     *
     * @return 상품 목록 (ProductDTO)
     */
    Map<String, Object> getAllProductsForAdmin();

    /**
     * 전체 상품 수를 조회합니다.
     *
     * @return 전체 상품 수
     */
    int getTotalProductCount();
    
    public Map<String, Object> getUserChallengeSub(int user_id);
    
    public Map<String, Object> getUserPostInfo(int user_id);
    
    public UserGradeDTO getUserGrade(int user_id);
    
    public int updateNickname(UserDTO vo);
    
    public String getUserPass(int user_id);
    
    public int updatePassword(UserDTO vo);
    
    public Map<String, Object> getTestInfo(int user_id);
    
    public Map<String, Object> getTestSubInfo(int user_id);
    
    public Map<String, Object> getTestSubDetail(TestDTO vo);

    /**
     * 관리자용 시험 목록을 조회합니다.
     * Tests 테이블에서 시험 정보를 가져옵니다.
     *
     * @return 시험 목록 (TestDTO)
     */
    Map<String, Object> getAllTestsForAdmin();

    /**
     * 관리자용 시험을 삭제합니다.
     * Tests 테이블에서 지정된 시험을 삭제합니다.
     *
     * @param testId 삭제할 시험 ID
     * @return 삭제 성공 여부
     */
    boolean deleteTestForAdmin(int testId);

    /**
     * 관리자용 게시글 목록을 조회합니다.
     * Posts, PostCategories, Users 테이블을 JOIN하여 상세 정보를 가져옵니다.
     *
     * @return 게시글 목록 (PostsDTO, PostCategoryDTO, UserDTO 조합)
     */
    Map<String, Object> getAllPostsForAdmin();

    /**
     * 관리자용 게시글을 삭제합니다.
     * Posts 테이블에서 지정된 게시글을 삭제합니다.
     *
     * @param postId 삭제할 게시글 ID
     * @return 삭제 성공 여부
     */
    boolean deletePostForAdmin(int postId);
}