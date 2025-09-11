package com.spring.project.service;

import java.util.List;
import java.util.Map;

import com.spring.project.dto.challenge.ChallengeDTO;
import com.spring.project.dto.challenge.ChallengeLevelDTO;
import com.spring.project.dto.challenge.ChallengeCategoryDTO;

/**
 * 챌린지 관련 비즈니스 로직을 처리하는 서비스 인터페이스
 */
public interface ChallengeService {

    /**
     * 🎯 챌린지 페이지용 데이터 조회 (필터링 지원)
     * @param difficulty 난이도 필터 ("all", "beginner", "intermediate", "advanced")
     * @param category 카테고리 필터 ("all", "algorithm", "web", 등)
     * @param language 언어 필터 ("all", "Java", "Python", 등)
     * @return 필터링된 챌린지 관련 데이터
     */
    Map<String, Object> getAllChallengesForPage(String difficulty, String category, String language);

    /**
     * 전체 챌린지 목록을 조회합니다 (필터링 없음)
     * @return 전체 챌린지 목록
     */
    List<ChallengeDTO> getAllChallenges();

    /**
     * 특정 챌린지의 상세 정보를 조회합니다
     * @param challengeId 챌린지 ID
     * @return 챌린지 상세 정보
     */
    ChallengeDTO getChallengeById(Integer challengeId);

    /**
     * 모든 난이도 목록을 조회합니다
     * @return 난이도 목록
     */
    List<ChallengeLevelDTO> getAllLevels();

    /**
     * 모든 카테고리 목록을 조회합니다
     * @return 카테고리 목록
     */
    List<ChallengeCategoryDTO> getAllCategories();

    /**
     * 챌린지 통계 정보를 조회합니다
     * @return 통계 정보 맵
     */
    Map<String, Object> getChallengeStatistics();

    /**
     * 특정 챌린지의 완료자 수를 조회합니다
     * @param challengeId 챌린지 ID
     * @return 완료자 수
     */
    int getCompletedCount(Integer challengeId);

    /**
     * 전체 챌린지 수를 조회합니다
     * @return 전체 챌린지 수
     */
    int getTotalChallengeCount();

    /**
     * 🎯 개별 챌린지 상세 정보와 통계를 조회합니다
     * @param challengeId 챌린지 ID
     * @return 챌린지 상세 정보와 통계 (challenge, level, category, statistics)
     */
    Map<String, Object> getChallengeDetailById(Integer challengeId);

    /**
     * 🎯 새로운 챌린지를 등록합니다
     * @param challengeDTO 등록할 챌린지 정보
     * @return 등록 성공 여부
     */
    boolean registerChallenge(ChallengeDTO challengeDTO);

    /**
     * 🎯 모든 챌린지 레벨을 조회합니다 (등록용)
     * @return 레벨 목록
     */
    List<ChallengeLevelDTO> getAllChallengeLevels();

    /**
     * 🎯 모든 챌린지 카테고리를 조회합니다 (등록용)
     * @return 카테고리 목록
     */
    List<ChallengeCategoryDTO> getAllChallengeCategories();

    /**
     * 🎯 모든 챌린지 지원 언어를 조회합니다 (등록용)
     * @return 언어 목록
     */
    List<String> getAllChallengeLanguages();

    /**
     * 🎯 챌린지를 삭제합니다
     * @param challengeId 삭제할 챌린지 ID
     * @return 삭제 성공 여부
     */
    boolean deleteChallenge(Integer challengeId);
}