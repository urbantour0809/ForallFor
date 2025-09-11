package com.spring.project.service;

import java.util.List;
import java.util.Map;

import com.spring.project.dto.cart.CartDTO;
import com.spring.project.dto.cart.CartItemDTO;
import com.spring.project.dto.product.ProductDTO;
import org.apache.ibatis.annotations.Param;

public interface CartService {

    public CartDTO findCartIdByUserId(int user_id);

    public void addCartItem(CartItemDTO cartItem);

    public List<CartItemDTO> getCartItemsByCartId(int cartId, int page, int size);

    public List<Map<String, Object>> getProductsInCart(int userId);

    public void updateCartItemQuantity(CartItemDTO cartItem, int userId);

    public void removeCartItem(CartItemDTO cartItem);

    public  int getCartIdByUserId(int userId);



}

