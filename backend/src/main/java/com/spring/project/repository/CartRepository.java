package com.spring.project.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.spring.project.dto.product.ProductDTO;
import com.spring.project.dto.cart.CartDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.spring.project.dto.cart.CartItemDTO;

@Repository
public class CartRepository {
    @Autowired
    private SqlSessionTemplate mybatis;


    
    public CartDTO findCartIdByUserId(int user_id) {
        return mybatis.selectOne("cartRepository.findCartIdByUserId", user_id);
    }


    public boolean isCartExist(int user_id) {
        return mybatis.selectOne("cartRepository.isCartExist", user_id);
    }

    public int createCart(int user_id) {
        return mybatis.insert("cartRepository.createCart", user_id);
    }

    public int addCartItem(CartItemDTO cartItem) {
        return mybatis.insert("cartRepository.addCartItem", cartItem);
    }

    public List<CartItemDTO> getCartItemsByCartId(int cart_id, int start, int limit) {
        Map<String, Object> map = new HashMap<>();
        map.put("cart_id", cart_id);
        map.put("start", start);
        map.put("limit", limit);
        return mybatis.selectList("cartRepository.getCartItemsByCartId", map);
    }

    public List<Map<String, Object>> getProductsInCart(int userId) {
        return mybatis.selectList("cartRepository.getProductsInCart", userId);
    }

    public void updateCartItemQuantity(CartItemDTO cartItem) {
        mybatis.update("cartRepository.updateCartItemQuantity", cartItem);
    }

    public void removeCartItem(CartItemDTO item) {
        mybatis.delete("cartRepository.removeCartItem", item);
    }

    public int findQuantityByCartIdAndProductId(int cart_id, int product_id) {
        Map<String, Object> map = new HashMap<>();
        map.put("cart_id", cart_id);
        map.put("product_id", product_id);
        Integer quantity = mybatis.selectOne("cartRepository.findQuantityByCartIdAndProductId", map);
        return quantity != null ? quantity : 0;
    }



}
