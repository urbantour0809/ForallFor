package com.spring.project.service;

import java.util.List;

import com.spring.project.dto.product.ProductDTO;
import com.spring.project.dto.user.UserDTO;

public interface ProductService {

	public List<ProductDTO> getAllProductList();
	
	public ProductDTO getProductDetail(ProductDTO vo);
	
	public int pointDeduction(int totalAmount, int user_id);
	
	public void deleteCart(int user_id);
	
	public boolean registerProduct(ProductDTO productDTO);
	
	public ProductDTO getProductById(int productId);
	
	public int deleteProduct(int productId);
}
