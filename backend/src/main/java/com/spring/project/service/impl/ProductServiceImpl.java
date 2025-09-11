package com.spring.project.service.impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.project.dto.product.ProductDTO;
import com.spring.project.repository.ProductRepository;
import com.spring.project.service.ProductService;



@Service("productService")
public class ProductServiceImpl implements ProductService{

	@Autowired
	ProductRepository productRepository;
	
	
	@Override
	public List<ProductDTO> getAllProductList() {
		
		return productRepository.getAllProductList();
	}


	@Override
	public ProductDTO getProductDetail(ProductDTO vo) {
		
		return productRepository.getProductDetail(vo);
	}


	@Override
	public int pointDeduction(int totalAmount, int user_id) {
		
		return productRepository.pointDeduction(totalAmount, user_id);
	}


	@Override
	public void deleteCart(int user_id) {
		
		productRepository.deleteCart(user_id);
		
	}
	
	@Override
	public boolean registerProduct(ProductDTO productDTO) {
		
		try {
			System.out.println("서비스 레이어 - 상품 등록 시작");
			System.out.println("입력 데이터: " + productDTO.toString());
			
			int result = productRepository.registerProduct(productDTO);
			
			System.out.println("데이터베이스 삽입 결과: " + result);
			
			boolean success = result > 0;
			System.out.println("상품 등록 성공 여부: " + success);
			
			return success;
		} catch (Exception e) {
			System.out.println("상품 등록 서비스 오류: " + e.getMessage());
			e.printStackTrace();
			// 예외를 다시 던져서 Controller에서 처리하도록 함
			throw e;
		}
	}
	
	@Override
	public ProductDTO getProductById(int productId) {
		try {
			System.out.println("🔍 상품 조회 요청: product_id = " + productId);
			ProductDTO product = productRepository.getProductById(productId);
			
			if (product != null) {
				System.out.println("✅ 상품 조회 성공: " + product.getProduct_title());
			} else {
				System.out.println("❌ 상품을 찾을 수 없음: product_id = " + productId);
			}
			
			return product;
		} catch (Exception e) {
			System.err.println("❌ 상품 조회 중 오류 발생: " + e.getMessage());
			e.printStackTrace();
			return null;
		}
	}
	
	@Override
	public int deleteProduct(int productId) {
		try {
			System.out.println("🗑️ 상품 삭제 서비스 실행: product_id = " + productId);
			int result = productRepository.deleteProduct(productId);
			
			if (result > 0) {
				System.out.println("✅ 상품 삭제 성공: 영향받은 행 수 = " + result);
			} else {
				System.out.println("❌ 상품 삭제 실패: 영향받은 행 수 = " + result);
			}
			
			return result;
		} catch (Exception e) {
			System.err.println("❌ 상품 삭제 서비스 오류: " + e.getMessage());
			e.printStackTrace();
			return 0;
		}
	}

}
