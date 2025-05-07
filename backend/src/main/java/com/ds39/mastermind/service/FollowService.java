package com.ds39.mastermind.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ds39.mastermind.model.Follow;
import com.ds39.mastermind.model.User;
import com.ds39.mastermind.repository.FollowRepository;
import com.ds39.mastermind.repository.UserRepository;

@Service
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public FollowService(FollowRepository followRepository, UserRepository userRepository, NotificationService notificationService) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Follow follow(Long followerId, Long followedId) {
        if (followRepository.existsByFollowerIdAndFollowedId(followerId, followedId)) {
            throw new IllegalArgumentException("Already following!");
        }
        User follower = userRepository.findById(followerId).orElseThrow();
        User followed = userRepository.findById(followedId).orElseThrow();

        Follow f = new Follow();
        f.setFollower(follower);
        f.setFollowed(followed);
        Follow saved = followRepository.save(f);

        // Notify the followed user
        notificationService.createNotification(followed, follower.getUsername() + " followed you!", "/profile/" + followerId);
        return saved;
    }
}
