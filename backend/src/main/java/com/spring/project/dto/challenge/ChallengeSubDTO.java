package com.spring.project.dto.challenge;

public class ChallengeSubDTO {

    private int challenge_sub_id;
    private int challenge_id;
    private int user_id;
    private String correct_answer;
    private String correct_code;
    private int exp_count;
    private boolean pass;

    public ChallengeSubDTO() {}

    public int getChallenge_sub_id() {
        return challenge_sub_id;
    }

    public void setChallenge_sub_id(int challenge_sub_id) {
        this.challenge_sub_id = challenge_sub_id;
    }

    public int getChallenge_id() {
        return challenge_id;
    }

    public void setChallenge_id(int challenge_id) {
        this.challenge_id = challenge_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getCorrect_answer() {
        return correct_answer;
    }

    public void setCorrect_answer(String correct_answer) {
        this.correct_answer = correct_answer;
    }

    public String getCorrect_code() {
        return correct_code;
    }

    public void setCorrect_code(String correct_code) {
        this.correct_code = correct_code;
    }

    public int getExp_count() {
        return exp_count;
    }

    public void setExp_count(int exp_count) {
        this.exp_count = exp_count;
    }

    public boolean isPass() {
        return pass;
    }

    public void setPass(boolean pass) {
        this.pass = pass;
    }

    @Override
    public String toString() {
        return "ChallengeSubDTO{" +
                "challenge_sub_id=" + challenge_sub_id +
                ", challenge_id=" + challenge_id +
                ", user_id=" + user_id +
                ", correct_answer='" + correct_answer + '\'' +
                ", correct_code='" + correct_code + '\'' +
                ", exp_count=" + exp_count +
                ", pass=" + pass +
                '}';
    }
}
