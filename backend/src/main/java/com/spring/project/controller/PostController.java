package com.spring.project.controller;

import com.spring.project.dto.post.PostCategoryDTO;
import com.spring.project.dto.post.PostsDTO;
import com.spring.project.dto.user.UserDTO;
import com.spring.project.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    PostService postService;



    /* 카테고리 아이디 불러오기 */
    @GetMapping("/post-categories")
    public List<PostCategoryDTO> findAllCategories() {
        return postService.findAllCategories();
    }

    /* 닉네임 불러오기 */
    @GetMapping("/posts/{post_id}")
    public Map<String,Object> findPostById(@PathVariable("post_id") int post_id) {
        PostsDTO post = postService.findPostById(post_id);
        String nickname = postService.findNicknameByUserId(post.getUser_id());
        Map<String,Object> result = new HashMap<>();
        result.put("post", post);
        result.put("nickname", nickname);
        return result;
    }

    /* 조회수 */
    @PostMapping("/posts/{post_id}/view")
    public Map<String, Object> increaseView(@PathVariable int post_id) {
        Map<String, Object> result = new HashMap<>();
        try {
            postService.increaseView(post_id);
            result.put("status", "success");
        } catch (Exception e) {
            result.put("status", "fail");
            result.put("message", e.getMessage());
        }
        return result;
    }

    /* 페이징+전체 게시글 불러오기 */
    @GetMapping("/posts")
    public Map<String, Object> findAllPostsWithPaging(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer category,
            @RequestParam(required = false) String keyword
    ) {
        List<PostsDTO> posts = postService.findPostsByPaging(page, size, category, keyword);
        int totalCount = postService.getTotalPostCount(category, keyword);

        List<Map<String, Object>> data = new ArrayList<>();
        for (PostsDTO post : posts) {
            String nickname = postService.findNicknameByUserId(post.getUser_id());
            Map<String, Object> map = new HashMap<>();
            map.put("post", post);
            map.put("nickname", nickname);
            data.add(map);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("data", data);
        result.put("page", page);
        result.put("size", size);
        result.put("totalCount", totalCount);

        return result;
    }
    
    @PostMapping("post/insert")
    public Map<String, Object> insertPost(@RequestBody PostsDTO vo, HttpSession session){
    	
    	Map<String, Object> map = new HashMap<String, Object>();
    	boolean success = false;
    	int successInt = 0;
    	UserDTO userSession = new UserDTO();
    	
    	userSession = (UserDTO) session.getAttribute("userSession");
    	
    	if(userSession.getUser_id() > 0) {
    		vo.setUser_id(userSession.getUser_id());
    		successInt = postService.insertPost(vo);
    		if(successInt > 0) {
    			success = true;
    		}
    	}
    	
    	map.put("success", success);
    	
    	
    	return map;
    }
    
    @PostMapping("post/update")
    public Map<String, Object> updatePost(@RequestBody PostsDTO vo, HttpSession session){
    	
    	Map<String, Object> map = new HashMap<String, Object>();
    	boolean success = false;
    	int successInt = 0;

    	successInt = postService.updatePost(vo);
    	if(successInt > 0) {
    		success = true;
    	}
    	
    	map.put("success", success);
    	
    	
    	return map;
    }
    
    @PostMapping("post/delete")
    public Map<String, Object> deletePost(@RequestBody PostsDTO vo, HttpSession session){
    	
    	Map<String, Object> map = new HashMap<String, Object>();
    	boolean success = false;
    	int successInt = 0;

    	successInt = postService.deletePost(vo.getPost_id());
    	if(successInt > 0) {
    		success = true;
    	}
    	
    	map.put("success", success);
    	
    	
    	return map;
    }

    @GetMapping("/post/by-date")
    public Map<String, Object> findByDate(@RequestParam("date") String dateStr) {
        Map<String, Object> map = new HashMap<>();

        List<PostsDTO> posts = postService.findByDate(dateStr);
        if (posts == null) posts = new ArrayList<>();

        List<String> nicknames = new ArrayList<>();
        for (PostsDTO p : posts) {
            String nick = postService.findNicknameByUserId(p.getUser_id());
            nicknames.add(nick != null ? nick : "");
        }

        map.put("status", "success");
        map.put("posts", posts);
        map.put("nicknames", nicknames);

        map.put("count", posts.size());

        return map;
    }






}
