package com.spring.project.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.project.dto.challenge.ChallengeDTO;
import com.spring.project.dto.challenge.ChallengeLevelDTO;
import com.spring.project.dto.challenge.ChallengeCategoryDTO;
import com.spring.project.repository.ChallengeRepository;
import com.spring.project.service.ChallengeService;

/**
 * 챌린지 서비스 구현체
 * 챌린지 관련 비즈니스 로직을 처리합니다.
 */
@Service("challengeService")
public class ChallengeServiceImpl implements ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    /**
     * 🎯 챌린지 페이지용 데이터 조회 (필터링 지원)
     * @param difficulty 난이도 필터
     * @param category 카테고리 필터  
     * @param language 언어 필터
     * @return 필터링된 챌린지 관련 데이터
     */
    @Override
    public Map<String, Object> getAllChallengesForPage(String difficulty, String category, String language) {
        try {
            System.out.println("🎯 챌린지 페이지 데이터 조회 시작 - difficulty: " + difficulty + ", category: " + category + ", language: " + language);

            // 🎯 필터 파라미터와 함께 데이터 조회
            Map<String, Object> challengeInfoMap = challengeRepository.findAllChallengesForPage(difficulty, category, language);

            List<ChallengeDTO> challengeList = (List<ChallengeDTO>) challengeInfoMap.get("challengeList");
            List<ChallengeLevelDTO> levelsList = (List<ChallengeLevelDTO>) challengeInfoMap.get("levelsList");
            List<ChallengeCategoryDTO> categoriesList = (List<ChallengeCategoryDTO>) challengeInfoMap.get("categoriesList");
            Map<Integer, Integer> completedCountMap = (Map<Integer, Integer>) challengeInfoMap.get("completedCountMap");
            
            // 🔥 추가된 통계 데이터
            Integer totalCompletedUsers = (Integer) challengeInfoMap.get("totalCompletedUsers");
            Integer supportedLanguages = (Integer) challengeInfoMap.get("supportedLanguages");
            
            // 🔥 디버깅 로그 강화
            System.out.println("📈 DB 연동 통계:");
            System.out.println("   - 총 챌린지 수: " + challengeList.size() + "개");
            System.out.println("   - 총 완료자 수: " + (totalCompletedUsers != null ? totalCompletedUsers : 0) + "명 (실제 DB 데이터)");
            System.out.println("   - 지원 언어 수: " + (supportedLanguages != null ? supportedLanguages : 0) + "개 (실제 DB 데이터)");
            System.out.println("   - 난이도 종류: " + levelsList.size() + "개");
            System.out.println("   - 카테고리 종류: " + categoriesList.size() + "개");
            
            // 🔥 완료자 수가 0인 경우 디버깅 정보
            if (totalCompletedUsers == null || totalCompletedUsers == 0) {
                System.out.println("⚠️ 완료자 수가 0입니다. Challenge_sub 테이블에 데이터가 있는지 확인하세요.");
                System.out.println("💡 테스트용 더미 데이터를 생성하려면 다음 SQL을 실행하세요:");
                System.out.println("   INSERT INTO Challenge_sub (challenge_id, user_id, correct_answer, exp_count) VALUES (1, 1, 'test', 100);");
            }

            // 🔥 결과에 통계 데이터 추가
            challengeInfoMap.put("statistics", Map.of(
                "totalChallenges", challengeList.size(),
                "totalCompletedUsers", totalCompletedUsers != null ? totalCompletedUsers : 0,
                "supportedLanguages", supportedLanguages != null ? supportedLanguages : 0,
                "autoGrading", "24/7" // 이건 여전히 하드코딩
            ));

            System.out.println("챌린지 페이지 전체 데이터 조회 성공: " + challengeList.size() + "개");

            return challengeInfoMap;
        } catch (Exception e) {
            System.err.println("챌린지 페이지 데이터 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 전체 챌린지 목록을 조회합니다 (필터링 없음)
     * @return 전체 챌린지 목록
     */
    @Override
    public List<ChallengeDTO> getAllChallenges() {
        try {
            System.out.println("전체 챌린지 목록 조회 시작");

            List<ChallengeDTO> challenges = challengeRepository.findAllChallenges();

            System.out.println("전체 챌린지 목록 조회 성공: " + challenges.size() + "개");

            return challenges;
        } catch (Exception e) {
            System.err.println("챌린지 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 특정 챌린지의 상세 정보를 조회합니다
     * @param challengeId 챌린지 ID
     * @return 챌린지 상세 정보
     */
    @Override
    public ChallengeDTO getChallengeById(Integer challengeId) {
        try {
            System.out.println("챌린지 상세 조회 시작 - ID: " + challengeId);

            ChallengeDTO challenge = challengeRepository.findChallengeById(challengeId);

            if (challenge != null) {
                System.out.println("챌린지 상세 조회 성공: " + challenge.getChallenge_title());
            } else {
                System.out.println("해당 ID의 챌린지를 찾을 수 없습니다: " + challengeId);
            }

            return challenge;
        } catch (Exception e) {
            System.err.println("챌린지 상세 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 모든 난이도 목록을 조회합니다
     * @return 난이도 목록
     */
    @Override
    public List<ChallengeLevelDTO> getAllLevels() {
        try {
            List<ChallengeLevelDTO> levels = challengeRepository.findAllLevels();
            System.out.println("난이도 목록 조회 성공: " + levels.size() + "개");
            return levels;
        } catch (Exception e) {
            System.err.println("난이도 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 모든 카테고리 목록을 조회합니다
     * @return 카테고리 목록
     */
    @Override
    public List<ChallengeCategoryDTO> getAllCategories() {
        try {
            List<ChallengeCategoryDTO> categories = challengeRepository.findAllCategories();
            System.out.println("카테고리 목록 조회 성공: " + categories.size() + "개");
            return categories;
        } catch (Exception e) {
            System.err.println("카테고리 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 챌린지 통계 정보를 조회합니다
     * @return 통계 정보 맵
     */
    @Override
    public Map<String, Object> getChallengeStatistics() {
        try {
            Map<String, Object> statistics = new HashMap<>();

            // 전체 챌린지 수
            int totalChallenges = challengeRepository.getTotalChallengeCount();

            // 통계 정보 구성
            statistics.put("totalChallenges", totalChallenges);
            statistics.put("supportedLanguages", 7); // 하드코딩된 값, 추후 DB에서 계산
            statistics.put("totalParticipants", 15000); // 하드코딩된 값, 추후 실제 계산

            System.out.println("챌린지 통계 조회 성공 - 총 " + totalChallenges + "개 챌린지");

            return statistics;
        } catch (Exception e) {
            System.err.println("챌린지 통계 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 특정 챌린지의 완료자 수를 조회합니다
     * @param challengeId 챌린지 ID
     * @return 완료자 수
     */
    @Override
    public int getCompletedCount(Integer challengeId) {
        try {
            int count = challengeRepository.getCompletedCount(challengeId);
            System.out.println("챌린지 완료자 수 조회 성공 - ID: " + challengeId + ", 완료자: " + count + "명");
            return count;
        } catch (Exception e) {
            System.err.println("챌린지 완료자 수 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 전체 챌린지 수를 조회합니다
     * @return 전체 챌린지 수
     */
    @Override
    public int getTotalChallengeCount() {
        try {
            int count = challengeRepository.getTotalChallengeCount();
            System.out.println("전체 챌린지 수 조회 성공: " + count + "개");
            return count;
        } catch (Exception e) {
            System.err.println("전체 챌린지 수 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🎯 개별 챌린지 상세 정보와 통계를 조회합니다
     * @param challengeId 챌린지 ID
     * @return 챌린지 상세 정보와 통계
     */
    @Override
    public Map<String, Object> getChallengeDetailById(Integer challengeId) {
        try {
            System.out.println("🎯 챌린지 상세 조회 시작 - ID: " + challengeId);

            // 1. 챌린지 기본 정보 조회
            ChallengeDTO challenge = challengeRepository.findChallengeById(challengeId);
            if (challenge == null) {
                System.out.println("해당 ID의 챌린지를 찾을 수 없습니다: " + challengeId);
                return null;
            }

            // 2. 난이도 정보 조회
            ChallengeLevelDTO level = challengeRepository.findLevelById(challenge.getLevel_id());

            // 3. 카테고리 정보 조회
            ChallengeCategoryDTO category = challengeRepository.findCategoryById(challenge.getCategory_id());

            // 4. 통계 정보 조회 (제출수, 정답수, 정답률)
            Map<String, Object> statistics = challengeRepository.getChallengeStatistics(challengeId);

            // 5. 결과 맵 구성
            Map<String, Object> challengeDetailMap = new HashMap<>();
            challengeDetailMap.put("challenge", challenge);
            challengeDetailMap.put("level", level);
            challengeDetailMap.put("category", category);
            challengeDetailMap.put("statistics", statistics);

            System.out.println("챌린지 상세 조회 성공: " + challenge.getChallenge_title());
            System.out.println("📊 통계 정보: " + statistics);

            return challengeDetailMap;

        } catch (Exception e) {
            System.err.println("챌린지 상세 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🎯 새로운 챌린지를 등록합니다
     * @param challengeDTO 등록할 챌린지 정보
     * @return 등록 성공 여부
     */
    @Override
    public boolean registerChallenge(ChallengeDTO challengeDTO) {
        try {
            System.out.println("챌린지 등록 시작: " + challengeDTO.getChallenge_title());
            
            int result = challengeRepository.insertChallenge(challengeDTO);
            
            if (result > 0) {
                System.out.println("챌린지 등록 성공: " + challengeDTO.getChallenge_title());
                return true;
            } else {
                System.err.println("챌린지 등록 실패: DB 삽입 결과 0");
                return false;
            }
            
        } catch (Exception e) {
            System.err.println("챌린지 등록 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 🎯 모든 챌린지 레벨을 조회합니다 (등록용)
     * @return 레벨 목록
     */
    @Override
    public List<ChallengeLevelDTO> getAllChallengeLevels() {
        try {
            List<ChallengeLevelDTO> levels = challengeRepository.findAllLevels();
            System.out.println("레벨 목록 조회 성공 (등록용): " + levels.size() + "개");
            return levels;
        } catch (Exception e) {
            System.err.println("레벨 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🎯 모든 챌린지 카테고리를 조회합니다 (등록용)
     * @return 카테고리 목록
     */
    @Override
    public List<ChallengeCategoryDTO> getAllChallengeCategories() {
        try {
            List<ChallengeCategoryDTO> categories = challengeRepository.findAllCategories();
            System.out.println("카테고리 목록 조회 성공 (등록용): " + categories.size() + "개");
            return categories;
        } catch (Exception e) {
            System.err.println("카테고리 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🎯 모든 챌린지 지원 언어를 조회합니다 (등록용)
     * @return 언어 목록
     */
    @Override
    public List<String> getAllChallengeLanguages() {
        try {
            List<String> languages = challengeRepository.findAllLanguages();
            System.out.println("언어 목록 조회 성공 (등록용): " + languages.size() + "개");
            return languages;
        } catch (Exception e) {
            System.err.println("언어 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🎯 챌린지를 삭제합니다
     * @param challengeId 삭제할 챌린지 ID
     * @return 삭제 성공 여부
     */
    @Override
    public boolean deleteChallenge(Integer challengeId) {
        try {
            System.out.println("챌린지 삭제 시작: ID " + challengeId);
            
            int result = challengeRepository.deleteChallenge(challengeId);
            
            if (result > 0) {
                System.out.println("챌린지 삭제 성공: ID " + challengeId);
                return true;
            } else {
                System.err.println("챌린지 삭제 실패: 해당 ID의 챌린지를 찾을 수 없습니다. ID " + challengeId);
                return false;
            }
            
        } catch (Exception e) {
            System.err.println("챌린지 삭제 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}