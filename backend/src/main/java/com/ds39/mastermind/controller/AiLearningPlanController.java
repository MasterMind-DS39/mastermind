package com.ds39.mastermind.controller;

import com.ds39.mastermind.service.AiLearningPlanService;
import com.ds39.mastermind.service.QuizAiAgent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiLearningPlanController {

    @Autowired
    private AiLearningPlanService aiService;

    @Autowired
    private QuizAiAgent quizAiAgent;

    @PostMapping("/generate-plan")
    public String generatePlan(@RequestBody String topic) {
        return aiService.generateLearningPlan(topic);
    }

    @PostMapping("/generate-quiz")
    public String generateQuiz(@RequestBody List<String> completedLessons) {
        String joinedLessons = String.join("\n", completedLessons);
        return quizAiAgent.generateQuizFromLessons(joinedLessons);
    }

}