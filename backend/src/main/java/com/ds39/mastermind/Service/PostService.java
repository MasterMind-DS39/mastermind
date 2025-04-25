package com.ds39.mastermind.Service;

import java.util.ArrayList;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ds39.mastermind.Entity.Post;
import com.ds39.mastermind.Repository.PostRepo;

@Service
public class PostService {

    @Autowired
    PostRepo postRepo;

    @Autowired
    UserService userService;
    
    public Post submitPostToDataBase(Post post) {
        return postRepo.save(post);
    }
    
    public ArrayList<Post> retrivePostFromDB(){
        ArrayList<Post> postList = postRepo.findAll();
        
        for(int i=0; i<postList.size(); i++) {
            Post postItem = postList.get(i);
            postItem.setUserName(userService.displayUserMetaData(postItem.getUserId()).getUserName());
        }
        Collections.sort(postList, (a,b) -> b.getId() - a.getId());
        return postList;
    }
    
    public ArrayList<Post> retrievePostsByUser(String userId) {
        ArrayList<Post> postList = postRepo.findByUserId(userId);
        
        for(int i=0; i<postList.size(); i++) {
            Post postItem = postList.get(i);
            postItem.setUserName(userService.displayUserMetaData(postItem.getUserId()).getUserName());
        }
        Collections.sort(postList, (a,b) -> b.getId() - a.getId());
        return postList;
    }
    
    public boolean deletePost(String postId) {
        try {
            postRepo.deleteByPostId(postId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public Post updatePost(Post updatedPost) {
        Post existingPost = postRepo.findByPostId(updatedPost.getPostId());
        if (existingPost != null) {
            // Update fields but preserve the ID
            int id = existingPost.getId();
            updatedPost.setId(id);
            return postRepo.save(updatedPost);
        }
        return null;
    }
}
