package com.spring.project.service.impl;

import com.spring.project.dto.post.PostCategoryDTO;
import com.spring.project.dto.post.PostsDTO;
import com.spring.project.repository.PostRepository;
import com.spring.project.service.PostService;
import lombok.Builder;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service("PostService")
public class PostServiceImpl implements PostService {

    @Autowired
    PostRepository postRepository;

    @Override
    public List<PostsDTO> findAllPosts() {
        return postRepository.findAllPosts();
    }

    @Override
    public List<PostCategoryDTO> findAllCategories(){
        return postRepository.findAllCategories();
    }

    @Override
    public String findNicknameByUserId(int user_id) {
        return postRepository.findNicknameByUserId(user_id);
    }

    @Override
    public PostsDTO findPostById(int post_id) {
        return postRepository.findPostById(post_id);
    }

    @Override
    public void increaseView(int post_id) {
        postRepository.increaseView(post_id);
    }
/*

    @Override
    public List<PostsDTO> findPostsByPaging(int page, int size) {
        int offset = (page - 1) * size;
        return postRepository.findPostsByPaging(offset, size);
    }
*/

    @Override
    public int getTotalPostCount() {
        return postRepository.getTotalPostCount();
    }

    @Override
    public List<PostsDTO> findPostsByPagingAndFilter(int page, int size, Integer category, String keyword) {
        int offset = (page - 1) * size;
        return postRepository.findPostsByPagingAndFilter(offset, size, category, keyword);
    }

    @Override
    public int getFilteredPostCount(Integer category, String keyword) {
        return postRepository.getFilteredPostCount(category, keyword);
    }

    @Override
    public List<PostsDTO> findPostsByPaging(int page, int size, Integer category, String keyword) {
        int offset = (page - 1) * size;
        return postRepository.findPostsByPagingAndFilter(offset, size, category, keyword);
    }

    @Override
    public int getTotalPostCount(Integer category, String keyword) {
        return postRepository.getFilteredPostCount(category, keyword);
    }

	@Override
	public int insertPost(PostsDTO vo) {
		return postRepository.insertPost(vo);
	}

	@Override
	public int updatePost(PostsDTO vo) {
		return postRepository.updatePost(vo);
	}

	@Override
	public int deletePost(int post_id) {
		return postRepository.deletePost(post_id);
	}

    @Override
    public List<PostsDTO> findByDate(@Param("date") String date){
        return postRepository.findByDate(date);
    }

}
