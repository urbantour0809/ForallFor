package com.spring.project.dto.challenge;

public class ChallengeLevelDTO {

    private int level_id;
    private String level_name;
    private String color;
    private int exp;

    public ChallengeLevelDTO() {}

    public int getLevel_id() {
        return level_id;
    }

    public void setLevel_id(int level_id) {
        this.level_id = level_id;
    }

    public String getLevel_name() {
        return level_name;
    }

    public void setLevel_name(String level_name) {
        this.level_name = level_name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getExp() {
        return exp;
    }

    public void setExp(int exp) {
        this.exp = exp;
    }

    @Override
    public String toString() {
        return "ChallengeLevelsDTO{" +
                "level_id=" + level_id +
                ", level_name='" + level_name + '\'' +
                ", color='" + color + '\'' +
                ", exp=" + exp +
                '}';
    }
}
