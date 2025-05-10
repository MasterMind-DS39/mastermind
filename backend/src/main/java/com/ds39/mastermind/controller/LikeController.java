package com.ds39.mastermind.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ds39.mastermind.service.LikeService;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@CrossOrigin
@RestController
@RequestMapping("/likes")
public class LikeController {
    
    private static final Logger logger = Logger.getLogger(LikeController.class.getName());
    
    @Autowired
    LikeService likeService;
    
    @PostMapping("/{postId}/{userId}")
    public ResponseEntity<?> toggleLike(@PathVariable("postId") String postId, @PathVariable("userId") String userId) {
        try {
            logger.info("Received like toggle request for post: " + postId + " from user: " + userId);
            
            boolean isLiked = likeService.toggleLike(postId, userId);
            int likeCount = likeService.getLikeCount(postId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("liked", isLiked);
            response.put("likeCount", likeCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.severe("Error toggling like: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to process like");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/{postId}/{userId}")
    public ResponseEntity<?> getLikeStatus(@PathVariable("postId") String postId, @PathVariable("userId") String userId) {
        try {
            boolean isLiked = likeService.hasUserLikedPost(postId, userId);
            int likeCount = likeService.getLikeCount(postId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("liked", isLiked);
            response.put("likeCount", likeCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.severe("Error getting like status: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get like status");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}