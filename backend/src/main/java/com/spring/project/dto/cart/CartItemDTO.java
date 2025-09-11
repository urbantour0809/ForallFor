package com.spring.project.dto.cart;

public class CartItemDTO {
    private int cart_item_id;
    private int cart_id;
    private int product_id;
    private int quantity;
    private String added_at;

    public int getCart_item_id() {
        return cart_item_id;
    }
    public int getCart_id() {
        return cart_id;
    }
    public int getProduct_id() {
        return product_id;
    }
    public int getQuantity() {
        return quantity;
    }
    public String getAdded_at() {
        return added_at;
    }
    public void setCart_item_id(int cart_item_id) {
        this.cart_item_id = cart_item_id;
    }
    public void setCart_id(int cart_id) {
        this.cart_id = cart_id;
    }
    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public void setAdded_at(String added_at) {
        this.added_at = added_at;
    }


    @Override
    public String toString() {
        return "CartItemDTO{" +
                "cart_item_id=" + cart_item_id +
                ", cart_id=" + cart_id +
                ", product_id=" + product_id +
                ", quantity=" + quantity +
                ", added_at='" + added_at + '\'' +
                '}';
    }
}
