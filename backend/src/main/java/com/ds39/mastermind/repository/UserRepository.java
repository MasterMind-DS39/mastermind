package com.ds39.mastermind.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ds39.mastermind.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
