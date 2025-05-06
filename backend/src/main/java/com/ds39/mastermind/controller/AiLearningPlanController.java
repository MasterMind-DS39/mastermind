package com.ds39.mastermind.controller;

import com.ds39.mastermind.service.AiLearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiLearningPlanController {

    @Autowired
    private AiLearningPlanService aiService;

    @PostMapping("/generate-plan")
    public String generatePlan(@RequestBody String topic) {
        return aiService.generateLearningPlan(topic);
    }
}