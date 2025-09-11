package com.spring.project.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import com.spring.project.dto.product.ProductDTO;
import com.spring.project.dto.user.UserDTO;
import com.spring.project.service.ProductService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductController {

	@Autowired
	ProductService productService;

	@GetMapping("/products")
	public Map<String, Object> products(){

		List<ProductDTO> productList = new ArrayList<ProductDTO>();

		Map<String, Object> productMap = new HashMap<String, Object>();

		productList = productService.getAllProductList();



		productMap.put("productList", productList);

		return productMap;

	}
	
	// 이미지 업로드 엔드포인트 추가
	@PostMapping("/upload/image")
	public Map<String, Object> uploadImage(@RequestPart("file") MultipartFile file) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		try {
			if (file.isEmpty()) {
				resultMap.put("success", false);
				resultMap.put("message", "업로드할 파일이 없습니다.");
				return resultMap;
			}
			
			// 파일 확장자 검증
			String originalFilename = file.getOriginalFilename();
			String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
			
			if (!fileExtension.matches("\\.(jpg|jpeg|png|gif|webp)$")) {
				resultMap.put("success", false);
				resultMap.put("message", "지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif, webp만 가능)");
				return resultMap;
			}
			
			// 파일 크기 검증 (5MB 제한)
			if (file.getSize() > 5 * 1024 * 1024) {
				resultMap.put("success", false);
				resultMap.put("message", "파일 크기는 5MB 이하여야 합니다.");
				return resultMap;
			}
			
			// 고유한 파일명 생성
			String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
			
			// 파일 저장 경로 설정 (실제 환경에서는 설정 파일에서 관리)
			String uploadDir = "src/main/resources/static/uploads/";
			java.io.File uploadPath = new java.io.File(uploadDir);
			if (!uploadPath.exists()) {
				uploadPath.mkdirs();
			}
			
			java.io.File dest = new java.io.File(uploadPath.getAbsolutePath() + java.io.File.separator + uniqueFilename);
			file.transferTo(dest);
			
			// DB에 저장할 이미지 경로
			String imagePath = "/uploads/" + uniqueFilename;
			
			resultMap.put("success", true);
			resultMap.put("message", "이미지가 성공적으로 업로드되었습니다.");
			resultMap.put("imagePath", imagePath);
			resultMap.put("originalFilename", originalFilename);
			
		} catch (Exception e) {
			System.out.println("이미지 업로드 오류: " + e.getMessage());
			e.printStackTrace();
			resultMap.put("success", false);
			resultMap.put("message", "이미지 업로드 중 오류가 발생했습니다: " + e.getMessage());
		}
		
		return resultMap;
	}
	
	@PostMapping("/product/register")
	public Map<String, Object> registerProduct(@RequestBody ProductDTO productDTO){
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		try {
			System.out.println("상품 등록 요청: " + productDTO.toString());
			
			// 필수 필드 검증
			if (productDTO.getProduct_title() == null || productDTO.getProduct_title().trim().isEmpty()) {
				resultMap.put("success", false);
				resultMap.put("message", "상품명은 필수입니다.");
				return resultMap;
			}
			
			if (productDTO.getStitle() == null || productDTO.getStitle().trim().isEmpty()) {
				resultMap.put("success", false);
				resultMap.put("message", "부제목은 필수입니다.");
				return resultMap;
			}
			
			if (productDTO.getWriter() == null || productDTO.getWriter().trim().isEmpty()) {
				resultMap.put("success", false);
				resultMap.put("message", "저자는 필수입니다.");
				return resultMap;
			}
			
			if (productDTO.getPublisher() == null || productDTO.getPublisher().trim().isEmpty()) {
				resultMap.put("success", false);
				resultMap.put("message", "출판사는 필수입니다.");
				return resultMap;
			}
			
			if (productDTO.getContent() == null || productDTO.getContent().trim().isEmpty()) {
				resultMap.put("success", false);
				resultMap.put("message", "상품 내용은 필수입니다.");
				return resultMap;
			}
			
			if (productDTO.getLanguages() == null || productDTO.getLanguages().trim().isEmpty()) {
				resultMap.put("success", false);
				resultMap.put("message", "책 언어는 필수입니다.");
				return resultMap;
			}
			
			boolean success = productService.registerProduct(productDTO);
			
			if(success) {
				resultMap.put("success", true);
				resultMap.put("message", "상품이 성공적으로 등록되었습니다.");
			} else {
				resultMap.put("success", false);
				resultMap.put("message", "상품 등록에 실패했습니다.");
			}
			
		} catch (Exception e) {
			System.out.println("상품 등록 오류: " + e.getMessage());
			e.printStackTrace(); // 스택 트레이스 출력
			
			// 중복 상품명 에러 처리
			if (e.getMessage().contains("Duplicate entry") && e.getMessage().contains("product_title")) {
				resultMap.put("success", false);
				resultMap.put("message", "이미 존재하는 상품명입니다. 다른 상품명을 사용해주세요.");
			} else {
				resultMap.put("success", false);
				resultMap.put("message", "상품 등록 중 오류가 발생했습니다: " + e.getMessage());
			}
		}
		
		return resultMap;
	}
	
	@PostMapping("/productdetail")
	public Map<String, Object> productdetail(@RequestBody ProductDTO vo){

		Map<String, Object> productMap = new HashMap<String, Object>();

		System.out.println("controller진입");
		System.out.println(vo.toString());

		vo = productService.getProductDetail(vo);
		System.out.println(vo.toString());
		productMap.put("productDetail", vo);

		return productMap;

	}
	
	@GetMapping("purchase/result")
	public Map<String, Object> purchaseresult(@RequestParam int totalAmount,@RequestParam String purchaseType, HttpSession session){
		
		UserDTO userSession = new UserDTO();
		Map<String, Object> map = new HashMap<String, Object>();
		
		userSession = (UserDTO) session.getAttribute("userSession");
		
		int userPoint = productService.pointDeduction(totalAmount, userSession.getUser_id());
		
		userSession.setPoint(userPoint);
		
		System.out.println("남은 포인트 : " + userPoint);
		
		map.put("userPoint", userPoint);
		map.put("success", true);
		
		if(purchaseType.equals("cart")) {
			productService.deleteCart(userSession.getUser_id());
		}
		
		return map;
	}
	
	// 상품 삭제 API (POST 방식)
	@PostMapping("/product/delete")
	public Map<String, Object> deleteProduct(@RequestBody Map<String, Object> params){
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		try {
			// product_id 파라미터 검증
			Object productIdObj = params.get("product_id");
			if (productIdObj == null) {
				resultMap.put("success", false);
				resultMap.put("message", "상품 ID가 필요합니다.");
				return resultMap;
			}
			
			int productId;
			try {
				productId = Integer.parseInt(productIdObj.toString());
			} catch (NumberFormatException e) {
				resultMap.put("success", false);
				resultMap.put("message", "올바른 상품 ID가 아닙니다.");
				return resultMap;
			}
			
			System.out.println("🗑️ 상품 삭제 요청: product_id = " + productId);
			
			// 상품 존재 여부 확인
			ProductDTO existingProduct = productService.getProductById(productId);
			if (existingProduct == null) {
				resultMap.put("success", false);
				resultMap.put("message", "존재하지 않는 상품입니다.");
				return resultMap;
			}
			
			// 상품 삭제 실행
			int deleteResult = productService.deleteProduct(productId);
			
			if (deleteResult > 0) {
				System.out.println("✅ 상품 삭제 성공: " + existingProduct.getProduct_title());
				resultMap.put("success", true);
				resultMap.put("message", "상품이 성공적으로 삭제되었습니다.");
				resultMap.put("deletedProduct", existingProduct);
			} else {
				System.out.println("❌ 상품 삭제 실패: product_id = " + productId + " (존재하지 않는 상품)");
				resultMap.put("success", false);
				resultMap.put("message", "존재하지 않는 상품입니다. 이미 삭제되었거나 잘못된 상품 ID입니다.");
			}
			
		} catch (Exception e) {
			System.err.println("❌ 상품 삭제 중 오류 발생: " + e.getMessage());
			e.printStackTrace();
			resultMap.put("success", false);
			resultMap.put("message", "상품 삭제 중 오류가 발생했습니다: " + e.getMessage());
		}
		
		return resultMap;
	}
}