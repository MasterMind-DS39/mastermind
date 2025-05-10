package com.ds39.mastermind.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ds39.mastermind.entity.Like;
import com.ds39.mastermind.entity.Post;
import com.ds39.mastermind.entity.Users;
import com.ds39.mastermind.repository.LikeRepo;
import com.ds39.mastermind.repository.PostRepo;

import java.util.Optional;
import java.util.logging.Logger;

@Service
public class LikeService {
    
    private static final Logger logger = Logger.getLogger(LikeService.class.getName());
    
    @Autowired
    LikeRepo likeRepo;
    
    @Autowired
    PostRepo postRepo;

    @Autowired
    NotificationService notificationService;

    @Autowired
    UserService userService;
    
    @Transactional
    public boolean toggleLike(String postId, String userId) {
        try {
            logger.info("Toggling like for postId: " + postId + " and userId: " + userId);
            
            boolean hasLiked = likeRepo.existsByPostIdAndUserId(postId, userId);
            
            if (hasLiked) {
                logger.info("User already liked post. Removing like.");
                likeRepo.deleteByPostIdAndUserId(postId, userId);
                updatePostLikeCount(postId);
                return false;
            } else {
                logger.info("User has not liked post. Adding like.");
                Like like = new Like(postId, userId);
                likeRepo.save(like);
                updatePostLikeCount(postId);
        
                // Send notification with added error handling
                Post post = postRepo.findByPostId(postId);
                if (post != null) {
                    String recipientUserId = post.getUserId();
                    
                    // Check if sender user exists
                    Users senderUser = userService.displayUserMetaData(userId);
                    if (senderUser != null) {
                        String senderUserName = senderUser.getUserName();
                        
                        // Don't notify if user is liking their own post
                        if (!recipientUserId.equals(userId)) {
                            try {
                                notificationService.createLikeNotification(recipientUserId, userId, postId, senderUserName);
                                logger.info("Notification created successfully");
                            } catch (Exception e) {
                                logger.warning("Failed to create notification: " + e.getMessage());
                                // Continue execution even if notification fails
                            }
                        }
                    } else {
                        logger.warning("Sender user not found with ID: " + userId);
                    }
                } else {
                    logger.warning("Post not found with ID: " + postId);
                }
                
                return true;
            }
        } catch (Exception e) {
            logger.severe("Error in toggleLike: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to let Spring handle the response
        }
    }
    
    private void updatePostLikeCount(String postId) {
        try {
            int likeCount = likeRepo.countByPostId(postId);
            
            // Find the post and update like count
            Post post = postRepo.findByPostId(postId);
            
            if (post != null) {
                post.setLikeCount(likeCount);
                postRepo.save(post);
                logger.info("Updated like count for post " + postId + " to " + likeCount);
            } else {
                logger.warning("Post not found when updating like count: " + postId);
            }
        } catch (Exception e) {
            logger.severe("Error updating post like count: " + e.getMessage());
            e.printStackTrace();
            // Don't throw here, as this is a secondary operation
        }
    }
    
    public boolean hasUserLikedPost(String postId, String userId) {
        try {
            return likeRepo.existsByPostIdAndUserId(postId, userId);
        } catch (Exception e) {
            logger.severe("Error checking like status: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    public int getLikeCount(String postId) {
        try {
            return likeRepo.countByPostId(postId);
        } catch (Exception e) {
            logger.severe("Error getting like count: " + e.getMessage());
            e.printStackTrace();
            return 0;
        }
    }
}