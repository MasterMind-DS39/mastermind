package com.ds39.mastermind.service;

import com.ds39.mastermind.model.*;
import com.ds39.mastermind.repository.PostRepository;
import com.ds39.mastermind.repository.ReactionRepository;
import com.ds39.mastermind.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReactionService {
    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ReactionService(ReactionRepository reactionRepository,
                           PostRepository postRepository,
                           UserRepository userRepository,
                           NotificationService notificationService) {
        this.reactionRepository = reactionRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Reaction addReaction(Long userId, Long postId, Reaction.ReactionType type) {
        if (reactionRepository.existsByPostIdAndUserIdAndType(postId, userId, type)) {
            throw new IllegalArgumentException("Already reacted!");
        }
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        Reaction r = new Reaction();
        r.setUser(user);
        r.setPost(post);
        r.setType(type);
        Reaction saved = reactionRepository.save(r);

        // Send notification to post owner for LIKE/HEART by another user
        if (!user.getId().equals(post.getUser().getId())) {
            String msg = user.getUsername() + (type == Reaction.ReactionType.LIKE ? " liked" : " hearted") + " your post.";
            notificationService.createNotification(post.getUser(), msg, "/posts/" + postId);
        }
        return saved;
    }
}
