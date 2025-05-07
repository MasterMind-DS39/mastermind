package com.ds39.mastermind.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ds39.mastermind.model.Follow;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerIdAndFollowedId(Long followerId, Long followedId);
}
