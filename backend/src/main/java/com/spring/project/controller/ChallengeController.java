package com.spring.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.project.dto.challenge.ChallengeDTO;
import com.spring.project.dto.challenge.ChallengeLevelDTO;
import com.spring.project.dto.challenge.ChallengeCategoryDTO;
import com.spring.project.service.ChallengeService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChallengeController {

    @Autowired
    ChallengeService challengeService;

    /**
     * 🎯 챌린지 목록 조회 (필터링 지원)
     * difficulty, category, language 파라미터를 받아서 해당 조건에 맞는 챌린지만 반환
     */
    @GetMapping("/challenges")
    public Map<String, Object> getAllChallenges(
            @RequestParam(defaultValue = "all") String difficulty,
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "all") String language) { // 🎯 언어 파라미터 추가

        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🎯 챌린지 데이터 조회 요청 - difficulty: " + difficulty + ", category: " + category + ", language: " + language);

            // 🎯 필터 파라미터와 함께 데이터 조회
            Map<String, Object> challengeInfoMap = challengeService.getAllChallengesForPage(difficulty, category, language);

            List<ChallengeDTO> challengeList = (List<ChallengeDTO>) challengeInfoMap.get("challengeList");
            List<ChallengeLevelDTO> levelsList = (List<ChallengeLevelDTO>) challengeInfoMap.get("levelsList");
            List<ChallengeCategoryDTO> categoriesList = (List<ChallengeCategoryDTO>) challengeInfoMap.get("categoriesList");

            response.put("success", true);
            response.put("challenges", challengeList);
            response.put("levels", levelsList);
            response.put("categories", categoriesList);
            response.put("total", challengeList.size());
            response.put("message", "챌린지 목록 조회 성공");

            System.out.println("챌린지 전체 데이터 조회 성공: " + challengeList.size() + "개");

            return response;

        } catch (Exception e) {
            System.err.println("챌린지 목록 조회 API 오류: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "챌린지 목록 조회에 실패했습니다.");
            response.put("error", e.getMessage());

            return response;
        }
    }

    /**
     * 🎯 개별 챌린지 상세 조회
     * 챌린지 ID를 받아서 해당 챌린지의 상세 정보와 통계를 반환
     */
    @GetMapping("/challenges/{challengeId}")
    public Map<String, Object> getChallengeDetail(@PathVariable Integer challengeId) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🎯 챌린지 상세 조회 요청 - ID: " + challengeId);

            // 🎯 챌린지 상세 정보와 통계 조회
            Map<String, Object> challengeDetailMap = challengeService.getChallengeDetailById(challengeId);

            if (challengeDetailMap == null) {
                response.put("success", false);
                response.put("message", "해당 챌린지를 찾을 수 없습니다.");
                return response;
            }

            response.put("success", true);
            response.put("challenge", challengeDetailMap.get("challenge"));
            response.put("level", challengeDetailMap.get("level"));
            response.put("category", challengeDetailMap.get("category"));
            response.put("statistics", challengeDetailMap.get("statistics"));
            response.put("message", "챌린지 상세 조회 성공");

            System.out.println("챌린지 상세 조회 성공: " + challengeDetailMap.get("challenge"));

            return response;

        } catch (Exception e) {
            System.err.println("챌린지 상세 조회 API 오류: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "챌린지 상세 조회에 실패했습니다.");
            response.put("error", e.getMessage());

            return response;
        }
    }

    /**
     * 🎯 새로운 챌린지 등록
     * 챌린지 정보를 받아서 데이터베이스에 등록
     */
    @PostMapping("/challenge/register")
    public Map<String, Object> registerChallenge(@RequestBody ChallengeDTO challengeDTO) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🎯 챌린지 등록 요청: " + challengeDTO.getChallenge_title());

            // 챌린지 등록
            boolean isRegistered = challengeService.registerChallenge(challengeDTO);

            if (isRegistered) {
                response.put("success", true);
                response.put("message", "챌린지가 성공적으로 등록되었습니다.");
                System.out.println("챌린지 등록 성공: " + challengeDTO.getChallenge_title());
            } else {
                response.put("success", false);
                response.put("message", "챌린지 등록에 실패했습니다.");
            }

            return response;

        } catch (Exception e) {
            System.err.println("챌린지 등록 API 오류: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "챌린지 등록 중 오류가 발생했습니다.");
            response.put("error", e.getMessage());

            return response;
        }
    }

    /**
     * 🎯 챌린지 레벨 목록 조회
     */
    @GetMapping("/challenge/levels")
    public Map<String, Object> getChallengeLevels() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<ChallengeLevelDTO> levels = challengeService.getAllChallengeLevels();
            
            response.put("success", true);
            response.put("levels", levels);
            response.put("message", "레벨 목록 조회 성공");

            return response;

        } catch (Exception e) {
            System.err.println("레벨 목록 조회 API 오류: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "레벨 목록 조회에 실패했습니다.");
            response.put("error", e.getMessage());

            return response;
        }
    }

    /**
     * 🎯 챌린지 카테고리 목록 조회
     */
    @GetMapping("/challenge/categories")
    public Map<String, Object> getChallengeCategories() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<ChallengeCategoryDTO> categories = challengeService.getAllChallengeCategories();
            
            response.put("success", true);
            response.put("categories", categories);
            response.put("message", "카테고리 목록 조회 성공");

            return response;

        } catch (Exception e) {
            System.err.println("카테고리 목록 조회 API 오류: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "카테고리 목록 조회에 실패했습니다.");
            response.put("error", e.getMessage());

            return response;
        }
    }

    /**
     * 🎯 챌린지 지원 언어 목록 조회
     */
    @GetMapping("/challenge/languages")
    public Map<String, Object> getChallengeLanguages() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<String> languages = challengeService.getAllChallengeLanguages();
            
            response.put("success", true);
            response.put("languages", languages);
            response.put("message", "언어 목록 조회 성공");

            return response;

        } catch (Exception e) {
            System.err.println("언어 목록 조회 API 오류: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "언어 목록 조회에 실패했습니다.");
            response.put("error", e.getMessage());

            return response;
        }
    }

    /**
     * 🎯 챌린지 삭제
     * 챌린지 ID를 받아서 해당 챌린지를 삭제
     */
    @DeleteMapping("/challenge/{challengeId}")
    public Map<String, Object> deleteChallenge(@PathVariable Integer challengeId) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🎯 챌린지 삭제 요청 - ID: " + challengeId);

            // 챌린지 삭제
            boolean isDeleted = challengeService.deleteChallenge(challengeId);

            if (isDeleted) {
                response.put("success", true);
                response.put("message", "챌린지가 성공적으로 삭제되었습니다.");
                System.out.println("챌린지 삭제 성공: ID " + challengeId);
            } else {
                response.put("success", false);
                response.put("message", "챌린지 삭제에 실패했습니다. 해당 챌린지를 찾을 수 없습니다.");
            }

            return response;

        } catch (Exception e) {
            System.err.println("챌린지 삭제 API 오류: " + e.getMessage());
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "챌린지 삭제 중 오류가 발생했습니다.");
            response.put("error", e.getMessage());

            return response;
        }
    }
}