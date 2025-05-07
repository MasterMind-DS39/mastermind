package com.ds39.mastermind.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ds39.mastermind.model.User;
import com.ds39.mastermind.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> userOpt = userService.getUserById(id);
        return userOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        Optional<User> userOpt = userService.getUserById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User existingUser = userOpt.get();
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setFullName(user.getFullName());
        existingUser.setBio(user.getBio());
        existingUser.setAvatarUrl(user.getAvatarUrl());
        existingUser.setSkills(user.getSkills());
        User savedUser = userService.saveUser(existingUser);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
    Optional<User> userOpt = userService.getUserById(id);
    if (!userOpt.isPresent()) {
        return ResponseEntity.notFound().build();
    }
    userService.deleteUserById(id);
    return ResponseEntity.noContent().build();
}
}