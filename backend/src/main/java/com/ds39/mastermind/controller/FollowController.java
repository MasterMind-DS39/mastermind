package com.ds39.mastermind.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ds39.mastermind.model.Follow;
import com.ds39.mastermind.service.FollowService;

@RestController
@RequestMapping("/api/follows")
@CrossOrigin(origins = "http://localhost:3000")
public class FollowController {
    private final FollowService followService;
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public Follow follow(@RequestBody Map<String, String> req) {
        Long followerId = Long.parseLong(req.get("followerId"));
        Long followedId = Long.parseLong(req.get("followedId"));
        return followService.follow(followerId, followedId);
    }
}
