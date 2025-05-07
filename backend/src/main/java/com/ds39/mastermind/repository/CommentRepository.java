package com.ds39.mastermind.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ds39.mastermind.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
}
