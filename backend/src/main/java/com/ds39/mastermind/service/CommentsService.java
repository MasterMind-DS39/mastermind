// src/main/java/com/ds39/mastermind/service/CommentsService.java
package com.ds39.mastermind.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ds39.mastermind.entity.Comments;
import com.ds39.mastermind.entity.Post;
import com.ds39.mastermind.entity.Users;
import com.ds39.mastermind.repository.CommentRepo;
import com.ds39.mastermind.repository.PostRepo;

@Service
public class CommentsService {
    
    @Autowired
    CommentRepo commentRepo;
    
    @Autowired
    UserService userService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    PostRepo postRepo;

    public Comments submitCommentToDB(Comments comment) {
        Comments savedComment = commentRepo.save(comment);

        // Fetch post to get the owner
        Post post = postRepo.findByPostId(comment.getPostId());
        if (post != null) {
            String recipientUserId = post.getUserId();
            // Avoid notifying self
            if (!recipientUserId.equals(comment.getUserId())) {
                Users commenter = userService.displayUserMetaData(comment.getUserId());
                String commenterUserName = commenter != null ? commenter.getUserName() : "Someone";
                String commentText = comment.getComment();
                try {
                    notificationService.createCommentNotification(
                        recipientUserId,
                        comment.getUserId(),
                        comment.getPostId(),
                        commenterUserName,
                        commentText
                    );
                } catch (Exception e) {
                    // Log but don't fail the comment
                    e.printStackTrace();
                }
            }
        }
        return savedComment;
    }

    public ArrayList<Comments> getAllCommentsForDB(String postId){
        ArrayList<Comments> commentList = commentRepo.findAllByPostId(postId);
        for (int i = 0; i < commentList.size(); i++) {
            Comments commentItem = commentList.get(i);
            commentItem.setUserName(userService.displayUserMetaData(commentItem.getUserId()).getUserName());
        }
        return commentList;
    }
}
