package com.spring.project.repository;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.spring.project.dto.challenge.ChallengeDTO;
import com.spring.project.dto.challenge.ChallengeLevelDTO;
import com.spring.project.dto.challenge.ChallengeCategoryDTO;

@Repository
public class ChallengeRepository {

    @Autowired
    SqlSessionTemplate mybatis;

    /**
     * 🎯 챌린지 페이지용 데이터를 조회합니다 (필터링 지원)
     * @param difficulty 난이도 필터 ("all", "beginner", "intermediate", "advanced")
     * @param category 카테고리 필터 ("all", "algorithm", "web", 등)
     * @param language 언어 필터 ("all", "Java", "Python", 등)
     * @return 필터링된 챌린지 관련 데이터
     */
    public Map<String, Object> findAllChallengesForPage(String difficulty, String category, String language) {
        Map<String, Object> challengeInfoMap = new HashMap<>();
        
        System.out.println("🎯 Repository - 필터 조건: difficulty=" + difficulty + ", category=" + category + ", language=" + language);
        
        // 🎯 1. 언어 필터에 따른 챌린지 목록 조회
        List<ChallengeDTO> challengeList;
        if ("all".equals(language)) {
            // 모든 언어의 챌린지 조회
            challengeList = mybatis.selectList("challengeRepository.findAllChallenges");
            System.out.println("📋 모든 언어의 챌린지 조회");
        } else {
            // 특정 언어의 챌린지만 조회
            challengeList = mybatis.selectList("challengeRepository.findChallengesByLanguage", language);
            System.out.println("📋 " + language + " 언어의 챌린지만 조회");
            System.out.println("🔍 조회된 챌린지 수: " + challengeList.size());
            
            // 🔥 각 챌린지의 언어 정보 출력
            for (ChallengeDTO challenge : challengeList) {
                System.out.println("   - " + challenge.getChallenge_title() + " (" + challenge.getLanguage() + ")");
            }
        }
        
        // 🔥 언어별 데이터 분포 확인
        System.out.println("🔍 언어별 챌린지 분포:");
        Map<String, Integer> languageCount = new HashMap<>();
        for (ChallengeDTO challenge : challengeList) {
            String lang = challenge.getLanguage();
            languageCount.put(lang, languageCount.getOrDefault(lang, 0) + 1);
        }
        System.out.println("📊 언어별 챌린지 수: " + languageCount);
        
        // 2. 모든 난이도 목록 조회
        List<ChallengeLevelDTO> levelsList = mybatis.selectList("challengeRepository.findAllLevels");
        
        // 3. 모든 카테고리 목록 조회
        List<ChallengeCategoryDTO> categoriesList = mybatis.selectList("challengeRepository.findAllCategories");
        
        // 🔥 4. 각 챌린지별 실제 완료자 수를 별도 Map으로 저장 (디버깅 강화)
        Map<Integer, Integer> completedCountMap = new HashMap<>();
        int totalCompletedUsers = 0; // 전체 완료자 수 계산
        
        for (ChallengeDTO challenge : challengeList) {
            try {
                Integer completedCount = mybatis.selectOne("challengeRepository.getCompletedCount", challenge.getChallenge_id());
                // null 체크 및 기본값 처리
                int actualCount = (completedCount != null) ? completedCount : 0;
                completedCountMap.put(challenge.getChallenge_id(), actualCount);
                totalCompletedUsers += actualCount;
                
                System.out.println("🔍 챌린지 ID " + challenge.getChallenge_id() + " (" + challenge.getChallenge_title() + ") 완료자 수: " + actualCount + "명");
            } catch (Exception e) {
                System.err.println("⚠️ 챌린지 ID " + challenge.getChallenge_id() + " 완료자 수 조회 실패: " + e.getMessage());
                completedCountMap.put(challenge.getChallenge_id(), 0); // 에러시 0으로 처리
            }
        }
        
        System.out.println("📊 전체 완료자 수 집계: " + totalCompletedUsers + "명");
        
        // 🔥 5. 지원 언어 수 계산 (디버깅 추가)
        Set<String> uniqueLanguages = new HashSet<>();
        for (ChallengeDTO challenge : challengeList) {
            if (challenge.getLanguage() != null && !challenge.getLanguage().trim().isEmpty()) {
                uniqueLanguages.add(challenge.getLanguage());
            }
        }
        System.out.println("💻 지원 언어 목록: " + uniqueLanguages + " (총 " + uniqueLanguages.size() + "개)");
        
        // 6. 결과 맵 구성 (MyPageRepository와 동일한 패턴)
        challengeInfoMap.put("challengeList", challengeList);
        challengeInfoMap.put("levelsList", levelsList);
        challengeInfoMap.put("categoriesList", categoriesList);
        challengeInfoMap.put("completedCountMap", completedCountMap);
        challengeInfoMap.put("totalCompletedUsers", totalCompletedUsers); // 🔥 전체 완료자 수 추가
        challengeInfoMap.put("supportedLanguages", uniqueLanguages.size()); // 🔥 지원 언어 수 추가
        
        return challengeInfoMap;
    }

    /**
     * 전체 챌린지 목록을 조회합니다 (필터링 없음)
     */
    public List<ChallengeDTO> findAllChallenges() {
        return mybatis.selectList("challengeRepository.findAllChallenges");
    }

    /**
     * 특정 챌린지의 상세 정보를 조회합니다
     */
    public ChallengeDTO findChallengeById(Integer challengeId) {
        return mybatis.selectOne("challengeRepository.findChallengeById", challengeId);
    }

