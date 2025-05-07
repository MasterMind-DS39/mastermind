package com.ds39.mastermind.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ds39.mastermind.model.Comment;
import com.ds39.mastermind.model.Post;
import com.ds39.mastermind.model.User;
import com.ds39.mastermind.repository.CommentRepository;
import com.ds39.mastermind.repository.PostRepository;
import com.ds39.mastermind.repository.UserRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentService(CommentRepository commentRepository,
                         PostRepository postRepository,
                         UserRepository userRepository,
                         NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Comment addComment(Long userId, Long postId, String content) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(content);
        Comment saved = commentRepository.save(comment);

        // Notify post owner if not commenting the own post
        if (!user.getId().equals(post.getUser().getId())) {
            notificationService.createNotification(post.getUser(),
                user.getUsername() + " commented on your post.",
                "/posts/" + post.getId());
        }
        return saved;
    }

    public List<Comment> getCommentsForPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }
}
