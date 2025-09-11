package com.spring.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.spring.project.dto.cart.CartDTO;
import com.spring.project.dto.product.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.spring.project.dto.cart.CartItemDTO;
import com.spring.project.dto.user.UserDTO;
import com.spring.project.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // 장바구니에 상품 추가
    @PostMapping("/add")
    public Map<String, Object> addToCart(HttpSession session, @RequestBody CartItemDTO cartItem) {
        Map<String, Object> map = new HashMap<>();

        Object userSession = session.getAttribute("userSession");
        System.out.println("loginUsers: " + userSession);
        System.out.println("받은 cartItem: " + cartItem);
        if (userSession == null) {
            map.put("status", "fail");
            map.put("message", "로그인이 필요합니다.");
            return map;
        }

        UserDTO loginUser = (UserDTO) userSession;

        // 1️⃣ 장바구니 아이디 가져오기
        CartDTO cart = cartService.findCartIdByUserId(loginUser.getUser_id());
        int cart_Id = cart.getCart_id();
        // 2️⃣ 장바구니 ID 세팅 후 추가
        cartItem.setCart_id(cart_Id);
        cartService.addCartItem(cartItem);
        System.out.println("=== POST /add 요청 도착 ===");
        System.out.println("cartItem = " + cartItem);

        map.put("status", "success");
        map.put("message", "상품이 장바구니에 추가되었습니다.");
        return map;
    }

    @GetMapping("/list")
    public Map<String, Object> getCartItems(HttpSession session,
                                            @RequestParam(defaultValue = "1") int page,
                                            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> map = new HashMap<>();

        Object userSession = session.getAttribute("userSession");
        if (userSession == null) {
            map.put("status", "fail");
            map.put("message", "로그인이 필요합니다.");
            return map;
        }

        UserDTO loginUser = (UserDTO) userSession;

        // 1️⃣ cart_id 가져오기
        CartDTO cart = cartService.findCartIdByUserId(loginUser.getUser_id());
        int cartId = cart.getCart_id();

        // 2️⃣ 아이템 목록 가져오기
        List<CartItemDTO> items = cartService.getCartItemsByCartId(cartId, page, size);

        map.put("status", "success");
        map.put("message", "장바구니 목록 조회 성공");
        map.put("data", items);
        map.put("page", page);
        map.put("size", size);
        return map;
    }

    @GetMapping("/productsList")
    public Map<String, Object> getCartProductList(HttpSession session,
                                                  @RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> map = new HashMap<>();
        UserDTO loginUser = (UserDTO) session.getAttribute("userSession");

        if (loginUser == null) {
            map.put("status", "fail");
            map.put("message", "로그인이 필요합니다.");
            return map;
        }

        List<Map<String, Object>> productList = cartService.getProductsInCart(loginUser.getUser_id());

        map.put("status", "success");
        map.put("message", "장바구니 목록 조회 성공");
        map.put("data", productList);
        map.put("page", page);
        map.put("size", size);

        return map;
    }

    @PostMapping("/update")
    public Map<String, Object> updateQuantity(@RequestBody CartItemDTO cartItem, HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        UserDTO userSession = (UserDTO) session.getAttribute("userSession");

        if (userSession == null) {
            result.put("status", "fail");
            result.put("message", "로그인이 필요합니다.");
            return result;
        }

        // user_id는 따로 넘겨줌
        cartService.updateCartItemQuantity(cartItem, userSession.getUser_id());

        result.put("status", "success");
        result.put("message", "수량이 업데이트되었습니다.");
        return result;
    }

    @PostMapping("/remove")
    public Map<String, Object> removeCartItem(@RequestBody CartItemDTO cartItem, HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        UserDTO userSession = (UserDTO) session.getAttribute("userSession");

        if (userSession == null) {
            result.put("status", "fail");
            result.put("message", "로그인이 필요합니다.");
            return result;
        }

        int userId = userSession.getUser_id();
        int cartId = cartService.getCartIdByUserId(userId); // 이미 존재하는 메서드일 것

        cartItem.setCart_id(cartId);
        cartService.removeCartItem(cartItem);

        result.put("status", "success");
        result.put("message", "상품이 장바구니에서 삭제되었습니다.");
        return result;
    }

    


}