    /**
     * 모든 난이도 목록을 조회합니다
     */
    public List<ChallengeLevelDTO> findAllLevels() {
        return mybatis.selectList("challengeRepository.findAllLevels");
    }

    /**
     * 모든 카테고리 목록을 조회합니다
     */
    public List<ChallengeCategoryDTO> findAllCategories() {
        return mybatis.selectList("challengeRepository.findAllCategories");
    }

    /**
     * 특정 챌린지의 완료자 수를 조회합니다
     */
    public int getCompletedCount(Integer challengeId) {
        return mybatis.selectOne("challengeRepository.getCompletedCount", challengeId);
    }

    /**
     * 전체 챌린지 수를 조회합니다
     */
    public int getTotalChallengeCount() {
        return mybatis.selectOne("challengeRepository.getTotalChallengeCount");
    }

    /**
     * 🎯 특정 챌린지의 통계 정보를 조회합니다 (제출수, 정답수, 정답률)
     * @param challengeId 챌린지 ID
     * @return 통계 정보 맵
     */
    public Map<String, Object> getChallengeStatistics(Integer challengeId) {
        try {
            System.out.println("🎯 챌린지 통계 조회 - ID: " + challengeId);
            
            // 제출수, 정답수, 정답률 조회
            Map<String, Object> statistics = mybatis.selectOne("challengeRepository.getChallengeStatistics", challengeId);
            
            if (statistics == null) {
                // 데이터가 없는 경우 기본값 설정
                statistics = new HashMap<>();
                statistics.put("totalSubmissions", 0);
                statistics.put("correctSubmissions", 0);
                statistics.put("accuracyRate", 0.0);
            }
            
            System.out.println("📊 챌린지 통계: " + statistics);
            return statistics;
            
        } catch (Exception e) {
            System.err.println("⚠️ 챌린지 통계 조회 실패: " + e.getMessage());
            e.printStackTrace();
            
            // 에러시 기본값 반환
            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("totalSubmissions", 0);
            defaultStats.put("correctSubmissions", 0);
            defaultStats.put("accuracyRate", 0.0);
            return defaultStats;
        }
    }

    /**
     * 🎯 특정 난이도 정보를 조회합니다 (ID로)
     * @param levelId 난이도 ID
     * @return 난이도 정보
     */
    public ChallengeLevelDTO findLevelById(Integer levelId) {
        try {
            System.out.println("🎯 난이도 조회 - ID: " + levelId);
            ChallengeLevelDTO level = mybatis.selectOne("challengeRepository.findLevelById", levelId);
            System.out.println("📊 난이도 정보: " + level);
            return level;
        } catch (Exception e) {
            System.err.println("⚠️ 난이도 조회 실패: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 🎯 특정 카테고리 정보를 조회합니다 (ID로)
     * @param categoryId 카테고리 ID
     * @return 카테고리 정보
     */
    public ChallengeCategoryDTO findCategoryById(Integer categoryId) {
        try {
            System.out.println("🎯 카테고리 조회 - ID: " + categoryId);
            ChallengeCategoryDTO category = mybatis.selectOne("challengeRepository.findCategoryById", categoryId);
            System.out.println("📊 카테고리 정보: " + category);
            return category;
        } catch (Exception e) {
            System.err.println("⚠️ 카테고리 조회 실패: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 🎯 새로운 챌린지를 데이터베이스에 등록합니다
     * @param challengeDTO 등록할 챌린지 정보
     * @return 등록된 행의 수
     */
    public int insertChallenge(ChallengeDTO challengeDTO) {
        try {
            System.out.println("🎯 챌린지 등록 - 제목: " + challengeDTO.getChallenge_title());
            System.out.println("📝 상세 정보: level_id=" + challengeDTO.getLevel_id() + 
                             ", category_id=" + challengeDTO.getCategory_id() + 
                             ", language=" + challengeDTO.getLanguage());
            
            int result = mybatis.insert("challengeRepository.insertChallenge", challengeDTO);
            
            System.out.println("✅ 챌린지 등록 완료 - 결과: " + result);
            return result;
            
        } catch (Exception e) {
            System.err.println("⚠️ 챌린지 등록 실패: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🎯 데이터베이스에 등록된 모든 언어 목록을 조회합니다
     * @return 언어 목록
     */
    public List<String> findAllLanguages() {
        try {
            System.out.println("🎯 언어 목록 조회 시작");
            List<String> languages = mybatis.selectList("challengeRepository.findAllLanguages");
            System.out.println("✅ 언어 목록 조회 완료: " + languages);
            return languages;
        } catch (Exception e) {
            System.err.println("⚠️ 언어 목록 조회 실패: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🎯 챌린지를 데이터베이스에서 삭제합니다
     * @param challengeId 삭제할 챌린지 ID
     * @return 삭제된 행의 수
     */
    public int deleteChallenge(Integer challengeId) {
        try {
            System.out.println("🎯 챌린지 삭제 시작 - ID: " + challengeId);
            
            // 먼저 챌린지가 존재하는지 확인
            ChallengeDTO existingChallenge = mybatis.selectOne("challengeRepository.findChallengeById", challengeId);
            if (existingChallenge == null) {
                System.out.println("⚠️ 삭제할 챌린지를 찾을 수 없습니다. ID: " + challengeId);
                return 0;
            }
            
            // 챌린지 삭제
            int result = mybatis.delete("challengeRepository.deleteChallenge", challengeId);
            
            System.out.println("✅ 챌린지 삭제 완료 - 결과: " + result);
            return result;
            
        } catch (Exception e) {
            System.err.println("⚠️ 챌린지 삭제 실패: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}