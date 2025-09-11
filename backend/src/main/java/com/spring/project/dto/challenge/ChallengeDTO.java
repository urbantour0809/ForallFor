package com.spring.project.dto.challenge;

public class ChallengeDTO {

    private int challenge_id;
    private String challenge_title;
    private int level_id;
    private int category_id;
    private String language;
    private String content;
    private String hint;
    private String correct;

    // 기본 생성자
    public ChallengeDTO() {}

    // 기존 Getter & Setter만 유지 (추가 필드 제거)
    public int getChallenge_id() {
        return challenge_id;
    }

    public void setChallenge_id(int challenge_id) {
        this.challenge_id = challenge_id;
    }

    public String getChallenge_title() {
        return challenge_title;
    }

    public void setChallenge_title(String challenge_title) {
        this.challenge_title = challenge_title;
    }

    public int getLevel_id() {
        return level_id;
    }

    public void setLevel_id(int level_id) {
        this.level_id = level_id;
    }

    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public String getCorrect() {
        return correct;
    }

    public void setCorrect(String correct) {
        this.correct = correct;
    }

    @Override
    public String toString() {
        return "ChallengeDTO{" +
                "challenge_id=" + challenge_id +
                ", challenge_title='" + challenge_title + '\'' +
                ", level_id=" + level_id +
                ", category_id=" + category_id +
                ", language='" + language + '\'' +
                ", content='" + content + '\'' +
                ", hint='" + hint + '\'' +
                ", correct='" + correct + '\'' +
                '}';
    }
}
