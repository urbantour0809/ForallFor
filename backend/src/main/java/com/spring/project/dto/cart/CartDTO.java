package com.spring.project.dto.cart;

public class CartDTO {
    private int cart_id;
    private int user_id;
    private String created_at;

    public int getCart_id() {
        return cart_id;
    }
    public int getUser_id() {
        return user_id;
    }
    public String getCreated_at() {
        return created_at;
    }
    public void setCart_id(int cart_id) {
        this.cart_id = cart_id;
    }
    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }
    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }
}
