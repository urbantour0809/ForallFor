package com.spring.project.service;

import com.spring.project.dto.post.PostCategoryDTO;
import com.spring.project.dto.post.PostsDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PostService {

    public List<PostsDTO> findAllPosts();

    public List<PostCategoryDTO> findAllCategories();

    public String findNicknameByUserId(int user_id);

    public PostsDTO findPostById(int post_id);

    public void increaseView(int post_id);

/*    public List<PostsDTO> findPostsByPaging(int page, int size);*/

    public int getTotalPostCount();

    public List<PostsDTO> findPostsByPagingAndFilter(int page, int size, Integer category, String keyword);

    public int getFilteredPostCount(Integer category, String keyword);

    List<PostsDTO> findPostsByPaging(int page, int size, Integer category, String keyword);

    int getTotalPostCount(Integer category, String keyword);
    
    public int insertPost(PostsDTO vo);
    
    public int updatePost(PostsDTO vo);
    
    public int deletePost(int post_id);

    public List<PostsDTO> findByDate(@Param("date") String date);

}

