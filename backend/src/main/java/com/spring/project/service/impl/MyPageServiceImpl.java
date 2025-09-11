package com.spring.project.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.project.dto.challenge.ChallengeDTO;
import com.spring.project.dto.challenge.ChallengeSubDTO;
import com.spring.project.dto.test.TestDTO;
import com.spring.project.dto.user.UserDTO;
import com.spring.project.dto.user.UserGradeDTO;
import com.spring.project.repository.MyPageRepository;
import com.spring.project.service.MyPageService;

import java.util.List;
import java.util.Map;

/**
 * 마이페이지 서비스 구현체
 * 마이페이지 관련 비즈니스 로직을 처리합니다.
 */
@Service("myPageService")
public class MyPageServiceImpl implements MyPageService{

    @Autowired
    private MyPageRepository myPageRepository;
    
    /**
     * 관리자용 회원 목록을 조회합니다.
     * @return 회원 목록
     */
    @Override
    public Map<String, Object> getAllUsersForAdmin() {
        try {
            Map<String, Object> userInfoMap = myPageRepository.findAllUsersForAdmin();
            return userInfoMap;
        } catch (Exception e) {
            System.err.println("회원 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * 전체 회원 수를 조회합니다.
     * @return 전체 회원 수
     */
    @Override
    public int getTotalUserCount() {
        try {
            int count = myPageRepository.getTotalUserCount();
            System.out.println("전체 회원 수 조회 성공: " + count + "명");
            return count;
        } catch (Exception e) {
            System.err.println("전체 회원 수 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 관리자용 문제 목록을 조회합니다.
     * Challenges, ChallengeLevels, ChallengeCategories 테이블을 JOIN하여 상세 정보를 가져옵니다.
     * @return 문제 목록 (ChallengeDTO, ChallengeLevelDTO, ChallengeCategoryDTO 조합)
     */
    @Override
    public Map<String, Object> getAllProblemsForAdmin() {
        try {
            System.out.println("🎯 관리자용 문제 목록 조회 시작");
            Map<String, Object> problemInfoMap = myPageRepository.findAllProblemsForAdmin();
            System.out.println("✅ 관리자용 문제 목록 조회 성공");
            return problemInfoMap;
        } catch (Exception e) {
            System.err.println("❌ 문제 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 관리자용 통계 데이터를 조회합니다.
     * 전체 회원수, 게시글수, 시험수, 문제수를 포함한 통계 정보를 반환합니다.
     * @return 통계 데이터 (Map<String, Object>)
     */
    @Override
    public Map<String, Object> getAdminStats() {
        try {
            System.out.println("📊 관리자용 통계 데이터 조회 시작");
            Map<String, Object> statsData = myPageRepository.getAdminStats();
            System.out.println("✅ 관리자용 통계 데이터 조회 성공");
            return statsData;
        } catch (Exception e) {
            System.err.println("❌ 통계 데이터 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 관리자용 상품 목록을 조회합니다.
     * Products 테이블에서 상품 정보를 가져옵니다.
     * @return 상품 목록 (ProductDTO)
     */
    @Override
    public Map<String, Object> getAllProductsForAdmin() {
        try {
            System.out.println("🛍️ 관리자용 상품 목록 조회 시작");
            Map<String, Object> productInfoMap = myPageRepository.findAllProductsForAdmin();
            System.out.println("✅ 관리자용 상품 목록 조회 성공");
            return productInfoMap;
        } catch (Exception e) {
            System.err.println("❌ 상품 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 전체 상품 수를 조회합니다.
     * @return 전체 상품 수
     */
    @Override
    public int getTotalProductCount() {
        try {
            int count = myPageRepository.getTotalProductCount();
            System.out.println("전체 상품 수 조회 성공: " + count + "개");
            return count;
        } catch (Exception e) {
            System.err.println("전체 상품 수 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

	@Override
	public Map<String, Object> getUserChallengeSub(int user_id) {
		return myPageRepository.getUserChallengeSub(user_id);
	}
	
	@Override
	public Map<String, Object> getUserPostInfo(int user_id) {
		return myPageRepository.getUserPostInfo(user_id);
	}

	@Override
	public UserGradeDTO getUserGrade(int user_id) {
		
		return myPageRepository.getUserGrade(user_id);
	}

	@Override
	public int updateNickname(UserDTO vo) {

		return myPageRepository.updateNickname(vo);
	}
	
	public String getUserPass(int user_id) {
		return myPageRepository.getUserPass(user_id);
	}

	@Override
	public int updatePassword(UserDTO vo) {
		
		return myPageRepository.updatePassword(vo);
	}

    /**
     * 관리자용 시험 목록을 조회합니다.
     * Tests 테이블에서 시험 정보를 가져옵니다.
     * @return 시험 목록 (TestDTO)과 사용자 목록 (UserDTO)
     */
    @Override
    public Map<String, Object> getAllTestsForAdmin() {
        try {
            System.out.println("📝 관리자용 시험 목록 조회 시작");
            Map<String, Object> testInfoMap = myPageRepository.findAllTestsForAdmin();
            
            // 사용자 목록도 함께 가져오기
            Map<String, Object> userInfoMap = myPageRepository.findAllUsersForAdmin();
            testInfoMap.put("userList", userInfoMap.get("userList"));
            
            System.out.println("✅ 관리자용 시험 목록 조회 성공");
            return testInfoMap;
        } catch (Exception e) {
            System.err.println("❌ 시험 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
	@Override
	public Map<String, Object> getTestInfo(int user_id) {
		
		return myPageRepository.getTestInfo(user_id);
	}


    /**
     * 관리자용 시험을 삭제합니다.
     * Tests 테이블에서 지정된 시험을 삭제합니다.
     * @param testId 삭제할 시험 ID
     * @return 삭제 성공 여부
     */
    @Override
    public boolean deleteTestForAdmin(int testId) {
        try {
            System.out.println("🗑️ 관리자용 시험 삭제 시작 - 시험 ID: " + testId);
            boolean result = myPageRepository.deleteTest(testId);
            System.out.println("✅ 관리자용 시험 삭제 성공: " + result);
            return result;
        } catch (Exception e) {
            System.err.println("❌ 시험 삭제 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 관리자용 게시글 목록을 조회합니다.
     * Posts, PostCategories, Users 테이블을 JOIN하여 상세 정보를 가져옵니다.
     * @return 게시글 목록 (PostsDTO, PostCategoryDTO, UserDTO 조합)
     */
    @Override
    public Map<String, Object> getAllPostsForAdmin() {
        try {
            System.out.println("📝 관리자용 게시글 목록 조회 시작");
            Map<String, Object> postInfoMap = myPageRepository.findAllPostsForAdmin();
            System.out.println("✅ 관리자용 게시글 목록 조회 성공");
            return postInfoMap;
        } catch (Exception e) {
            System.err.println("❌ 게시글 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 관리자용 게시글을 삭제합니다.
     * Posts 테이블에서 지정된 게시글을 삭제합니다.
     * @param postId 삭제할 게시글 ID
     * @return 삭제 성공 여부
     */
    @Override
    public boolean deletePostForAdmin(int postId) {
        try {
            System.out.println("🗑️ 관리자용 게시글 삭제 시작 - 게시글 ID: " + postId);
            boolean result = myPageRepository.deletePost(postId);
            System.out.println("✅ 관리자용 게시글 삭제 성공: " + result);
            return result;
        } catch (Exception e) {
            System.err.println("❌ 게시글 삭제 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

	@Override
	public Map<String, Object> getTestSubInfo(int user_id) {
		return myPageRepository.getTestSubInfo(user_id);
	}

	@Override
	public Map<String, Object> getTestSubDetail(TestDTO vo) {
		return myPageRepository.getTestSubDetail(vo);
	}
	

} 