package com.ds39.mastermind.controller;

import com.ds39.mastermind.entity.Post;
import com.ds39.mastermind.service.SavedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/saved")
public class SavedPostController {

    @Autowired
    SavedPostService savedPostService;

    @PostMapping("/{userId}/{postId}")
    public ResponseEntity<?> savePost(@PathVariable String userId, @PathVariable String postId) {
        boolean result = savedPostService.savePost(userId, postId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{userId}/{postId}")
    public ResponseEntity<?> unsavePost(@PathVariable String userId, @PathVariable String postId) {
        boolean result = savedPostService.unsavePost(userId, postId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Post>> getSavedPosts(@PathVariable String userId) {
        return ResponseEntity.ok(savedPostService.getSavedPosts(userId));
    }

    @GetMapping("/{userId}/{postId}")
    public ResponseEntity<Boolean> isPostSaved(@PathVariable String userId, @PathVariable String postId) {
        return ResponseEntity.ok(savedPostService.isPostSaved(userId, postId));
    }
}
