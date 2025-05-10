package com.ds39.mastermind.service;

import com.ds39.mastermind.entity.SavedPost;
import com.ds39.mastermind.entity.Post;
import com.ds39.mastermind.repository.SavedPostRepo;
import com.ds39.mastermind.repository.PostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SavedPostService {

    @Autowired
    SavedPostRepo savedPostRepo;

    @Autowired
    PostRepo postRepo;

    public boolean savePost(String userId, String postId) {
        if (savedPostRepo.findByUserIdAndPostId(userId, postId) != null) return false;
        SavedPost savedPost = new SavedPost(userId, postId);
        savedPostRepo.save(savedPost);
        return true;
    }

    public boolean unsavePost(String userId, String postId) {
        SavedPost savedPost = savedPostRepo.findByUserIdAndPostId(userId, postId);
        if (savedPost != null) {
            savedPostRepo.deleteByUserIdAndPostId(userId, postId);
            return true;
        }
        return false;
    }

    public List<Post> getSavedPosts(String userId) {
        List<SavedPost> savedPosts = savedPostRepo.findByUserId(userId);
        List<Post> posts = new ArrayList<>();
        for (SavedPost sp : savedPosts) {
            Post p = postRepo.findByPostId(sp.getPostId());
            if (p != null) posts.add(p);
        }
        return posts;
    }

    public boolean isPostSaved(String userId, String postId) {
        return savedPostRepo.findByUserIdAndPostId(userId, postId) != null;
    }
}
