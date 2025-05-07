package com.ds39.mastermind.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ds39.mastermind.model.Reaction;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByPostId(Long postId);
    long countByPostIdAndType(Long postId, Reaction.ReactionType type);
    boolean existsByPostIdAndUserIdAndType(Long postId, Long userId, Reaction.ReactionType type);
}
