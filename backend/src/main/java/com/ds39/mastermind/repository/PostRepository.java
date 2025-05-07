package com.ds39.mastermind.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ds39.mastermind.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId);
}
