package com.spring.project.repository;

import com.spring.project.dto.post.PostCategoryDTO;
import com.spring.project.dto.post.PostsDTO;
import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.SqlSessionTemplate;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class PostRepository {

    @Autowired
    private SqlSessionTemplate mybatis;

    public List<PostsDTO> findAllPosts() {
        return mybatis.selectList("postRepository.findAllPosts");
    }

    public String findNicknameByUserId(int user_id) {
        return mybatis.selectOne("postRepository.findNicknameByUserId", user_id);
    }

    public List<PostCategoryDTO> findAllCategories(){
        return mybatis.selectList("postRepository.findAllCategories");
    }

    public PostsDTO findPostById(int post_id) {
        return mybatis.selectOne("postRepository.findPostById", post_id);
    }

    public void increaseView(int post_id) {
        mybatis.update("postRepository.increaseView", post_id);
    }

    public List<PostsDTO> findPostsByPaging(int offset, int size) {
        Map<String, Integer> params = new HashMap<>();
        params.put("offset", offset);
        params.put("size", size);
        return mybatis.selectList("postRepository.findPostsByPaging", params);
    }

    public int getTotalPostCount() {
        return mybatis.selectOne("postRepository.getTotalPostCount");
    }

    public List<PostsDTO> findPostsByPagingAndFilter(int offset, int size, Integer category, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("offset", offset);
        params.put("size", size);
        params.put("category", category);
        params.put("keyword", keyword);
        return mybatis.selectList("postRepository.findPostsByPagingAndFilter", params);
    }

    public int getFilteredPostCount(Integer category, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("category", category);
        params.put("keyword", keyword);
        return mybatis.selectOne("postRepository.getFilteredPostCount", params);
    }
    
    public int insertPost(PostsDTO vo) {
    	return mybatis.insert("postRepository.insertPost", vo);
    }
    
    public int updatePost(PostsDTO vo) {
    	return mybatis.update("postRepository.updatePost", vo);
    }
    
    public int deletePost(int post_id) {
    	return mybatis.delete("postRepository.deletePost", post_id);
    }

    public List<PostsDTO> findByDate(@Param("date") String date){
        return mybatis.selectList("postRepository.findByDate", date);
    }

}
