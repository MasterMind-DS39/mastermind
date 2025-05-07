package com.ds39.mastermind.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ds39.mastermind.model.Reaction;
import com.ds39.mastermind.service.ReactionService;

@RestController
@RequestMapping("/api/reactions")
@CrossOrigin(origins = "http://localhost:3000")
public class ReactionController {
    private final ReactionService reactionService;
    public ReactionController(ReactionService reactionService) {
        this.reactionService = reactionService;
    }

    @PostMapping
    public Reaction addReaction(@RequestBody Map<String, String> req) {
        Long postId = Long.parseLong(req.get("postId"));
        Long userId = Long.parseLong(req.get("userId"));
        Reaction.ReactionType type = Reaction.ReactionType.valueOf(req.get("type"));
        return reactionService.addReaction(userId, postId, type);
    }
}
