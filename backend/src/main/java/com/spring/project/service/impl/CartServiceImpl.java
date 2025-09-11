package com.spring.project.service.impl;

import java.util.List;
import java.util.Map;

import com.spring.project.dto.cart.CartDTO;
import com.spring.project.dto.product.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.project.dto.cart.CartItemDTO;
import com.spring.project.repository.CartRepository;
import com.spring.project.service.CartService;

@Service("CartService")
public class CartServiceImpl implements CartService{

    @Autowired
    private CartRepository cartRepository;

    @Override
    public CartDTO findCartIdByUserId(int user_id) {
        System.out.println(">>> findCartIdByUserId() 실행, user_id = " + user_id);
        if (!cartRepository.isCartExist(user_id)) {
            System.out.println(">>> 장바구니 없음 -> 새로 생성 시도");
            cartRepository.createCart(user_id);
        }
        CartDTO cart = cartRepository.findCartIdByUserId(user_id);
        System.out.println(">>> 조회된 cart = " + cart);

        return cart;
    }



    @Override
    public void addCartItem(CartItemDTO item) {
        int existingQuantity = cartRepository.findQuantityByCartIdAndProductId(item.getCart_id(), item.getProduct_id());

        if (existingQuantity > 0) {
            // 이미 있는 경우 → 수량 덮어쓰기 or 누적
            item.setQuantity(existingQuantity + item.getQuantity()); // or 그냥 item.setQuantity(item.getQuantity());
            cartRepository.updateCartItemQuantity(item);
        } else {
            // 없는 경우 → insert
            cartRepository.addCartItem(item);
        }
    }


    @Override
    public List<CartItemDTO> getCartItemsByCartId(int cartId, int page, int size) {
        int start = (page - 1) * size;
        return cartRepository.getCartItemsByCartId(cartId, start, size);
    }

    @Override
    public List<Map<String, Object>> getProductsInCart(int userId) {
        return cartRepository.getProductsInCart(userId);
    }

    @Override
    public void updateCartItemQuantity(CartItemDTO cartItem, int userId) {
        CartDTO cart = cartRepository.findCartIdByUserId(userId);
        int cartId = cart.getCart_id();

        cartItem.setCart_id(cartId);
        cartRepository.updateCartItemQuantity(cartItem);
    }

    @Override
    public void removeCartItem(CartItemDTO cartItem) {
        cartRepository.removeCartItem(cartItem);
    }

    @Override
    public int getCartIdByUserId(int userId) {
        CartDTO cart = cartRepository.findCartIdByUserId(userId);
        return cart != null ? cart.getCart_id() : -1; // 없으면 -1 또는 예외처리
    }




}
