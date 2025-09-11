package com.spring.project.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.spring.project.dto.product.ProductDTO;


@Repository
public class ProductRepository {

   @Autowired
   SqlSessionTemplate mybatis;
   

   public List<ProductDTO> getAllProductList(){
	   return mybatis.selectList("productRepository.getAllProductList");
   }
   
   public ProductDTO getProductDetail(ProductDTO vo) {
	   return mybatis.selectOne("productRepository.getProductDetail", vo);
   }
   
   public int pointDeduction(int totalAmount, int user_id) {
	   
	   	Map<String, Object> paramMap = new HashMap<String, Object>();
	    paramMap.put("totalAmount", totalAmount);
	    paramMap.put("user_id", user_id);
	   
	   mybatis.update("productRepository.pointDeduction", paramMap);
	   
	   return mybatis.selectOne("productRepository.getpoint", user_id);
   }
   
   public void deleteCart(int user_id) {
	   mybatis.delete("productRepository.deleteCart", user_id);
   }
   
   public int registerProduct(ProductDTO productDTO) {
	   System.out.println("Repository 레이어 - 상품 등록 시작");
	   System.out.println("MyBatis 파라미터: " + productDTO.toString());
	   
	   int result = mybatis.insert("productRepository.registerProduct", productDTO);
	   
	   System.out.println("MyBatis insert 결과: " + result);
	   
	   return result;
   }
   
   public ProductDTO getProductById(int productId) {
	   System.out.println("Repository 레이어 - 상품 조회: product_id = " + productId);
	   
	   ProductDTO result = mybatis.selectOne("productRepository.getProductById", productId);
	   
	   System.out.println("MyBatis select 결과: " + (result != null ? result.getProduct_title() : "null"));
	   
	   return result;
   }
   
   public int deleteProduct(int productId) {
	   System.out.println("Repository 레이어 - 상품 삭제: product_id = " + productId);
	   
	   // 먼저 CART_ITEMS에서 삭제
	   int cartResult = mybatis.delete("productRepository.deleteCartItemsByProduct", productId);
	   System.out.println("CART_ITEMS 삭제 결과: " + cartResult);
	   
	   // 그 다음 PRODUCTS에서 삭제
	   int result = mybatis.delete("productRepository.deleteProduct", productId);
	   System.out.println("PRODUCTS 삭제 결과: " + result);
	   
	   return result;
   }
   
}
