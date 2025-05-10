package com.ds39.mastermind.repository;

import com.ds39.mastermind.entity.SavedPost;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedPostRepo extends CrudRepository<SavedPost, Integer> {
    List<SavedPost> findByUserId(String userId);
    SavedPost findByUserIdAndPostId(String userId, String postId);
    void deleteByUserIdAndPostId(String userId, String postId);
}
